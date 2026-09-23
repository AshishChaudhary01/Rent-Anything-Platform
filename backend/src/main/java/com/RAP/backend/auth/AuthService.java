package com.RAP.backend.auth;

import com.RAP.backend.auth.dto.AuthResponse;
import com.RAP.backend.auth.dto.GoogleAuthRequest;
import com.RAP.backend.auth.dto.LoginRequest;
import com.RAP.backend.auth.dto.RegisterRequest;
import com.RAP.backend.auth.dto.UserResponse;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.config.JwtProperties;
import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

	public static final String REFRESH_COOKIE = "refreshToken";

	private final UserRepository userRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final JwtProperties jwtProperties;
	private final GoogleTokenService googleTokenService;

	public AuthService(
			UserRepository userRepository,
			RefreshTokenRepository refreshTokenRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService,
			JwtProperties jwtProperties,
			GoogleTokenService googleTokenService
	) {
		this.userRepository = userRepository;
		this.refreshTokenRepository = refreshTokenRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.jwtProperties = jwtProperties;
		this.googleTokenService = googleTokenService;
	}

	@Transactional
	public UserResponse register(RegisterRequest request) {
		String email = request.email().trim().toLowerCase();
		if (userRepository.existsByEmailIgnoreCase(email)) {
			throw new ApiException(
					HttpStatus.CONFLICT,
					"An account with this email already exists",
					"An account with this email already exists",
					Map.of("email", "An account with this email already exists")
			);
		}

		User user = new User();
		user.setFullName(request.fullName().trim());
		user.setEmail(email);
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole(Role.USER);
		user.setActive(true);
		user.setAccountLocked(false);
		return UserResponse.from(userRepository.save(user));
	}

	@Transactional
	public AuthResponse login(LoginRequest request, HttpServletResponse response) {
		String email = request.email().trim().toLowerCase();
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(AuthService::invalidLogin);

		if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()
				|| !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			throw invalidLogin();
		}
		assertCanAuthenticate(user);

		boolean keepSignedIn = Boolean.TRUE.equals(request.keepSignedIn());
		Duration refreshTtl = keepSignedIn
				? Duration.ofDays(30)
				: Duration.ofDays(jwtProperties.getRefreshTokenDays());
		issueRefreshCookie(user, response, refreshTtl);
		return AuthResponse.from(user, jwtService.createAccessToken(user));
	}

	@Transactional
	public AuthResponse loginWithGoogle(GoogleAuthRequest request, HttpServletResponse response) {
		String token = firstNonBlank(request.accessToken(), request.idToken());
		GoogleTokenService.GoogleProfile profile = googleTokenService.fetchProfile(token);

		User user = userRepository.findByGoogleId(profile.googleId())
				.or(() -> userRepository.findByEmailIgnoreCase(profile.email()))
				.orElseGet(User::new);

		if (user.getId() == null) {
			user.setEmail(profile.email());
			user.setRole(Role.USER);
			user.setActive(true);
			user.setAccountLocked(false);
		} else if (!profile.email().equalsIgnoreCase(user.getEmail())
				&& userRepository.existsByEmailIgnoreCaseAndIdNot(profile.email(), user.getId())) {
			throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
		}

		user.setGoogleId(profile.googleId());
		if (user.getFullName() == null || user.getFullName().isBlank()) {
			user.setFullName(profile.fullName().isBlank() ? profile.email() : profile.fullName());
		}
		user = userRepository.save(user);
		assertCanAuthenticate(user);
		issueRefreshCookie(user, response, Duration.ofDays(jwtProperties.getRefreshTokenDays()));
		return AuthResponse.from(user, jwtService.createAccessToken(user));
	}

	@Transactional
	public AuthResponse refresh(String rawRefreshToken, HttpServletResponse response) {
		if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
		}

		RefreshToken stored = refreshTokenRepository.findByTokenHash(TokenHasher.sha256(rawRefreshToken))
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

		if (!stored.isUsable()) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token is expired or revoked");
		}

		User user = stored.getUser();
		assertCanAuthenticate(user);

		stored.setRevoked(true);
		refreshTokenRepository.save(stored);

		Duration remaining = Duration.between(Instant.now(), stored.getExpiresAt());
		if (remaining.isNegative() || remaining.isZero()) {
			remaining = Duration.ofDays(jwtProperties.getRefreshTokenDays());
		}
		issueRefreshCookie(user, response, remaining);
		return AuthResponse.from(user, jwtService.createAccessToken(user));
	}

	@Transactional
	public void logout(String rawRefreshToken, HttpServletResponse response) {
		if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
			refreshTokenRepository.findByTokenHash(TokenHasher.sha256(rawRefreshToken))
					.ifPresent(token -> {
						token.setRevoked(true);
						refreshTokenRepository.save(token);
					});
		}
		clearRefreshCookie(response);
	}

	private static String firstNonBlank(String first, String second) {
		if (first != null && !first.isBlank()) {
			return first.trim();
		}
		if (second != null && !second.isBlank()) {
			return second.trim();
		}
		throw new ApiException(HttpStatus.BAD_REQUEST, "Google access token is missing");
	}

	private static ApiException invalidLogin() {
		return new ApiException(
				HttpStatus.UNAUTHORIZED,
				"Invalid email or password",
				"Invalid email or password",
				Map.of("password", "Invalid email or password")
		);
	}

	private void assertCanAuthenticate(User user) {
		if (user.isAccountLocked()) {
			throw new ApiException(HttpStatus.FORBIDDEN, "This account is locked");
		}
		if (!user.isActive()) {
			throw new ApiException(HttpStatus.FORBIDDEN, "This account is inactive");
		}
	}

	private void issueRefreshCookie(User user, HttpServletResponse response, Duration ttl) {
		String raw = TokenHasher.newRawToken();
		RefreshToken entity = new RefreshToken();
		entity.setUser(user);
		entity.setTokenHash(TokenHasher.sha256(raw));
		entity.setExpiresAt(Instant.now().plus(ttl));
		refreshTokenRepository.save(entity);
		addCookie(response, raw, ttl);
	}

	private void addCookie(HttpServletResponse response, String raw, Duration ttl) {
		ResponseCookie cookie = baseCookie(raw)
				.maxAge(ttl)
				.build();
		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
	}

	private void clearRefreshCookie(HttpServletResponse response) {
		ResponseCookie cookie = baseCookie("")
				.maxAge(Duration.ZERO)
				.build();
		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
	}

	private ResponseCookie.ResponseCookieBuilder baseCookie(String value) {
		return ResponseCookie.from(REFRESH_COOKIE, value)
				.httpOnly(true)
				.secure(false)
				.path("/")
				.sameSite("None");
	}
}
