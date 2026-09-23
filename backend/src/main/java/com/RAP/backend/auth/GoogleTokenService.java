package com.RAP.backend.auth;

import com.RAP.backend.common.ApiException;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class GoogleTokenService {

	private static final ParameterizedTypeReference<Map<String, Object>> MAP_TYPE =
			new ParameterizedTypeReference<>() {
			};

	private final RestClient restClient;

	public GoogleTokenService() {
		this.restClient = RestClient.create();
	}

	public GoogleProfile fetchProfile(String accessToken) {
		if (accessToken == null || accessToken.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Google access token is missing");
		}
		Map<String, Object> body = restClient.get()
				.uri("https://www.googleapis.com/oauth2/v3/userinfo")
				.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
				.retrieve()
				.onStatus(HttpStatusCode::isError, (request, response) -> {
					throw new ApiException(HttpStatus.UNAUTHORIZED, "Google could not verify this sign-in");
				})
				.body(MAP_TYPE);
		if (body == null) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Google did not return a profile");
		}
		String email = stringValue(body.get("email"));
		String sub = stringValue(body.get("sub"));
		if (email.isBlank() || sub.isBlank()) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Google did not provide an email");
		}
		Object verified = body.get("email_verified");
		boolean emailVerified = Boolean.TRUE.equals(verified) || "true".equalsIgnoreCase(String.valueOf(verified));
		if (!emailVerified) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Google email is not verified");
		}
		return new GoogleProfile(
				sub,
				email.trim().toLowerCase(),
				stringValue(body.get("name")),
				stringValue(body.get("picture"))
		);
	}

	private static String stringValue(Object value) {
		return value == null ? "" : value.toString().trim();
	}

	public record GoogleProfile(String googleId, String email, String fullName, String pictureUrl) {
	}
}
