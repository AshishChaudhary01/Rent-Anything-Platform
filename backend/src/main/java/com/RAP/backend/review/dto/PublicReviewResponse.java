package com.RAP.backend.review.dto;

import java.time.Instant;
import java.util.UUID;

public record PublicReviewResponse(
		UUID id,
		UUID listingId,
		String listingTitle,
		String listingImage,
		UUID authorId,
		String authorName,
		String authorAvatarUrl,
		int rating,
		String comment,
		String role,
		Instant createdAt
) {
}
