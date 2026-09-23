package com.RAP.backend.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
		@NotBlank(message = "Full name is required")
		@Size(max = 120, message = "Full name is too long")
		String fullName,

		@Size(max = 20, message = "Phone number is too long")
		String phone,

		@Size(max = 255, message = "Address is too long")
		String addressLine,

		@Size(max = 80, message = "City is too long")
		String city,

		@Size(max = 80, message = "District is too long")
		String district
) {
}
