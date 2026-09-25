package com.RAP.backend.admin.dto;

import java.math.BigDecimal;

public record AdminOverviewResponse(
		long users,
		long listings,
		long rentals,
		long pendingReports,
		long pendingKyc,
		BigDecimal platformFee,
		BigDecimal gmv,
		BigDecimal commissionPercent,
		BigDecimal commitmentFee,
		boolean kycRequired
) {
}
