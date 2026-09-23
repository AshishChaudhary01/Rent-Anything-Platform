package com.RAP.backend.account.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateContactRequest(
		@Email(message = "Enter a valid email")
		String email,

		@Size(max = 20, message = "Phone number is too long")
		String phone
) {
}
