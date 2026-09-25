package com.RAP.backend.admin.dto;

import jakarta.validation.constraints.NotBlank;

public record ResolveReportRequest(
		@NotBlank String action,
		@NotBlank String notes
) {
}
