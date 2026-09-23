package com.RAP.backend.auth.dto;

import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import java.time.Instant;
import java.util.UUID;

public record UserResponse(
		UUID id,
		String fullName,
		String email,
		Role role,
		Instant createdAt,
		boolean isActive,
		boolean accountLocked,
		Instant lockedAt
) {

	public static UserResponse from(User user) {
		return new UserResponse(
				user.getId(),
				user.getFullName(),
				user.getEmail(),
				user.getRole(),
				user.getCreatedAt(),
				user.isActive(),
				user.isAccountLocked(),
				user.getLockedAt()
		);
	}
}
