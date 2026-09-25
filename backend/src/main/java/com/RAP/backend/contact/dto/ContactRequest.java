package com.RAP.backend.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest(
		@NotBlank(message = "Full name is required")
		@Size(max = 120, message = "Full name is too long")
		String name,

		@NotBlank(message = "Email is required")
		@Email(message = "Enter a valid email")
		@Size(max = 191, message = "Email is too long")
		String email,

		@NotBlank(message = "Message is required")
		@Size(max = 2000, message = "Message is too long")
		String message
) {
}
