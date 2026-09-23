package com.RAP.backend.account.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;

public record SubmitKycRequest(
		@NotBlank(message = "Name as on ID is required")
		@Size(max = 120, message = "Name is too long")
		String fullName,

		@NotNull(message = "Date of birth is required")
		@Past(message = "Date of birth must be in the past")
		@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
		LocalDate dateOfBirth,

		@NotBlank(message = "Document type is required")
		@Size(max = 32, message = "Document type is too long")
		String documentType,

		@NotBlank(message = "Document number is required")
		@Size(max = 64, message = "Document number is too long")
		String documentNumber
) {
}
