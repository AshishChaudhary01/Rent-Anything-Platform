package com.RAP.backend.payment;

import com.RAP.backend.payment.dto.SaveWalletRequest;
import com.RAP.backend.payment.dto.SavedWalletResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/account/wallets")
public class WalletController {

	private final WalletService walletService;

	public WalletController(WalletService walletService) {
		this.walletService = walletService;
	}

	@GetMapping
	public List<SavedWalletResponse> list() {
		return walletService.list();
	}

	@PostMapping
	public SavedWalletResponse save(@Valid @RequestBody SaveWalletRequest request) {
		return walletService.save(request);
	}

	@PatchMapping("/{id}/default")
	public SavedWalletResponse setDefault(@PathVariable UUID id) {
		return walletService.setDefault(id);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable UUID id) {
		walletService.delete(id);
	}
}
