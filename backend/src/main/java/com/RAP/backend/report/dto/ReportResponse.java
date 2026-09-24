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
		String accusedName,
		UUID accusedId,
		UUID rentalId,
		List<String> proofs,
		ReportStatus status,
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
				report.getAccused() == null ? "" : report.getAccused().getFullName(),
				report.getAccused() == null ? null : report.getAccused().getId(),
				report.getRental() == null ? null : report.getRental().getId(),
				proofs,
				report.getStatus(),
				report.getCreatedAt()
		);
	}
}
