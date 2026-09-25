package com.RAP.backend.listing;

import com.RAP.backend.account.AccountReadiness;
import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.listing.dto.ActiveBookingResponse;
import com.RAP.backend.listing.dto.CreateListingRequest;
import com.RAP.backend.listing.dto.ListingActivityResponse;
import com.RAP.backend.listing.dto.ListingPageResponse;
import com.RAP.backend.listing.dto.ListingResponse;
import com.RAP.backend.listing.dto.UpdateListingRequest;
import com.RAP.backend.media.StorageService;
import com.RAP.backend.rental.RentalRepository;
import com.RAP.backend.rental.RentalStatus;
import com.RAP.backend.user.User;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ListingService {

	private static final Set<String> CATEGORIES = Set.of(
			"electronics",
			"adventure-tools",
			"appliances",
			"music",
			"photography",
			"outdoor",
			"home",
			"gaming",
			"other"
	);
	private static final int MAX_MEDIA = 8;

	private final ListingRepository listingRepository;
	private final RentalRepository rentalRepository;
	private final CurrentUser currentUser;
	private final StorageService storageService;

	public ListingService(
			ListingRepository listingRepository,
			RentalRepository rentalRepository,
			CurrentUser currentUser,
			StorageService storageService
	) {
		this.listingRepository = listingRepository;
		this.rentalRepository = rentalRepository;
		this.currentUser = currentUser;
		this.storageService = storageService;
	}

	@Transactional(readOnly = true)
	public ListingPageResponse browse(String category, String query, String sort, int page, int size) {
		User viewer = currentUser.require();
		String categoryFilter = blankToNull(category);
		if (categoryFilter != null && !CATEGORIES.contains(categoryFilter)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown category");
		}
		String search = blankToNull(query);
		if (search != null) {
			search = "%" + search.toLowerCase(Locale.ROOT) + "%";
		}
		Page<Listing> results = listingRepository.searchPublic(
				List.of(ListingStatus.AVAILABLE, ListingStatus.RENTED),
				categoryFilter,
				search,
				PageRequest.of(Math.max(page, 0), clampSize(size), sortBy(sort))
		);
		return ListingPageResponse.from(results.map(listing -> ListingResponse.from(listing, viewer.getId())));
	}

	@Transactional(readOnly = true)
	public List<ListingResponse> mine() {
		User owner = currentUser.require();
		return listingRepository.findByOwnerOrderByCreatedAtDesc(owner).stream()
				.filter(listing -> listing.getStatus() != ListingStatus.REMOVED)
				.map(listing -> toResponse(listing, owner))
				.toList();
	}

	@Transactional(readOnly = true)
	public ListingResponse get(UUID id) {
		User viewer = currentUser.require();
		Listing listing = listingRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
		if (listing.getStatus() == ListingStatus.REMOVED && !listing.getOwner().getId().equals(viewer.getId())) {
			throw new ApiException(HttpStatus.NOT_FOUND, "Listing not found");
		}
		return toResponse(listing, viewer);
	}

	@Transactional
	public ListingResponse create(CreateListingRequest request, List<MultipartFile> files) {
		User owner = currentUser.require();
		if (!AccountReadiness.canTransact(owner)) {
			throw new ApiException(
					HttpStatus.FORBIDDEN,
					"Complete your profile photo, details, and verified KYC before listing an item"
			);
		}
		String category = request.category().trim().toLowerCase(Locale.ROOT);
		if (!CATEGORIES.contains(category)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown category");
		}
		if (files == null || files.isEmpty() || files.stream().allMatch(file -> file == null || file.isEmpty())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Add at least one photo or video");
		}
		if (files.size() > MAX_MEDIA) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "You can add up to 8 photos or videos");
		}

		Listing listing = new Listing();
		listing.setOwner(owner);
		listing.setTitle(request.title().trim());
		listing.setDescription(request.description().trim());
		listing.setCategory(category);
		listing.setDailyRate(request.dailyRate());
		listing.setDeposit(request.deposit());
		listing.setLocation(request.location().trim());
		listing.setLatitude(request.latitude());
		listing.setLongitude(request.longitude());
		listing.setStatus(ListingStatus.AVAILABLE);
		listing = listingRepository.save(listing);
		addMedia(listing, files, 0);
		if (listing.getMedia().isEmpty()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Add at least one photo or video");
		}
		if (listing.getMedia().size() > MAX_MEDIA) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "You can add up to 8 photos or videos");
		}
		return ListingResponse.from(listingRepository.save(listing), owner.getId());
	}

	@Transactional
	public ListingResponse update(UUID id, UpdateListingRequest request, List<MultipartFile> files) {
		User user = currentUser.require();
		Listing listing = requireOwned(id, user);
		if (listing.getStatus() == ListingStatus.RENTED) {
			throw new ApiException(HttpStatus.CONFLICT, "You cannot update a listing while it is rented");
		}
		if (bookingForOwner(listing, user) != null) {
			throw new ApiException(HttpStatus.CONFLICT, "You cannot update a listing while it has an upcoming or active rental");
		}
		listing.setTitle(request.title().trim());
		listing.setDescription(request.description().trim());
		listing.setDailyRate(request.dailyRate());
		listing.setDeposit(request.deposit());
		listing.setLocation(request.location().trim());
		if (request.latitude() != null) {
			listing.setLatitude(request.latitude());
		}
		if (request.longitude() != null) {
			listing.setLongitude(request.longitude());
		}
		if (request.status() != null && !request.status().isBlank()) {
			applyStatusChange(listing, request.status());
		}

		java.util.Set<String> keep = new java.util.LinkedHashSet<>();
		if (request.keepUrls() != null) {
			for (String url : request.keepUrls()) {
				if (url != null && !url.isBlank()) {
					keep.add(url.trim());
				}
			}
		}
		listing.getMedia().removeIf(media -> !keep.contains(media.getUrl()));
		int order = 0;
		for (ListingMedia media : listing.getMedia()) {
			media.setSortOrder(order++);
		}
		addMedia(listing, files, order);
		if (listing.getMedia().isEmpty()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Add at least one photo or video");
		}
		if (listing.getMedia().size() > MAX_MEDIA) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "You can add up to 8 photos or videos");
		}
		return ListingResponse.from(listingRepository.save(listing), user.getId(), bookingForOwner(listing, user), activityFor(listing));
	}

	private ListingResponse toResponse(Listing listing, User viewer) {
		return ListingResponse.from(listing, viewer.getId(), bookingForOwner(listing, viewer), activityFor(listing));
	}

	private List<ListingActivityResponse> activityFor(Listing listing) {
		return rentalRepository.findByListingAndStatusInOrderByStartDateAsc(
						listing,
						RentalStatus.occupying()
				)
				.stream()
				.map(ListingActivityResponse::from)
				.toList();
	}

	private ActiveBookingResponse bookingForOwner(Listing listing, User viewer) {
		if (viewer == null || !listing.getOwner().getId().equals(viewer.getId())) {
			return null;
		}
		return rentalRepository.findFirstByListingAndStatusInOrderByCreatedAtDesc(
						listing,
						RentalStatus.occupying()
				)
				.map(ActiveBookingResponse::from)
				.orElse(null);
	}

	private static void applyStatusChange(Listing listing, String rawStatus) {
		ListingStatus next;
		try {
			next = ListingStatus.valueOf(rawStatus.trim().toUpperCase(Locale.ROOT));
		} catch (IllegalArgumentException ex) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown listing status");
		}
		if (next == ListingStatus.REMOVED || next == listing.getStatus()) {
			return;
		}
		if (next == ListingStatus.UNAVAILABLE) {
			if (listing.getStatus() == ListingStatus.RENTED) {
				throw new ApiException(
						HttpStatus.CONFLICT,
						"You cannot pause a listing while it is currently rented"
				);
			}
			if (listing.getStatus() != ListingStatus.AVAILABLE) {
				throw new ApiException(
						HttpStatus.BAD_REQUEST,
						"Only an active listing can be paused"
				);
			}
		}
		if (next == ListingStatus.AVAILABLE && listing.getStatus() == ListingStatus.RENTED) {
			throw new ApiException(
					HttpStatus.CONFLICT,
					"Finish the rental before making this listing available"
			);
		}
		if (next == ListingStatus.RENTED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Rental status is set when a rental starts");
		}
		listing.setStatus(next);
	}

	private Listing requireOwned(UUID id, User user) {
		Listing listing = listingRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
		if (!listing.getOwner().getId().equals(user.getId())) {
			throw new ApiException(HttpStatus.FORBIDDEN, "You can only update your own listing");
		}
		return listing;
	}

	private void addMedia(Listing listing, List<MultipartFile> files, int startOrder) {
		if (files == null) {
			return;
		}
		int order = startOrder;
		for (MultipartFile file : files) {
			if (file == null || file.isEmpty()) {
				continue;
			}
			boolean video = isVideo(file);
			String publicId = "media-" + order + "-" + UUID.randomUUID().toString().substring(0, 8);
			String url = video
					? storageService.uploadAuto(file, "rap/listings/" + listing.getId(), publicId)
					: storageService.uploadImage(file, "rap/listings/" + listing.getId(), publicId);
			ListingMedia media = new ListingMedia();
			media.setListing(listing);
			media.setUrl(url);
			media.setResourceType(video ? "video" : "image");
			media.setSortOrder(order++);
			listing.getMedia().add(media);
		}
	}

	private static Sort sortBy(String sort) {
		if ("oldest".equals(sort)) {
			return Sort.by(Sort.Direction.ASC, "createdAt");
		}
		if ("price-high".equals(sort)) {
			return Sort.by(Sort.Direction.DESC, "dailyRate");
		}
		if ("price-low".equals(sort)) {
			return Sort.by(Sort.Direction.ASC, "dailyRate");
		}
		if ("name".equals(sort)) {
			return Sort.by(Sort.Direction.ASC, "title");
		}
		return Sort.by(Sort.Direction.DESC, "createdAt");
	}

	private static int clampSize(int size) {
		if (size < 1) {
			return 20;
		}
		return Math.min(size, 50);
	}

	private static String blankToNull(String value) {
		if (value == null || value.isBlank() || "all".equalsIgnoreCase(value)) {
			return null;
		}
		return value.trim();
	}

	private static boolean isVideo(MultipartFile file) {
		String type = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
		if (type.startsWith("video/")) {
			return true;
		}
		String name = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase(Locale.ROOT);
		return name.endsWith(".mp4")
				|| name.endsWith(".mov")
				|| name.endsWith(".webm")
				|| name.endsWith(".m4v")
				|| name.endsWith(".3gp")
				|| name.endsWith(".avi");
	}
}
