package com.RAP.backend.report;

import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.media.StorageService;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalRepository;
import com.RAP.backend.report.dto.ReportResponse;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ReportService {

	private final UserReportRepository reportRepository;
	private final ListingRepository listingRepository;
	private final RentalRepository rentalRepository;
	private final UserRepository userRepository;
	private final StorageService storageService;
	private final CurrentUser currentUser;

	public ReportService(
			UserReportRepository reportRepository,
			ListingRepository listingRepository,
			RentalRepository rentalRepository,
			UserRepository userRepository,
			StorageService storageService,
			CurrentUser currentUser
	) {
		this.reportRepository = reportRepository;
		this.listingRepository = listingRepository;
		this.rentalRepository = rentalRepository;
		this.userRepository = userRepository;
		this.storageService = storageService;
		this.currentUser = currentUser;
	}

	@Transactional(readOnly = true)
	public List<ReportResponse> mine() {
		return reportRepository.findByReporterOrderByCreatedAtDesc(currentUser.require()).stream()
				.map(ReportResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public ReportResponse get(UUID id) {
		User user = currentUser.require();
		UserReport report = reportRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Report not found"));
		if (!report.getReporter().getId().equals(user.getId())) {
			throw new ApiException(HttpStatus.FORBIDDEN, "You can only view your own reports");
		}
		return ReportResponse.from(report);
	}

	@Transactional
	public ReportResponse create(
			String context,
			String reason,
			String detail,
			UUID listingId,
			UUID accusedId,
			UUID rentalId,
			List<MultipartFile> files
	) {
		User reporter = currentUser.require();
		if (detail == null || detail.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Describe what happened");
		}
		if (files == null || files.isEmpty() || files.stream().allMatch(file -> file == null || file.isEmpty())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Add at least one photo or video as proof");
		}
		UserReport report = new UserReport();
		report.setReporter(reporter);
		report.setContext(context == null || context.isBlank() ? "listing" : context.trim().toLowerCase(Locale.ROOT));
		report.setReason(reason == null || reason.isBlank() ? "Other" : reason.trim());
		report.setDetail(detail.trim());
		report.setStatus(ReportStatus.PENDING);
		if (listingId != null) {
			Listing listing = listingRepository.findById(listingId)
					.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
			report.setListing(listing);
			if (accusedId == null) {
				report.setAccused(listing.getOwner());
			}
		}
		if (rentalId != null) {
			Rental rental = rentalRepository.findById(rentalId)
					.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rental not found"));
			boolean participant = rental.getRenter().getId().equals(reporter.getId())
					|| rental.getOwner().getId().equals(reporter.getId());
			if (!participant) {
				throw new ApiException(HttpStatus.FORBIDDEN, "You can only report a rental you are part of");
			}
			report.setRental(rental);
			report.setListing(rental.getListing());
			if (accusedId == null) {
				report.setAccused(rental.getOwner().getId().equals(reporter.getId()) ? rental.getRenter() : rental.getOwner());
			}
		}
		if (accusedId != null) {
			User accused = userRepository.findById(accusedId)
					.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
			if (accused.getId().equals(reporter.getId())) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot report yourself");
			}
			report.setAccused(accused);
		}
		List<String> urls = new ArrayList<>();
		int index = 0;
		for (MultipartFile file : files) {
			if (file == null || file.isEmpty()) {
				continue;
			}
			urls.add(storageService.uploadAuto(file, "rap/reports", "proof-" + index++ + "-" + UUID.randomUUID().toString().substring(0, 8)));
		}
		if (urls.isEmpty()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Add at least one photo or video as proof");
		}
		report.setProofUrls(String.join(",", urls));
		return ReportResponse.from(reportRepository.save(report));
	}
}
