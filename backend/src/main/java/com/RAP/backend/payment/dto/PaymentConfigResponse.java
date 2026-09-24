package com.RAP.backend.payment.dto;

import java.math.BigDecimal;

public record PaymentConfigResponse(
		BigDecimal commitmentFee,
		BigDecimal commissionPercent,
		boolean esewa,
		boolean khalti
) {
}
