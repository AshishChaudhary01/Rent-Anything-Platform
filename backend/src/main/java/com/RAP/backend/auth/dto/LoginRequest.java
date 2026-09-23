package com.RAP.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
		@NotBlank(message = "Email is required")
		@Email(message = "Enter a valid email")
		String email,

		@NotBlank(message = "Password is required")
		String password,

		Boolean keepSignedIn
) {
}
