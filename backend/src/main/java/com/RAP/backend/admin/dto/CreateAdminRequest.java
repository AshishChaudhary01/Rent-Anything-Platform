package com.RAP.backend.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateAdminRequest(
		@NotBlank @Size(max = 120) String fullName,
		@NotBlank @Email String email,
		@NotBlank
		@Size(min = 8, message = "Password must be at least 8 characters long")
		@Pattern(regexp = ".*[^a-zA-Z0-9].*", message = "Password must contain at least one special character")
		@Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter")
		@Pattern(regexp = ".*[0-9].*", message = "Password must contain at least one digit")
		String password,
		String phone
) {
}
