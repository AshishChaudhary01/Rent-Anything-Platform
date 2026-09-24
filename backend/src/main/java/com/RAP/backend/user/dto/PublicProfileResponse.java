package com.RAP.backend.user.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PublicProfileResponse(
		UUID id,
		String fullName,
		String avatarUrl,
		String city,
		String district,
		Instant joinedAt,
		double averageRating,
		long reviewCount,
		long listingCount,
		long completedAsRenter,
		long completedAsOwner,
		List<PublicProfileListingResponse> listings
) {
}
