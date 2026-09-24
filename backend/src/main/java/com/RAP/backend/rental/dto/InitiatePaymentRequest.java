package com.RAP.backend.rental.dto;

import com.RAP.backend.payment.PaymentGateway;
import jakarta.validation.constraints.NotNull;

public record InitiatePaymentRequest(@NotNull PaymentGateway gateway) {
}
