package com.RAP.backend.otp;

import com.RAP.backend.common.ApiException;
import com.RAP.backend.mail.EmailTemplates;
import com.RAP.backend.mail.MailService;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OtpService {

	private static final Duration TTL = Duration.ofMinutes(10);
	private static final Duration RESEND_GAP = Duration.ofSeconds(45);
	private static final int MAX_ATTEMPTS = 5;

	private final EmailOtpRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final MailService mailService;
	private final EmailTemplates templates;
	private final SecureRandom random = new SecureRandom();

	public OtpService(
			EmailOtpRepository repository,
			PasswordEncoder passwordEncoder,
			MailService mailService,
			EmailTemplates templates
	) {
		this.repository = repository;
		this.passwordEncoder = passwordEncoder;
		this.mailService = mailService;
		this.templates = templates;
	}

	@Transactional
	public void send(String rawEmail, OtpPurpose purpose) {
		String email = normalize(rawEmail);
		if (!email.contains("@")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Enter a valid email");
		}
		if (!mailService.isConfigured()) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Email is not configured. Set SMTP in application-local.properties.");
		}
		EmailOtp latest = repository.findTopByEmailAndPurposeAndConsumedAtIsNullOrderByCreatedAtDesc(email, purpose).orElse(null);
		if (latest != null && Instant.now().isBefore(latest.getCreatedAt().plus(RESEND_GAP))) {
			throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Wait a moment before requesting another code");
		}
		if (latest != null) {
			latest.setConsumedAt(Instant.now());
			repository.save(latest);
		}
		String code = String.format("%06d", random.nextInt(1_000_000));
		EmailOtp otp = new EmailOtp();
		otp.setEmail(email);
		otp.setPurpose(purpose);
		otp.setCodeHash(passwordEncoder.encode(code));
		otp.setCreatedAt(Instant.now());
		otp.setExpiresAt(Instant.now().plus(TTL));
		repository.save(otp);
		String heading = purpose == OtpPurpose.RESET_PASSWORD ? "Reset your RAP password" : "Confirm your new email";
		String intro = purpose == OtpPurpose.RESET_PASSWORD
				? "Use this one-time code to choose a new password."
				: "Use this one-time code to confirm this email on your RAP account.";
		try {
			mailService.sendHtml(
					email,
					heading,
					templates.otp(heading, intro, code, (int) TTL.toMinutes()),
					true
			);
		} catch (RuntimeException ex) {
			throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not send the email code. Check SMTP settings.");
		}
	}

	@Transactional
	public void consume(String rawEmail, OtpPurpose purpose, String code) {
		String email = normalize(rawEmail);
		EmailOtp otp = repository.findTopByEmailAndPurposeAndConsumedAtIsNullOrderByCreatedAtDesc(email, purpose)
				.orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Request a new code first"));
		if (Instant.now().isAfter(otp.getExpiresAt())) {
			otp.setConsumedAt(Instant.now());
			repository.save(otp);
			throw new ApiException(HttpStatus.BAD_REQUEST, "Code expired. Request a new one");
		}
		if (otp.getAttempts() >= MAX_ATTEMPTS) {
			otp.setConsumedAt(Instant.now());
			repository.save(otp);
			throw new ApiException(HttpStatus.BAD_REQUEST, "Too many attempts. Request a new code");
		}
		otp.setAttempts(otp.getAttempts() + 1);
		if (code == null || !passwordEncoder.matches(code.trim(), otp.getCodeHash())) {
			repository.save(otp);
			throw new ApiException(HttpStatus.BAD_REQUEST, "Incorrect code");
		}
		otp.setConsumedAt(Instant.now());
		repository.save(otp);
	}

	public static String normalize(String email) {
		return email == null ? "" : email.trim().toLowerCase();
	}
}
