package com.RAP.backend.auth;

import com.RAP.backend.auth.dto.AuthResponse;
import com.RAP.backend.auth.dto.LoginRequest;
import com.RAP.backend.auth.dto.RegisterRequest;
import com.RAP.backend.auth.dto.UserResponse;
import com.RAP.backend.common.ApiError;
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

	public AuthController(AuthService authService) {
		this.authService = authService;
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
	public ResponseEntity<ApiError> google() {
		return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED)
				.body(new ApiError(
						"Google sign-in is not connected yet",
						"Use email and password for now. Google OAuth will be wired after login/register is verified."
				));
	}
}
