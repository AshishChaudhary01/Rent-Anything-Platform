package com.RAP.backend.admin.dto;

import com.RAP.backend.user.KycStatus;
import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record AdminUserResponse(
		UUID id,
		String fullName,
		String email,
		String phone,
		Role role,
		String status,
		KycStatus kycStatus,
		String avatarUrl,
		String addressLine,
		String city,
		String district,
		String kycFullName,
		LocalDate kycDateOfBirth,
		String kycDocumentType,
		String kycDocumentNumber,
		String kycFrontUrl,
		String kycBackUrl,
		String kycNotes,
		Instant createdAt
) {

	public static AdminUserResponse from(User user) {
		String status = !user.isActive() ? "Banned" : user.isAccountLocked() ? "Suspended" : "Active";
		return new AdminUserResponse(
				user.getId(),
				user.getFullName(),
				user.getEmail(),
				user.getPhone(),
				user.getRole(),
				status,
				user.getKycStatus(),
				user.getAvatarUrl(),
				user.getAddressLine(),
				user.getCity(),
				user.getDistrict(),
				user.getKycFullName(),
				user.getKycDateOfBirth(),
				user.getKycDocumentType(),
				user.getKycDocumentNumber(),
				user.getKycFrontUrl(),
				user.getKycBackUrl(),
				user.getKycNotes(),
				user.getCreatedAt()
		);
	}
}
