package com.RAP.backend.otp;

import com.RAP.backend.common.ApiException;
import com.RAP.backend.otp.dto.ResetPasswordRequest;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PasswordResetService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final OtpService otpService;

	public PasswordResetService(
			UserRepository userRepository,
			PasswordEncoder passwordEncoder,
			OtpService otpService
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.otpService = otpService;
	}

	@Transactional
	public void request(String email) {
		String normalized = OtpService.normalize(email);
		User user = userRepository.findByEmailIgnoreCase(normalized).orElse(null);
		if (user == null || user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
			return;
		}
		otpService.send(normalized, OtpPurpose.RESET_PASSWORD);
	}

	@Transactional
	public void confirm(ResetPasswordRequest request) {
		String email = OtpService.normalize(request.email());
		otpService.consume(email, OtpPurpose.RESET_PASSWORD, request.code());
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "No password account matches that email"));
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		userRepository.save(user);
	}
}
