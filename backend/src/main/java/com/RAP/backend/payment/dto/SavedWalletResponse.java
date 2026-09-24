package com.RAP.backend.payment.dto;

import com.RAP.backend.payment.PaymentGateway;
import com.RAP.backend.payment.SavedWallet;
import java.util.UUID;

public record SavedWalletResponse(
		UUID id,
		PaymentGateway gateway,
		String label,
		String accountHint,
		boolean isDefault
) {

	public static SavedWalletResponse from(SavedWallet wallet) {
		return new SavedWalletResponse(
				wallet.getId(),
				wallet.getGateway(),
				wallet.getGateway() == PaymentGateway.ESEWA ? "eSewa" : "Khalti",
				wallet.getPhoneHint(),
				wallet.isDefault()
		);
	}
}
