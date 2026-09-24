package com.RAP.backend.listing.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public record UpdateListingRequest(
		@NotBlank(message = "Title is required")
		@Size(max = 120, message = "Title is too long")
		String title,

		@NotBlank(message = "Description is required")
		@Size(max = 2000, message = "Description is too long")
		String description,

		@NotNull(message = "Daily rate is required")
		@DecimalMin(value = "1", message = "Daily rate must be at least 1")
		BigDecimal dailyRate,

		@NotNull(message = "Deposit is required")
		@DecimalMin(value = "0", message = "Deposit cannot be negative")
		BigDecimal deposit,

		@NotBlank(message = "Meetup area is required")
		@Size(max = 255, message = "Location is too long")
		String location,

		Double latitude,
		Double longitude,
		String status,
		List<String> keepUrls
) {
}
