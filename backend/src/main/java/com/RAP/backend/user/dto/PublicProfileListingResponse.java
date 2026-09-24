package com.RAP.backend.user.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PublicProfileListingResponse(
		UUID id,
		String title,
		String image,
		BigDecimal dailyRate,
		String location,
		String status
) {
}
