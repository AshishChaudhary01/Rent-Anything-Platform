package com.RAP.backend.rental.dto;

import jakarta.validation.constraints.NotBlank;

public record ScheduleReturnRequest(
		@NotBlank String date,
		@NotBlank String time,
		@NotBlank String location,
		Double latitude,
		Double longitude
) {
}
