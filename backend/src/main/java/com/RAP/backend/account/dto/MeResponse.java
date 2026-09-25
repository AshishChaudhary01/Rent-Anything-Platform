package com.RAP.backend.account.dto;

import com.RAP.backend.account.AccountReadiness;
import com.RAP.backend.user.KycStatus;
import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import com.fasterxml.jackson.annotation.JsonProperty;
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
		KycStatus kycStatus,
		boolean hasAvatar,
		boolean profileComplete,
		boolean canTransact,
		@JsonProperty("hasPassword") boolean hasPassword,
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
				user.getKycStatus(),
				AccountReadiness.hasAvatar(user),
				AccountReadiness.profileComplete(user),
				AccountReadiness.canTransact(user),
				user.hasLocalPassword(),
				user.getCreatedAt(),
				user.isActive(),
				user.isAccountLocked(),
				user.getLockedAt()
		);
	}
}
