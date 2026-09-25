package com.RAP.backend.report;

import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.listing.ListingStatus;
import com.RAP.backend.media.StorageService;
import com.RAP.backend.notify.NotificationKind;
import com.RAP.backend.notify.NotificationService;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalRepository;
import com.RAP.backend.report.dto.ReportResponse;
import com.RAP.backend.user.Role;
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
	private final NotificationService notificationService;

	public ReportService(
			UserReportRepository reportRepository,
			ListingRepository listingRepository,
			RentalRepository rentalRepository,
			UserRepository userRepository,
			StorageService storageService,
			CurrentUser currentUser,
			NotificationService notificationService
	) {
		this.reportRepository = reportRepository;
		this.listingRepository = listingRepository;
		this.rentalRepository = rentalRepository;
		this.userRepository = userRepository;
		this.storageService = storageService;
		this.currentUser = currentUser;
		this.notificationService = notificationService;
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
		UserReport saved = reportRepository.save(report);
		notifyStaff(saved);
		return ReportResponse.from(saved);
	}

	@Transactional(readOnly = true)
	public List<ReportResponse> adminAll() {
		currentUser.requireStaff();
		return reportRepository.findAllByOrderByCreatedAtDesc().stream().map(ReportResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public ReportResponse adminGet(UUID id) {
		currentUser.requireStaff();
		return ReportResponse.from(requireReport(id));
	}

	@Transactional
	public ReportResponse resolve(UUID id, String action, String notes) {
		User staff = currentUser.requireStaff();
		if (notes == null || notes.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Add resolution notes before closing");
		}
		UserReport report = requireReport(id);
		if (report.getStatus() == ReportStatus.RESOLVED) {
			return ReportResponse.from(report);
		}
		String decided = action == null || action.isBlank() ? "No action — dismissed" : action.trim();
		report.setStatus(ReportStatus.RESOLVED);
		report.setResolutionAction(decided);
		report.setResolutionNotes(notes.trim());
		String resolverLabel = staff.getFullName() == null || staff.getFullName().isBlank()
				? staff.getEmail()
				: staff.getFullName().trim();
		report.setResolver(staff);
		report.setResolverName(resolverLabel);
		report.setResolverRole(staff.getRole().name());
		report.setResolverEmail(staff.getEmail());
		report.setResolvedAt(java.time.Instant.now().truncatedTo(java.time.temporal.ChronoUnit.MILLIS));
		if (decided.toLowerCase(Locale.ROOT).contains("suspend") && report.getAccused() != null) {
			report.getAccused().setAccountLocked(true);
			report.getAccused().setLockedAt(java.time.Instant.now());
			userRepository.save(report.getAccused());
		}
		if (decided.toLowerCase(Locale.ROOT).contains("listing") && report.getListing() != null) {
			report.getListing().setStatus(ListingStatus.REMOVED);
			listingRepository.save(report.getListing());
		}
		UserReport saved = reportRepository.save(report);
		String listingTitle = saved.getListing() == null ? "a RAP listing" : saved.getListing().getTitle();
		String path = "/user/reports/" + saved.getId();
		String staffPath = "/admin/reports/" + saved.getId();
		notificationService.notify(
				saved.getReporter(),
				NotificationKind.REPORT,
				"Your report was reviewed",
				"RAP closed your report about " + listingTitle + ". Decision: " + decided + ". Reviewed by " + resolverLabel + ".",
				path,
				null,
				true
		);
		if (saved.getAccused() != null) {
			notificationService.notify(
					saved.getAccused(),
					NotificationKind.REPORT,
					"A report about you was closed",
					"RAP reviewed a report involving " + listingTitle + ". Decision: " + decided + ".",
					"/user",
					null,
					true
			);
		}
		notificationService.notify(
				staff,
				NotificationKind.REPORT,
				"Report closed",
				"You closed a report about " + listingTitle + ".",
				staffPath,
				null,
				false
		);
		return ReportResponse.from(saved);
	}

	private UserReport requireReport(UUID id) {
		return reportRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Report not found"));
	}

	private void notifyStaff(UserReport report) {
		String listingTitle = report.getListing() == null ? "a RAP listing" : report.getListing().getTitle();
		String path = "/admin/reports/" + report.getId();
		for (User staff : userRepository.findByRoleIn(List.of(Role.ADMIN, Role.SUPER_ADMIN))) {
			notificationService.notify(
					staff,
					NotificationKind.REPORT,
					"New report to review",
					report.getReporter().getFullName() + " reported " + listingTitle + " (" + report.getReason() + ").",
					path,
					null,
					true
			);
		}
	}
}
