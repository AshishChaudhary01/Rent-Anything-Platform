package com.RAP.backend.listing;

import com.RAP.backend.listing.dto.CreateListingRequest;
import com.RAP.backend.listing.dto.ListingPageResponse;
import com.RAP.backend.listing.dto.ListingResponse;
import com.RAP.backend.listing.dto.UpdateListingRequest;
import com.RAP.backend.review.ReviewService;
import com.RAP.backend.review.dto.ListingReviewsResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/listings")
public class ListingController {

	private final ListingService listingService;
	private final ReviewService reviewService;

	public ListingController(ListingService listingService, ReviewService reviewService) {
		this.listingService = listingService;
		this.reviewService = reviewService;
	}

	@GetMapping
	public ListingPageResponse browse(
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String q,
			@RequestParam(required = false, defaultValue = "newest") String sort,
			@RequestParam(required = false, defaultValue = "0") int page,
			@RequestParam(required = false, defaultValue = "20") int size
	) {
		return listingService.browse(category, q, sort, page, size);
	}

	@GetMapping("/mine")
	public List<ListingResponse> mine() {
		return listingService.mine();
	}

	@GetMapping("/{id}/reviews")
	public ListingReviewsResponse reviews(@PathVariable UUID id) {
		return reviewService.forListing(id);
	}

	@GetMapping("/{id}")
	public ListingResponse get(@PathVariable UUID id) {
		return listingService.get(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ListingResponse create(
			@Valid @ModelAttribute CreateListingRequest request,
			@RequestPart("files") List<MultipartFile> files
	) {
		return listingService.create(request, files);
	}

	@PatchMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ListingResponse update(
			@PathVariable UUID id,
			@Valid @ModelAttribute UpdateListingRequest request,
			@RequestPart(value = "files", required = false) List<MultipartFile> files
	) {
		return listingService.update(id, request, files);
	}
}
