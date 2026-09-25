package com.RAP.backend.notify.dto;

import com.RAP.backend.notify.AppNotification;
import com.RAP.backend.notify.NotificationKind;
import java.time.Instant;
import java.util.UUID;

public record NotificationResponse(
		UUID id,
		NotificationKind kind,
		String title,
		String body,
		String path,
		String image,
		boolean read,
		Instant createdAt
) {
	public static NotificationResponse from(AppNotification item) {
		return new NotificationResponse(
				item.getId(),
				item.getKind(),
				item.getTitle(),
				item.getBody(),
				item.getPath(),
				item.getImage(),
				item.isReadFlag(),
				item.getCreatedAt()
		);
	}
}
