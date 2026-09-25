package com.RAP.backend.auth;

import com.RAP.backend.auth.dto.AuthResponse;
import com.RAP.backend.auth.dto.GoogleAuthRequest;
import com.RAP.backend.auth.dto.LoginRequest;
import com.RAP.backend.auth.dto.RegisterRequest;
import com.RAP.backend.auth.dto.UserResponse;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.config.JwtProperties;
import com.RAP.backend.notify.NotificationService;
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

	private final UserRepository users;
	private final RefreshTokenRepository refreshTokens;
	private final PasswordEncoder encoder;
	private final JwtService jwt;
	private final JwtProperties jwtProps;
	private final GoogleTokenService googleTokens;
	private final NotificationService notifications;

	public AuthService(
			UserRepository users,
			RefreshTokenRepository refreshTokens,
			PasswordEncoder encoder,
			JwtService jwt,
			JwtProperties jwtProps,
			GoogleTokenService googleTokens,
			NotificationService notifications
	) {
		this.users = users;
		this.refreshTokens = refreshTokens;
		this.encoder = encoder;
		this.jwt = jwt;
		this.jwtProps = jwtProps;
		this.googleTokens = googleTokens;
		this.notifications = notifications;
	}

	@Transactional
	public UserResponse register(RegisterRequest request) {
		String email = request.email().trim().toLowerCase();
		if (users.existsByEmailIgnoreCase(email)) {
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
		user.setPasswordHash(encoder.encode(request.password()));
		user.setRole(Role.USER);
		user.setActive(true);
		user.setAccountLocked(false);
		User saved = users.save(user);
		notifications.welcome(saved);
		return UserResponse.from(saved);
	}

	@Transactional
	public AuthResponse login(LoginRequest request, HttpServletResponse response) {
		String email = request.email().trim().toLowerCase();
		User user = users.findByEmailIgnoreCase(email).orElseThrow(AuthService::invalidLogin);

		if (user.getPasswordHash() == null || user.getPasswordHash().isBlank()
				|| !encoder.matches(request.password(), user.getPasswordHash())) {
			throw invalidLogin();
		}
		assertCanAuthenticate(user);

		boolean keepSignedIn = Boolean.TRUE.equals(request.keepSignedIn());
		Duration refreshTtl = keepSignedIn
				? Duration.ofDays(30)
				: Duration.ofDays(jwtProps.getRefreshTokenDays());
		writeRefreshCookie(user, response, refreshTtl);
		return AuthResponse.from(user, jwt.createAccessToken(user));
	}

	@Transactional
	public AuthResponse loginWithGoogle(GoogleAuthRequest request, HttpServletResponse response) {
		String token = firstNonBlank(request.accessToken(), request.idToken());
		GoogleTokenService.GoogleProfile profile = googleTokens.fetchProfile(token);

		User user = users.findByGoogleId(profile.googleId())
				.or(() -> users.findByEmailIgnoreCase(profile.email()))
				.orElseGet(User::new);

		boolean created = user.getId() == null;

		if (user.getId() == null) {
			user.setEmail(profile.email());
			user.setRole(Role.USER);
			user.setActive(true);
			user.setAccountLocked(false);
		} else if (!profile.email().equalsIgnoreCase(user.getEmail())
				&& users.existsByEmailIgnoreCaseAndIdNot(profile.email(), user.getId())) {
			throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
		}

		user.setGoogleId(profile.googleId());
		if (user.getFullName() == null || user.getFullName().isBlank()) {
			user.setFullName(profile.fullName().isBlank() ? profile.email() : profile.fullName());
		}
		user = users.save(user);
		if (created) {
			notifications.welcome(user);
		}
		assertCanAuthenticate(user);
		writeRefreshCookie(user, response, Duration.ofDays(jwtProps.getRefreshTokenDays()));
		return AuthResponse.from(user, jwt.createAccessToken(user));
	}

	@Transactional
	public AuthResponse refresh(String rawRefreshToken, HttpServletResponse response) {
		if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
		}

		RefreshToken stored = refreshTokens.findByTokenHash(TokenHasher.sha256(rawRefreshToken))
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

		if (!stored.isUsable()) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token is expired or revoked");
		}

		User user = stored.getUser();
		assertCanAuthenticate(user);

		stored.setRevoked(true);
		refreshTokens.save(stored);

		Duration remaining = Duration.between(Instant.now(), stored.getExpiresAt());
		if (remaining.isNegative() || remaining.isZero()) {
			remaining = Duration.ofDays(jwtProps.getRefreshTokenDays());
		}
		writeRefreshCookie(user, response, remaining);
		return AuthResponse.from(user, jwt.createAccessToken(user));
	}

	@Transactional
	public void logout(String rawRefreshToken, HttpServletResponse response) {
		if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
			refreshTokens.findByTokenHash(TokenHasher.sha256(rawRefreshToken))
					.ifPresent(token -> {
						token.setRevoked(true);
						refreshTokens.save(token);
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

	private void writeRefreshCookie(User user, HttpServletResponse response, Duration ttl) {
		String cookieValue = TokenHasher.newRawToken();
		RefreshToken storedRefresh = new RefreshToken();
		storedRefresh.setUser(user);
		storedRefresh.setTokenHash(TokenHasher.sha256(cookieValue));
		storedRefresh.setExpiresAt(Instant.now().plus(ttl));
		refreshTokens.save(storedRefresh);
		response.addHeader(
				HttpHeaders.SET_COOKIE,
				baseCookie(cookieValue).maxAge(ttl).build().toString()
		);
	}

	private void clearRefreshCookie(HttpServletResponse response) {
		response.addHeader(
				HttpHeaders.SET_COOKIE,
				baseCookie("").maxAge(Duration.ZERO).build().toString()
		);
	}

	private ResponseCookie.ResponseCookieBuilder baseCookie(String value) {
		return ResponseCookie.from(REFRESH_COOKIE, value)
				.httpOnly(true)
				.secure(true)
				.path("/")
				.sameSite("None");
	}
}
