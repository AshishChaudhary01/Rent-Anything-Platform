package com.RAP.backend.notify;

import com.RAP.backend.notify.dto.NotificationPageResponse;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	@GetMapping
	public NotificationPageResponse mine(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size
	) {
		return notificationService.mine(page, size);
	}

	@PostMapping("/{id}/read")
	public void markRead(@PathVariable UUID id) {
		notificationService.markRead(id);
	}

	@PostMapping("/read-all")
	public void markAllRead() {
		notificationService.markAllRead();
	}
}
