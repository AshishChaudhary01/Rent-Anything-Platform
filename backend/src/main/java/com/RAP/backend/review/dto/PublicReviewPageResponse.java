package com.RAP.backend.review.dto;

import java.util.List;

public record PublicReviewPageResponse(
		double average,
		long count,
		int page,
		int size,
		long total,
		List<PublicReviewResponse> items
) {
}
