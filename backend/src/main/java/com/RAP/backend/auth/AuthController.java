package com.RAP.backend.auth;

import com.RAP.backend.auth.dto.AuthResponse;
import com.RAP.backend.auth.dto.GoogleAuthRequest;
import com.RAP.backend.auth.dto.LoginRequest;
import com.RAP.backend.auth.dto.RegisterRequest;
import com.RAP.backend.auth.dto.UserResponse;
import com.RAP.backend.otp.OtpPurpose;
import com.RAP.backend.otp.PasswordResetService;
import com.RAP.backend.otp.dto.ResetPasswordRequest;
import com.RAP.backend.otp.dto.SendOtpRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthService authService;
	private final PasswordResetService passwordResetService;

	public AuthController(AuthService authService, PasswordResetService passwordResetService) {
		this.authService = authService;
		this.passwordResetService = passwordResetService;
	}

	@PostMapping("/register")
	public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
		return authService.login(request, response);
	}

	@PostMapping("/refresh")
	public AuthResponse refresh(
			@CookieValue(name = AuthService.REFRESH_COOKIE, required = false) String refreshToken,
			HttpServletResponse response
	) {
		return authService.refresh(refreshToken, response);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout(
			@CookieValue(name = AuthService.REFRESH_COOKIE, required = false) String refreshToken,
			HttpServletResponse response
	) {
		authService.logout(refreshToken, response);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/google")
	public AuthResponse google(@RequestBody GoogleAuthRequest request, HttpServletResponse response) {
		return authService.loginWithGoogle(request, response);
	}

	@PostMapping("/otp")
	public ResponseEntity<Void> sendOtp(@Valid @RequestBody SendOtpRequest body) {
		if (body.purpose() != OtpPurpose.RESET_PASSWORD) {
			return ResponseEntity.badRequest().build();
		}
		passwordResetService.request(body.email());
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/password/reset")
	public ResponseEntity<Void> confirmPasswordReset(@Valid @RequestBody ResetPasswordRequest body) {
		passwordResetService.confirm(body);
		return ResponseEntity.noContent().build();
	}
}
