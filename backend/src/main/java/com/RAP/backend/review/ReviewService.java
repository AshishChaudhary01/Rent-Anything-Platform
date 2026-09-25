package com.RAP.backend.review;

import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.cache.RapCacheStore;
import com.RAP.backend.cache.RapCaches;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.review.dto.ListingReviewsResponse;
import com.RAP.backend.review.dto.ReviewResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final ListingRepository listingRepository;
	private final CurrentUser currentUser;
	private final RapCacheStore rapCache;

	public ReviewService(
			ReviewRepository reviewRepository,
			ListingRepository listingRepository,
			CurrentUser currentUser,
			RapCacheStore rapCache
	) {
		this.reviewRepository = reviewRepository;
		this.listingRepository = listingRepository;
		this.currentUser = currentUser;
		this.rapCache = rapCache;
	}

	@Transactional(readOnly = true)
	public ListingReviewsResponse forListing(UUID listingId) {
		Listing listing = listingRepository.findById(listingId)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
		UUID viewerId = currentUser.require().getId();
		return rapCache.getOrLoad(RapCaches.LISTING_REVIEWS, viewerId + "|" + listingId, () -> {
			List<ReviewResponse> items = reviewRepository.findListingReviews(listing).stream()
					.map(review -> ReviewResponse.from(review, viewerId))
					.toList();
			Double average = reviewRepository.averageForListing(listing);
			return new ListingReviewsResponse(average == null ? 0 : average, items.size(), items);
		});
	}
}
