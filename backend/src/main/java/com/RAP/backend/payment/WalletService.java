package com.RAP.backend.payment;

import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.payment.dto.SaveWalletRequest;
import com.RAP.backend.payment.dto.SavedWalletResponse;
import com.RAP.backend.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WalletService {

	private final SavedWalletRepository walletRepository;
	private final CurrentUser currentUser;

	public WalletService(SavedWalletRepository walletRepository, CurrentUser currentUser) {
		this.walletRepository = walletRepository;
		this.currentUser = currentUser;
	}

	@Transactional(readOnly = true)
	public List<SavedWalletResponse> list() {
		return walletRepository.findByUserOrderByIsDefaultDescCreatedAtAsc(currentUser.require()).stream()
				.map(SavedWalletResponse::from)
				.toList();
	}

	@Transactional
	public SavedWalletResponse save(SaveWalletRequest request) {
		User user = currentUser.require();
		String hint = maskPhone(request.phone());
		SavedWallet wallet = walletRepository.findByUserAndGateway(user, request.gateway())
				.orElseGet(SavedWallet::new);
		boolean first = wallet.getId() == null && walletRepository.countByUser(user) == 0;
		wallet.setUser(user);
		wallet.setGateway(request.gateway());
		wallet.setPhoneHint(hint);
		if (first) {
			wallet.setDefault(true);
		}
		return SavedWalletResponse.from(walletRepository.save(wallet));
	}

	@Transactional
	public SavedWalletResponse setDefault(UUID id) {
		User user = currentUser.require();
		SavedWallet target = walletRepository.findByIdAndUser(id, user)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Wallet not found"));
		walletRepository.findByUserOrderByIsDefaultDescCreatedAtAsc(user).forEach(wallet -> {
			wallet.setDefault(wallet.getId().equals(id));
			walletRepository.save(wallet);
		});
		target.setDefault(true);
		return SavedWalletResponse.from(walletRepository.save(target));
	}

	@Transactional
	public void delete(UUID id) {
		User user = currentUser.require();
		SavedWallet wallet = walletRepository.findByIdAndUser(id, user)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Wallet not found"));
		boolean wasDefault = wallet.isDefault();
		walletRepository.delete(wallet);
		if (wasDefault) {
			walletRepository.findByUserOrderByIsDefaultDescCreatedAtAsc(user).stream().findFirst()
					.ifPresent(next -> {
						next.setDefault(true);
						walletRepository.save(next);
					});
		}
	}

	@Transactional
	public void saveIfRequested(User user, PaymentGateway gateway, String phone, boolean saveMethod) {
		if (!saveMethod) {
			return;
		}
		String source = phone != null && !phone.isBlank() ? phone : user.getPhone();
		if (source == null || source.isBlank()) {
			return;
		}
		SavedWallet wallet = walletRepository.findByUserAndGateway(user, gateway).orElseGet(SavedWallet::new);
		boolean first = wallet.getId() == null && walletRepository.countByUser(user) == 0;
		wallet.setUser(user);
		wallet.setGateway(gateway);
		try {
			wallet.setPhoneHint(maskPhone(source));
		} catch (ApiException ignored) {
			return;
		}
		if (first) {
			wallet.setDefault(true);
		}
		walletRepository.save(wallet);
	}

	static String maskPhone(String phone) {
		String digits = phone == null ? "" : phone.replaceAll("\\D", "");
		if (digits.length() < 10) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Enter the 10-digit mobile number registered on that eSewa account");
		}
		digits = digits.substring(digits.length() - 10);
		if (!digits.startsWith("9")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Enter the mobile number registered on that eSewa account");
		}
		return digits.substring(0, 2) + "******" + digits.substring(8);
	}
}
