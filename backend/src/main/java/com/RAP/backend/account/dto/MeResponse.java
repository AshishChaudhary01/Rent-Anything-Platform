package com.RAP.backend.account.dto;

import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import java.time.Instant;
import java.util.UUID;

public record MeResponse(
		UUID id,
		String fullName,
		String email,
		String phone,
		String addressLine,
		String city,
		String district,
		String avatarUrl,
		Role role,
		Instant createdAt,
		boolean isActive,
		boolean accountLocked,
		Instant lockedAt
) {

	public static MeResponse from(User user) {
		return new MeResponse(
				user.getId(),
				user.getFullName(),
				user.getEmail(),
				user.getPhone(),
				user.getAddressLine(),
				user.getCity(),
				user.getDistrict(),
				user.getAvatarUrl(),
				user.getRole(),
				user.getCreatedAt(),
				user.isActive(),
				user.isAccountLocked(),
				user.getLockedAt()
		);
	}
}
