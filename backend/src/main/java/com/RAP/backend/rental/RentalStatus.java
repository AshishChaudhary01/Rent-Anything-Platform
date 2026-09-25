package com.RAP.backend.rental;

import java.util.List;

public enum RentalStatus {
	REQUESTED,
	PENDING_PAYMENT,
	PAID,
	MEETUP_CONFIRMED,
	ACTIVE,
	COMPLETED,
	DECLINED,
	CANCELLED;

	public static List<RentalStatus> occupying() {
		return List.of(PAID, MEETUP_CONFIRMED, ACTIVE);
	}
}
