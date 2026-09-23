package com.RAP.backend.account;

import com.RAP.backend.account.dto.ChangePasswordRequest;
import com.RAP.backend.account.dto.MeResponse;
import com.RAP.backend.account.dto.UpdateContactRequest;
import com.RAP.backend.account.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/account")
public class AccountController {

	private final AccountService accountService;

	public AccountController(AccountService accountService) {
		this.accountService = accountService;
	}

	@GetMapping("/me")
	public MeResponse me() {
		return accountService.me();
	}

	@PatchMapping("/profile")
	public MeResponse updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
		return accountService.updateProfile(request);
	}

	@PatchMapping("/contact")
	public MeResponse updateContact(@Valid @RequestBody UpdateContactRequest request) {
		return accountService.updateContact(request);
	}

	@PostMapping("/password")
	public void changePassword(@Valid @RequestBody ChangePasswordRequest request) {
		accountService.changePassword(request);
	}

	@PostMapping(path = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public MeResponse updateAvatar(@RequestPart("file") MultipartFile file) {
		return accountService.updateAvatar(file);
	}
}
