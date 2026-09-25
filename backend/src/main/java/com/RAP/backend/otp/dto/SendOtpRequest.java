package com.RAP.backend.otp.dto;

import com.RAP.backend.otp.OtpPurpose;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SendOtpRequest(
		@NotBlank(message = "Email is required")
		@Email(message = "Enter a valid email")
		String email,

		@NotNull
		OtpPurpose purpose
) {
}
