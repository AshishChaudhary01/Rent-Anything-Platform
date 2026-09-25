package com.RAP.backend.admin.dto;

public record ReviewKycRequest(
		boolean approved,
		String notes
) {
}
