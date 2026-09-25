package com.RAP.backend.contact;

import com.RAP.backend.common.ApiException;
import com.RAP.backend.contact.dto.ContactRequest;
import com.RAP.backend.contact.dto.ContactResponse;
import com.RAP.backend.mail.EmailTemplates;
import com.RAP.backend.mail.MailService;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

	private static final Logger log = LoggerFactory.getLogger(ContactService.class);

	private final ContactInquiryRepository repository;
	private final MailService mailService;
	private final EmailTemplates templates;
	private final String inbox;
	private final String mailUser;

	public ContactService(
			ContactInquiryRepository repository,
			MailService mailService,
			EmailTemplates templates,
			@Value("${app.contact.inbox:}") String inbox,
			@Value("${spring.mail.username:}") String mailUser
	) {
		this.repository = repository;
		this.mailService = mailService;
		this.templates = templates;
		this.inbox = inbox;
		this.mailUser = mailUser;
	}

	@Transactional
	public ContactResponse submit(ContactRequest request) {
		String name = request.name().trim();
		String email = request.email().trim();
		String message = request.message().trim();
		Instant hourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
		if (repository.countByEmailIgnoreCaseAndCreatedAtAfter(email, hourAgo) >= 5) {
			throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "Please wait before sending another message.");
		}

		ContactInquiry inquiry = new ContactInquiry();
		inquiry.setName(name);
		inquiry.setEmail(email);
		inquiry.setMessage(message);
		repository.save(inquiry);
		log.info("contact inquiry saved from {}", email);

		String staffInbox = firstNonBlank(inbox, mailUser);
		boolean emailed = false;
		if (staffInbox != null && mailService.isConfigured()) {
			mailService.sendHtml(
					staffInbox,
					"RAP contact: " + name,
					templates.contactStaff(name, email, message),
					false,
					email
			);
			mailService.sendHtml(
					email,
					"We received your message",
					templates.contactAck(name),
					false
			);
			emailed = true;
		} else {
			log.warn("Contact inquiry stored without email — SMTP or inbox is not configured");
		}
		return new ContactResponse(true, emailed);
	}

	private static String firstNonBlank(String... values) {
		if (values == null) return null;
		for (String value : values) {
			if (value != null && !value.isBlank()) return value.trim();
		}
		return null;
	}
}
