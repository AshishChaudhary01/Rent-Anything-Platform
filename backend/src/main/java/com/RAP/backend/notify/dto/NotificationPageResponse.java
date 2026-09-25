package com.RAP.backend.notify.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class NotificationPageResponse {

	private final int page;
	private final int size;
	private final long total;
	private final long unread;
	private final List<NotificationResponse> items;

	public NotificationPageResponse(
			int page,
			int size,
			long total,
			long unread,
			List<NotificationResponse> items
	) {
		this.page = page;
		this.size = size;
		this.total = total;
		this.unread = unread;
		this.items = items == null ? List.of() : Collections.unmodifiableList(new ArrayList<>(items));
	}

	public int getPage() {
		return page;
	}

	public int getSize() {
		return size;
	}

	public long getTotal() {
		return total;
	}

	public long getUnread() {
		return unread;
	}

	public List<NotificationResponse> getItems() {
		return items;
	}
}
