package com.RAP.backend.account;

import com.RAP.backend.account.dto.ChangePasswordRequest;
import com.RAP.backend.account.dto.MeResponse;
import com.RAP.backend.account.dto.SubmitKycRequest;
import com.RAP.backend.account.dto.UpdateContactRequest;
import com.RAP.backend.account.dto.UpdateProfileRequest;
import com.RAP.backend.review.dto.PublicReviewPageResponse;
import com.RAP.backend.user.PublicProfileService;
import com.RAP.backend.user.dto.PublicListingPageResponse;
import com.RAP.backend.user.dto.PublicProfileResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/account")
public class AccountController {

	private final AccountService accountService;
	private final PublicProfileService publicProfileService;

	public AccountController(AccountService accountService, PublicProfileService publicProfileService) {
		this.accountService = accountService;
		this.publicProfileService = publicProfileService;
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

	@GetMapping("/profiles/{id}")
	public PublicProfileResponse publicProfile(@PathVariable UUID id) {
		return publicProfileService.get(id);
	}

	@GetMapping("/profiles/{id}/reviews")
	public PublicReviewPageResponse publicReviews(
			@PathVariable UUID id,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "6") int size,
			@RequestParam(defaultValue = "0") int rating,
			@RequestParam(defaultValue = "ALL") String role,
			@RequestParam(defaultValue = "newest") String sort
	) {
		return publicProfileService.reviews(id, page, size, rating, role, sort);
	}

	@GetMapping("/profiles/{id}/listings")
	public PublicListingPageResponse publicListings(
			@PathVariable UUID id,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "9") int size,
			@RequestParam(defaultValue = "ALL") String status,
			@RequestParam(defaultValue = "newest") String sort
	) {
		return publicProfileService.listings(id, page, size, status, sort);
	}

	@PostMapping(path = "/kyc", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public MeResponse submitKyc(
			@Valid @ModelAttribute SubmitKycRequest request,
			@RequestPart("front") MultipartFile front,
			@RequestPart("back") MultipartFile back
	) {
		return accountService.submitKyc(request, front, back);
	}
}
