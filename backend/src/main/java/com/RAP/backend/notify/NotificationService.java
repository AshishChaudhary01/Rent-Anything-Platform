package com.RAP.backend.notify;

import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.config.PaymentProperties;
import com.RAP.backend.mail.EmailTemplates;
import com.RAP.backend.mail.MailService;
import com.RAP.backend.notify.dto.NotificationPageResponse;
import com.RAP.backend.notify.dto.NotificationResponse;
import com.RAP.backend.user.User;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationService {

	private final AppNotificationRepository repository;
	private final CurrentUser currentUser;
	private final MailService mailService;
	private final EmailTemplates templates;
	private final PaymentProperties paymentProperties;

	public NotificationService(
			AppNotificationRepository repository,
			CurrentUser currentUser,
			MailService mailService,
			EmailTemplates templates,
			PaymentProperties paymentProperties
	) {
		this.repository = repository;
		this.currentUser = currentUser;
		this.mailService = mailService;
		this.templates = templates;
		this.paymentProperties = paymentProperties;
	}

	@Transactional
	public void notify(
			User user,
			NotificationKind kind,
			String title,
			String body,
			String path,
			String image,
			boolean email
	) {
		if (user == null) return;
		AppNotification item = new AppNotification();
		item.setUser(user);
		item.setKind(kind);
		item.setTitle(title);
		item.setBody(body);
		item.setPath(path);
		item.setImage(image);
		repository.save(item);
		if (email) {
			String url = frontendUrl(path);
			mailService.sendHtml(
					user.getEmail(),
					title,
					templates.notification(title, body, url, "Open in RAP"),
					false
			);
		}
	}

	public void welcome(User user) {
		notify(
				user,
				NotificationKind.WELCOME,
				"Welcome to RAP",
				"Your account is ready. Complete your profile and KYC to start renting.",
				"/user",
				null,
				false
		);
		mailService.sendHtml(
				user.getEmail(),
				"Welcome to Rent Anything Platform",
				templates.welcome(user.getFullName() == null ? "there" : user.getFullName(), frontendUrl("/user")),
				false
		);
	}

	@Transactional(readOnly = true)
	public NotificationPageResponse mine(int page, int size) {
		User user = currentUser.require();
		int safePage = Math.max(page, 0);
		int safeSize = Math.min(Math.max(size, 1), 30);
		Page<AppNotification> result = repository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(safePage, safeSize));
		return new NotificationPageResponse(
				result.getNumber(),
				result.getSize(),
				result.getTotalElements(),
				repository.countByUserAndReadFlagFalse(user),
				result.getContent().stream().map(NotificationResponse::from).toList()
		);
	}

	@Transactional
	public void markRead(UUID id) {
		User user = currentUser.require();
		AppNotification item = repository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notification not found"));
		if (!item.getUser().getId().equals(user.getId())) {
			throw new ApiException(HttpStatus.FORBIDDEN, "That notification is not yours");
		}
		item.setReadFlag(true);
		repository.save(item);
	}

	@Transactional
	public void markAllRead() {
		User user = currentUser.require();
		repository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(0, 200))
				.forEach(item -> {
					if (!item.isReadFlag()) {
						item.setReadFlag(true);
						repository.save(item);
					}
				});
	}

	private String frontendUrl(String path) {
		String base = paymentProperties.getFrontendBaseUrl();
		if (base == null || base.isBlank()) {
			base = "http://localhost:5173";
		}
		if (path == null || path.isBlank()) {
			return base;
		}
		return path.startsWith("http") ? path : base + path;
	}
}
