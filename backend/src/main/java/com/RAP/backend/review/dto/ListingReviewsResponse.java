package com.RAP.backend.review.dto;

import java.util.List;

public record ListingReviewsResponse(
		double average,
		long count,
		List<ReviewResponse> items
) {
}
