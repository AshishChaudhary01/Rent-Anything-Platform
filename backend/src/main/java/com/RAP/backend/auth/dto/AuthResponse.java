package com.RAP.backend.auth.dto;

import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import java.util.UUID;

public record AuthResponse(
		String accessKey,
		Role role,
		UUID userId,
		boolean isActive
) {

	public static AuthResponse from(User user, String accessKey) {
		return new AuthResponse(accessKey, user.getRole(), user.getId(), user.isActive());
	}
}
