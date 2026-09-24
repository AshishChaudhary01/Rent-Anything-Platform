package com.RAP.backend.rental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.UUID;

public record CreateRentalRequest(
		@NotNull UUID listingId,
		@NotNull LocalDate startDate,
		@NotNull LocalDate endDate,
		@NotBlank String meetupLocation,
		Double meetupLatitude,
		Double meetupLongitude,
		String note
) {
}
