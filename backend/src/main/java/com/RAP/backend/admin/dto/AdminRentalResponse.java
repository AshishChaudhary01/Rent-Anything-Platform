package com.RAP.backend.admin.dto;

import com.RAP.backend.listing.ListingCovers;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record AdminRentalResponse(
		UUID id,
		UUID listingId,
		String listingTitle,
		String image,
		UUID ownerId,
		String ownerName,
		UUID renterId,
		String renterName,
		LocalDate startDate,
		LocalDate endDate,
		RentalStatus status,
		BigDecimal amount,
		BigDecimal platformFee,
		Instant createdAt
) {

	public static AdminRentalResponse from(Rental rental) {
		return new AdminRentalResponse(
				rental.getId(),
				rental.getListing().getId(),
				rental.getListing().getTitle(),
				ListingCovers.imageUrl(rental.getListing()),
				rental.getOwner().getId(),
				rental.getOwner().getFullName(),
				rental.getRenter().getId(),
				rental.getRenter().getFullName(),
				rental.getStartDate(),
				rental.getEndDate(),
				rental.getStatus(),
				rental.getRentalTotal(),
				rental.getPlatformCommission() == null ? BigDecimal.ZERO : rental.getPlatformCommission(),
				rental.getCreatedAt()
		);
	}
}
