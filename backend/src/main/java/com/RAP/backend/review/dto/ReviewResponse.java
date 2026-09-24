package com.RAP.backend.review.dto;

import com.RAP.backend.review.Review;
import java.time.Instant;
import java.util.UUID;

public record ReviewResponse(
		UUID id,
		UUID listingId,
		UUID rentalId,
		UUID authorId,
		String authorName,
		String authorAvatarUrl,
		int rating,
		String comment,
		Instant createdAt,
		boolean mine
) {

	public static ReviewResponse from(Review review, UUID viewerId) {
		UUID authorId = review.getAuthor().getId();
		return new ReviewResponse(
				review.getId(),
				review.getListing().getId(),
				review.getRental().getId(),
				authorId,
				review.getAuthor().getFullName(),
				review.getAuthor().getAvatarUrl(),
				review.getRating(),
				review.getComment(),
				review.getCreatedAt(),
				viewerId != null && viewerId.equals(authorId)
		);
	}

	public static ReviewResponse from(Review review) {
		return from(review, null);
	}
}
