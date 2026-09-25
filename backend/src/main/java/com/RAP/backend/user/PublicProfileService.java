package com.RAP.backend.user;

import com.RAP.backend.common.ApiException;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingCovers;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.listing.ListingStatus;
import com.RAP.backend.cache.RapCacheStore;
import com.RAP.backend.cache.RapCaches;
import com.RAP.backend.rental.RentalRepository;
import com.RAP.backend.rental.RentalStatus;
import com.RAP.backend.review.Review;
import com.RAP.backend.review.ReviewRepository;
import com.RAP.backend.review.dto.PublicReviewPageResponse;
import com.RAP.backend.review.dto.PublicReviewResponse;
import com.RAP.backend.user.dto.PublicListingPageResponse;
import com.RAP.backend.user.dto.PublicProfileListingResponse;
import com.RAP.backend.user.dto.PublicProfileResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicProfileService {

	private final UserRepository userRepository;
	private final ReviewRepository reviewRepository;
	private final ListingRepository listingRepository;
	private final RentalRepository rentalRepository;
	private final RapCacheStore rapCache;

	public PublicProfileService(
			UserRepository userRepository,
			ReviewRepository reviewRepository,
			ListingRepository listingRepository,
			RentalRepository rentalRepository,
			RapCacheStore rapCache
	) {
		this.userRepository = userRepository;
		this.reviewRepository = reviewRepository;
		this.listingRepository = listingRepository;
		this.rentalRepository = rentalRepository;
		this.rapCache = rapCache;
	}

	@Transactional(readOnly = true)
	public PublicProfileResponse get(UUID id) {
		return rapCache.getOrLoad(RapCaches.PUBLIC_PROFILE, id.toString(), () -> loadProfile(id));
	}

	private PublicProfileResponse loadProfile(UUID id) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
		Double average = reviewRepository.averageForSubject(user);
		long reviewCount = reviewRepository.countForSubject(user);
		List<ListingStatus> visible = List.of(ListingStatus.AVAILABLE, ListingStatus.RENTED, ListingStatus.UNAVAILABLE);
		Page<Listing> preview = listingRepository.findByOwnerAndStatusIn(
				user,
				visible,
				PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "updatedAt"))
		);
		List<PublicProfileListingResponse> listingItems = preview.getContent().stream().map(PublicProfileService::toListing).toList();
		return new PublicProfileResponse(
				user.getId(),
				user.getFullName(),
				user.getAvatarUrl(),
				user.getCity(),
				user.getDistrict(),
				user.getCreatedAt(),
				average == null ? 0 : average,
				reviewCount,
				preview.getTotalElements(),
				rentalRepository.countByRenterAndStatus(user, RentalStatus.COMPLETED),
				rentalRepository.countByOwnerAndStatus(user, RentalStatus.COMPLETED),
				listingItems
		);
	}

	@Transactional(readOnly = true)
	public PublicListingPageResponse listings(UUID id, int page, int size, String status, String sort) {
		String key = id + "|" + page + "|" + size + "|" + status + "|" + sort;
		return rapCache.getOrLoad(RapCaches.PUBLIC_LISTINGS, key, () -> loadListings(id, page, size, status, sort));
	}

	private PublicListingPageResponse loadListings(UUID id, int page, int size, String status, String sort) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
		List<ListingStatus> statuses = switch (status == null ? "ALL" : status.toUpperCase()) {
			case "AVAILABLE" -> List.of(ListingStatus.AVAILABLE);
			case "RENTED" -> List.of(ListingStatus.RENTED);
			case "UNAVAILABLE" -> List.of(ListingStatus.UNAVAILABLE);
			default -> List.of(ListingStatus.AVAILABLE, ListingStatus.RENTED, ListingStatus.UNAVAILABLE);
		};
		int safePage = Math.max(page, 0);
		int safeSize = Math.min(Math.max(size, 1), 20);
		Sort order = switch (sort == null ? "newest" : sort.toLowerCase()) {
			case "price" -> Sort.by(Sort.Direction.DESC, "dailyRate");
			case "oldest" -> Sort.by(Sort.Direction.ASC, "createdAt");
			default -> Sort.by(Sort.Direction.DESC, "updatedAt");
		};
		Page<Listing> result = listingRepository.findByOwnerAndStatusIn(user, statuses, PageRequest.of(safePage, safeSize, order));
		return new PublicListingPageResponse(
				result.getNumber(),
				result.getSize(),
				result.getTotalElements(),
				result.getContent().stream().map(PublicProfileService::toListing).toList()
		);
	}

	private static PublicProfileListingResponse toListing(Listing listing) {
		return new PublicProfileListingResponse(
				listing.getId(),
				listing.getTitle(),
				ListingCovers.imageUrl(listing),
				listing.getDailyRate(),
				listing.getLocation(),
				listing.getStatus().name()
		);
	}

	@Transactional(readOnly = true)
	public PublicReviewPageResponse reviews(UUID id, int page, int size, int rating, String role, String sort) {
		String key = id + "|" + page + "|" + size + "|" + rating + "|" + role + "|" + sort;
		return rapCache.getOrLoad(RapCaches.PUBLIC_REVIEWS, key, () -> loadReviews(id, page, size, rating, role, sort));
	}

	private PublicReviewPageResponse loadReviews(UUID id, int page, int size, int rating, String role, String sort) {
		if (!userRepository.existsById(id)) {
			throw new ApiException(HttpStatus.NOT_FOUND, "User not found");
		}
		String roleKey = switch (role == null ? "ALL" : role.toUpperCase()) {
			case "OWNER" -> "OWNER";
			case "RENTER" -> "RENTER";
			default -> "ALL";
		};
		int safeRating = rating < 1 || rating > 5 ? 0 : rating;
		int safePage = Math.max(page, 0);
		int safeSize = Math.min(Math.max(size, 1), 20);
		Sort order = "rating".equalsIgnoreCase(sort)
				? Sort.by(Sort.Direction.DESC, "rating", "createdAt")
				: Sort.by(Sort.Direction.DESC, "createdAt");
		Page<Review> result = reviewRepository.searchForSubject(id, safeRating, roleKey, PageRequest.of(safePage, safeSize, order));
		Double average = reviewRepository.averageForSubject(userRepository.getReferenceById(id));
		List<PublicReviewResponse> items = result.getContent().stream().map(review -> {
			boolean asOwner = review.getListing().getOwner().getId().equals(review.getSubject().getId());
			return new PublicReviewResponse(
					review.getId(),
					review.getListing().getId(),
					review.getListing().getTitle(),
					ListingCovers.imageUrl(review.getListing()),
					review.getAuthor().getId(),
					review.getAuthor().getFullName(),
					review.getAuthor().getAvatarUrl(),
					review.getRating(),
					review.getComment(),
					asOwner ? "OWNER" : "RENTER",
					review.getCreatedAt()
			);
		}).toList();
		return new PublicReviewPageResponse(
				average == null ? 0 : average,
				reviewRepository.countForSubject(userRepository.getReferenceById(id)),
				result.getNumber(),
				result.getSize(),
				result.getTotalElements(),
				items
		);
	}
}
