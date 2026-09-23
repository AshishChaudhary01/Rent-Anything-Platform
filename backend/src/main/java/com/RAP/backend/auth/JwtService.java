package com.RAP.backend.auth;

import com.RAP.backend.config.JwtProperties;
import com.RAP.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

	private final JwtProperties properties;
	private final SecretKey key;

	public JwtService(JwtProperties properties) {
		this.properties = properties;
		this.key = Keys.hmacShaKeyFor(properties.getSecret().getBytes(StandardCharsets.UTF_8));
	}

	public String createAccessToken(User user) {
		Instant now = Instant.now();
		Instant expiry = now.plusSeconds(properties.getAccessTokenMinutes() * 60);
		return Jwts.builder()
				.subject(user.getId().toString())
				.claim("role", user.getRole().name())
				.claim("email", user.getEmail())
				.issuedAt(Date.from(now))
				.expiration(Date.from(expiry))
				.signWith(key)
				.compact();
	}

	public Claims parse(String token) {
		return Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	public UUID parseUserId(String token) {
		return UUID.fromString(parse(token).getSubject());
	}
}
