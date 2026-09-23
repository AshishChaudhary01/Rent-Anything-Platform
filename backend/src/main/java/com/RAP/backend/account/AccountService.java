package com.RAP.backend.account;

import com.RAP.backend.account.dto.ChangePasswordRequest;
import com.RAP.backend.account.dto.MeResponse;
import com.RAP.backend.account.dto.SubmitKycRequest;
import com.RAP.backend.account.dto.UpdateContactRequest;
import com.RAP.backend.account.dto.UpdateProfileRequest;
import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.media.StorageService;
import com.RAP.backend.user.KycStatus;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import java.time.LocalDate;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AccountService {

	private static final Set<String> IMAGE_TYPES = Set.of(
			"image/jpeg",
			"image/jpg",
			"image/pjpeg",
			"image/png",
			"image/webp",
			"image/gif"
	);

	private final CurrentUser currentUser;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final StorageService storageService;

	public AccountService(
			CurrentUser currentUser,
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			StorageService storageService
	) {
		this.currentUser = currentUser;
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.storageService = storageService;
	}

	public MeResponse me() {
		return MeResponse.from(currentUser.require());
	}

	@Transactional
	public MeResponse updateProfile(UpdateProfileRequest request) {
		User user = currentUser.require();
		user.setFullName(request.fullName().trim());
		applyPhone(user, request.phone());
		user.setAddressLine(blankToNull(request.addressLine()));
		user.setCity(blankToNull(request.city()));
		user.setDistrict(blankToNull(request.district()));
		return MeResponse.from(userRepository.save(user));
	}

	@Transactional
	public MeResponse updateContact(UpdateContactRequest request) {
		User user = currentUser.require();
		if (request.email() != null && !request.email().isBlank()) {
			String email = request.email().trim().toLowerCase(Locale.ROOT);
			if (userRepository.existsByEmailIgnoreCaseAndIdNot(email, user.getId())) {
				throw new ApiException(
						HttpStatus.CONFLICT,
						"An account with this email already exists",
						"An account with this email already exists",
						Map.of("email", "An account with this email already exists")
				);
			}
			user.setEmail(email);
		}
		if (request.phone() != null) {
			applyPhone(user, request.phone());
		}
		return MeResponse.from(userRepository.save(user));
	}

	@Transactional
	public void changePassword(ChangePasswordRequest request) {
		User user = currentUser.require();
		if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
			throw new ApiException(
					HttpStatus.BAD_REQUEST,
					"This account uses Google sign-in",
					"This account uses Google sign-in",
					Map.of("currentPassword", "This account uses Google sign-in. Set a password after linking one.")
			);
		}
		if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
			throw new ApiException(
					HttpStatus.BAD_REQUEST,
					"Current password is incorrect",
					"Current password is incorrect",
					Map.of("currentPassword", "Current password is incorrect")
			);
		}
		user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
		userRepository.save(user);
	}

	@Transactional
	public MeResponse updateAvatar(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ApiException(
					HttpStatus.BAD_REQUEST,
					"Choose an image file",
					"Choose an image file",
					Map.of("avatar", "Choose an image file")
			);
		}
		String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
		if (!IMAGE_TYPES.contains(contentType) && !looksLikeImage(file.getOriginalFilename())) {
			throw new ApiException(
					HttpStatus.BAD_REQUEST,
					"Use a JPEG, PNG, WebP, or GIF image",
					"Use a JPEG, PNG, WebP, or GIF image",
					Map.of("avatar", "Use a JPEG, PNG, WebP, or GIF image")
			);
		}

		User user = currentUser.require();
		String url = storageService.uploadImage(file, "rap/avatars", user.getId().toString());
		user.setAvatarUrl(url);
		return MeResponse.from(userRepository.save(user));
	}

	@Transactional
	public MeResponse submitKyc(SubmitKycRequest request, MultipartFile front, MultipartFile back) {
		User user = currentUser.require();
		if (user.getKycStatus() == KycStatus.VERIFIED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Your identity is already verified");
		}
		LocalDate oldest = LocalDate.now().minusYears(18);
		if (request.dateOfBirth().isAfter(oldest)) {
			throw new ApiException(
					HttpStatus.BAD_REQUEST,
					"You must be at least 18 years old",
					"You must be at least 18 years old",
					Map.of("dateOfBirth", "You must be at least 18 years old")
			);
		}
		requireImage(front, "front");
		requireImage(back, "back");
		String userId = user.getId().toString();
		user.setKycFullName(request.fullName().trim());
		user.setKycDateOfBirth(request.dateOfBirth());
		user.setKycDocumentType(request.documentType().trim());
		user.setKycDocumentNumber(request.documentNumber().trim());
		user.setKycFrontUrl(storageService.uploadImage(front, "rap/kyc/" + userId, "front"));
		user.setKycBackUrl(storageService.uploadImage(back, "rap/kyc/" + userId, "back"));
		user.setKycStatus(KycStatus.PENDING);
		return MeResponse.from(userRepository.save(user));
	}

	private void requireImage(MultipartFile file, String field) {
		if (file == null || file.isEmpty()) {
			throw new ApiException(
					HttpStatus.BAD_REQUEST,
					"Add photos of both sides of your ID",
					"Add photos of both sides of your ID",
					Map.of(field, "This photo is required")
			);
		}
		String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase(Locale.ROOT);
		if (!IMAGE_TYPES.contains(contentType) && !looksLikeImage(file.getOriginalFilename())) {
			throw new ApiException(
					HttpStatus.BAD_REQUEST,
					"Use a JPEG, PNG, WebP, or GIF image",
					"Use a JPEG, PNG, WebP, or GIF image",
					Map.of(field, "Use a JPEG, PNG, WebP, or GIF image")
			);
		}
	}

	private static boolean looksLikeImage(String filename) {
		if (filename == null) {
			return false;
		}
		String lower = filename.toLowerCase(Locale.ROOT);
		return lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png")
				|| lower.endsWith(".webp") || lower.endsWith(".gif");
	}

	private void applyPhone(User user, String rawPhone) {
		if (rawPhone == null) {
			return;
		}
		String phone = rawPhone.trim();
		if (phone.isEmpty()) {
			user.setPhone(null);
			return;
		}
		if (userRepository.existsByPhoneAndIdNot(phone, user.getId())) {
			throw new ApiException(
					HttpStatus.CONFLICT,
					"An account with this phone number already exists",
					"An account with this phone number already exists",
					Map.of("phone", "An account with this phone number already exists")
			);
		}
		user.setPhone(phone);
	}

	private static String blankToNull(String value) {
		if (value == null) {
			return null;
		}
		String trimmed = value.trim();
		return trimmed.isEmpty() ? null : trimmed;
	}
}
