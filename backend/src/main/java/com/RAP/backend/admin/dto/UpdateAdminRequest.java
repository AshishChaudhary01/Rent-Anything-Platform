package com.RAP.backend.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateAdminRequest(
		@NotBlank @Size(max = 120) String fullName,
		@NotBlank @Email String email,
		String password,
		String phone
) {
}
