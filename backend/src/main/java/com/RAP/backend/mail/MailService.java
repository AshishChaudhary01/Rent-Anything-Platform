package com.RAP.backend.mail;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

	private static final Logger log = LoggerFactory.getLogger(MailService.class);

	private final ApplicationContext context;
	private final String from;

	public MailService(
			ApplicationContext context,
			@Value("${spring.mail.username:}") String from
	) {
		this.context = context;
		this.from = from;
	}

	public boolean isConfigured() {
		return resolveSender() != null && from != null && !from.isBlank();
	}

	public void sendHtml(String to, String subject, String html) {
		sendHtml(to, subject, html, true);
	}

	public void sendHtml(String to, String subject, String html, boolean required) {
		if (to == null || to.isBlank()) {
			if (required) {
				throw new IllegalStateException("Missing recipient");
			}
			return;
		}
		JavaMailSender sender = resolveSender();
		if (sender == null || from == null || from.isBlank()) {
			log.warn("Email not sent to {} — SMTP is not configured", to);
			if (required) {
				throw new IllegalStateException("Email is not configured");
			}
			return;
		}
		try {
			MimeMessage message = sender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
			helper.setFrom(from);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(html, true);
			sender.send(message);
		} catch (Exception ex) {
			log.error("Could not send email to {}", to, ex);
			if (required) {
				throw new IllegalStateException("Could not send email", ex);
			}
		}
	}

	private JavaMailSender resolveSender() {
		try {
			String[] names = context.getBeanNamesForType(JavaMailSender.class);
			if (names.length == 0) {
				return null;
			}
			return context.getBean(names[0], JavaMailSender.class);
		} catch (Throwable ex) {
			log.debug("JavaMailSender is not available", ex);
			return null;
		}
	}
}
