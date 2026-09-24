package com.RAP.backend.listing.dto;

import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalStatus;
import java.time.LocalDate;

public record ListingActivityResponse(
		LocalDate startDate,
		LocalDate endDate,
		RentalStatus status
) {

	public static ListingActivityResponse from(Rental rental) {
		return new ListingActivityResponse(rental.getStartDate(), rental.getEndDate(), rental.getStatus());
	}
}
