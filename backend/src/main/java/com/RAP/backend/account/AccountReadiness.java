package com.RAP.backend.account;

import com.RAP.backend.user.KycStatus;
import com.RAP.backend.user.User;

public final class AccountReadiness {

	private AccountReadiness() {
	}

	public static boolean hasAvatar(User user) {
		String url = user.getAvatarUrl();
		if (url == null || url.isBlank()) {
			return false;
		}
		String lower = url.toLowerCase();
		return !lower.contains("googleusercontent.com") && !lower.contains("lh3.google.com");
	}

	public static boolean profileComplete(User user) {
		return notBlank(user.getFullName())
				&& notBlank(user.getPhone())
				&& notBlank(user.getAddressLine())
				&& notBlank(user.getCity())
				&& notBlank(user.getDistrict());
	}

	public static boolean canTransact(User user) {
		return hasAvatar(user)
				&& profileComplete(user)
				&& user.getKycStatus() == KycStatus.VERIFIED;
	}

	private static boolean notBlank(String value) {
		return value != null && !value.isBlank();
	}
}
