package com.RAP.backend.report.dto;

import com.RAP.backend.report.ReportStatus;
import com.RAP.backend.report.UserReport;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public record ReportResponse(
		UUID id,
		String context,
		String reason,
		String detail,
		String listingTitle,
		UUID listingId,
		String reporterName,
		UUID reporterId,
		String accusedName,
		UUID accusedId,
		UUID rentalId,
		List<String> proofs,
		ReportStatus status,
		String resolutionAction,
		String resolutionNotes,
		UUID resolverId,
		String resolverName,
		String resolverRole,
		String resolverEmail,
		Instant resolvedAt,
		Instant createdAt
) {

	public static ReportResponse from(UserReport report) {
		List<String> proofs = report.getProofUrls() == null || report.getProofUrls().isBlank()
				? List.of()
				: Arrays.stream(report.getProofUrls().split(",")).filter(item -> !item.isBlank()).toList();
		return new ReportResponse(
				report.getId(),
				report.getContext(),
				report.getReason(),
				report.getDetail(),
				report.getListing() == null ? "" : report.getListing().getTitle(),
				report.getListing() == null ? null : report.getListing().getId(),
				report.getReporter() == null ? "" : report.getReporter().getFullName(),
				report.getReporter() == null ? null : report.getReporter().getId(),
				report.getAccused() == null ? "" : report.getAccused().getFullName(),
				report.getAccused() == null ? null : report.getAccused().getId(),
				report.getRental() == null ? null : report.getRental().getId(),
				proofs,
				report.getStatus(),
				report.getResolutionAction(),
				report.getResolutionNotes(),
				report.getResolver() == null ? null : report.getResolver().getId(),
				report.getResolverName() != null && !report.getResolverName().isBlank()
						? report.getResolverName()
						: report.getResolver() == null ? null : report.getResolver().getFullName(),
				report.getResolverRole() != null && !report.getResolverRole().isBlank()
						? report.getResolverRole()
						: report.getResolver() == null ? null : report.getResolver().getRole().name(),
				report.getResolverEmail() != null && !report.getResolverEmail().isBlank()
						? report.getResolverEmail()
						: report.getResolver() == null ? null : report.getResolver().getEmail(),
				report.getResolvedAt(),
				report.getCreatedAt()
		);
	}
}
