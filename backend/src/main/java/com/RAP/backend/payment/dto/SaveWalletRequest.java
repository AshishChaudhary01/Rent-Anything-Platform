package com.RAP.backend.payment.dto;

import com.RAP.backend.payment.PaymentGateway;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SaveWalletRequest(
		@NotNull PaymentGateway gateway,
		@NotBlank String phone
) {
}
