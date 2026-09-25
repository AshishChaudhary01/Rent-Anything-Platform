package com.RAP.backend.admin.dto;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingCovers;
import com.RAP.backend.listing.ListingStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AdminListingResponse(
		UUID id,
		String title,
		String description,
		String category,
		String location,
		BigDecimal dailyRate,
		BigDecimal deposit,
		ListingStatus status,
		String image,
		UUID ownerId,
		String ownerName,
		Instant createdAt
) {

	public static AdminListingResponse from(Listing listing) {
		return new AdminListingResponse(
				listing.getId(),
				listing.getTitle(),
				listing.getDescription(),
				listing.getCategory(),
				listing.getLocation(),
				listing.getDailyRate(),
				listing.getDeposit(),
				listing.getStatus(),
				ListingCovers.imageUrl(listing),
				listing.getOwner().getId(),
				listing.getOwner().getFullName(),
				listing.getCreatedAt()
		);
	}
}
