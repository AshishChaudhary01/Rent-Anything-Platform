package com.RAP.backend.payment.dto;

import com.RAP.backend.payment.PaymentGateway;
import java.util.Map;

public record PaymentInitiateResponse(
		PaymentGateway gateway,
		String formAction,
		Map<String, String> formFields,
		String paymentUrl
) {
}
