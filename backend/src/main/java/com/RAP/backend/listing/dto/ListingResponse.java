package com.RAP.backend.listing.dto;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ListingResponse(
		UUID id,
		String title,
		String description,
		String category,
		BigDecimal dailyRate,
		BigDecimal deposit,
		String location,
		Double latitude,
		Double longitude,
		ListingStatus status,
		UUID ownerId,
		String ownerName,
		boolean owner,
		List<ListingMediaResponse> media,
		Instant createdAt,
		Instant updatedAt,
		ActiveBookingResponse activeBooking,
		List<ListingActivityResponse> activity
) {

	public static ListingResponse from(Listing listing, UUID viewerId) {
		return from(listing, viewerId, null, List.of());
	}

	public static ListingResponse from(Listing listing, UUID viewerId, ActiveBookingResponse booking) {
		return from(listing, viewerId, booking, List.of());
	}

	public static ListingResponse from(
			Listing listing,
			UUID viewerId,
			ActiveBookingResponse booking,
			List<ListingActivityResponse> activity
	) {
		return new ListingResponse(
				listing.getId(),
				listing.getTitle(),
				listing.getDescription(),
				listing.getCategory(),
				listing.getDailyRate(),
				listing.getDeposit(),
				listing.getLocation(),
				listing.getLatitude(),
				listing.getLongitude(),
				listing.getStatus(),
				listing.getOwner().getId(),
				listing.getOwner().getFullName(),
				viewerId != null && viewerId.equals(listing.getOwner().getId()),
				listing.getMedia().stream().map(ListingMediaResponse::from).toList(),
				listing.getCreatedAt(),
				listing.getUpdatedAt(),
				booking,
				activity == null ? List.of() : activity
		);
	}
}
