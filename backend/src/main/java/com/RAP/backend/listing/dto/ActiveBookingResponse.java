package com.RAP.backend.listing.dto;

import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalStatus;
import java.time.LocalDate;
import java.util.UUID;

public record ActiveBookingResponse(
		UUID rentalId,
		String renterName,
		UUID renterId,
		LocalDate startDate,
		LocalDate endDate,
		RentalStatus status,
		String meetupLocation
) {

	public static ActiveBookingResponse from(Rental rental) {
		return new ActiveBookingResponse(
				rental.getId(),
				rental.getRenter().getFullName(),
				rental.getRenter().getId(),
				rental.getStartDate(),
				rental.getEndDate(),
				rental.getStatus(),
				rental.getMeetupLocation()
		);
	}
}
