package com.RAP.backend.admin;

import com.RAP.backend.admin.dto.AdminListingResponse;
import com.RAP.backend.admin.dto.AdminOverviewResponse;
import com.RAP.backend.admin.dto.AdminRentalResponse;
import com.RAP.backend.admin.dto.AdminUserResponse;
import com.RAP.backend.admin.dto.CreateAdminRequest;
import com.RAP.backend.admin.dto.ReviewKycRequest;
import com.RAP.backend.admin.dto.UpdateAdminRequest;
import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.auth.RefreshTokenRepository;
import com.RAP.backend.cache.RapCacheStore;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.config.PaymentProperties;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.listing.ListingStatus;
import com.RAP.backend.notify.AppNotificationRepository;
import com.RAP.backend.notify.NotificationKind;
import com.RAP.backend.notify.NotificationService;
import com.RAP.backend.otp.EmailOtpRepository;
import com.RAP.backend.payment.SavedWalletRepository;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalRepository;
import com.RAP.backend.rental.RentalStatus;
import com.RAP.backend.report.ReportStatus;
import com.RAP.backend.report.UserReportRepository;
import com.RAP.backend.user.KycStatus;
import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

	private final CurrentUser currentUser;
	private final UserRepository userRepository;
	private final ListingRepository listingRepository;
	private final RentalRepository rentalRepository;
	private final UserReportRepository reportRepository;
	private final PaymentProperties paymentProperties;
	private final PasswordEncoder passwordEncoder;
	private final NotificationService notificationService;
	private final AppNotificationRepository notificationRepository;
	private final SavedWalletRepository walletRepository;
	private final RefreshTokenRepository refreshTokenRepository;
	private final EmailOtpRepository emailOtpRepository;
	private final RapCacheStore rapCache;

	public AdminService(
			CurrentUser currentUser,
			UserRepository userRepository,
			ListingRepository listingRepository,
			RentalRepository rentalRepository,
			UserReportRepository reportRepository,
			PaymentProperties paymentProperties,
			PasswordEncoder passwordEncoder,
			NotificationService notificationService,
			AppNotificationRepository notificationRepository,
			SavedWalletRepository walletRepository,
			RefreshTokenRepository refreshTokenRepository,
			EmailOtpRepository emailOtpRepository,
			RapCacheStore rapCache
	) {
		this.currentUser = currentUser;
		this.userRepository = userRepository;
		this.listingRepository = listingRepository;
		this.rentalRepository = rentalRepository;
		this.reportRepository = reportRepository;
		this.paymentProperties = paymentProperties;
		this.passwordEncoder = passwordEncoder;
		this.notificationService = notificationService;
		this.notificationRepository = notificationRepository;
		this.walletRepository = walletRepository;
		this.refreshTokenRepository = refreshTokenRepository;
		this.emailOtpRepository = emailOtpRepository;
		this.rapCache = rapCache;
	}

	@Transactional(readOnly = true)
	public AdminOverviewResponse overview() {
		currentUser.requireStaff();
		BigDecimal gmv = BigDecimal.ZERO;
		BigDecimal fee = BigDecimal.ZERO;
		for (Rental rental : rentalRepository.findAll()) {
			if (rental.getStatus() == RentalStatus.COMPLETED || rental.getStatus() == RentalStatus.ACTIVE) {
				if (rental.getRentalTotal() != null) {
					gmv = gmv.add(rental.getRentalTotal());
				}
			}
			if (rental.getPlatformCommission() != null) {
				fee = fee.add(rental.getPlatformCommission());
			}
		}
		return new AdminOverviewResponse(
				userRepository.countByRole(Role.USER),
				listingRepository.count(),
				rentalRepository.count(),
				reportRepository.countByStatus(ReportStatus.PENDING),
				userRepository.countByKycStatusAndRole(KycStatus.PENDING, Role.USER),
				fee,
				gmv,
				paymentProperties.getCommissionPercent(),
				paymentProperties.getCommitmentFee(),
				true
		);
	}

	@Transactional(readOnly = true)
	public List<AdminUserResponse> users() {
		currentUser.requireStaff();
		return userRepository.findAll().stream()
				.filter(user -> user.getRole() == Role.USER)
				.map(AdminUserResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public AdminUserResponse user(UUID id) {
		currentUser.requireStaff();
		return AdminUserResponse.from(requireUser(id));
	}

	@Transactional
	public AdminUserResponse setUserStatus(UUID id, String status) {
		currentUser.requireStaff();
		User user = requireUser(id);
		if (user.getRole() != Role.USER) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Only member accounts can be suspended here");
		}
		String next = status == null ? "" : status.trim().toLowerCase(Locale.ROOT);
		if (next.equals("suspended")) {
			user.setAccountLocked(true);
			user.setLockedAt(java.time.Instant.now());
			user.setActive(true);
		} else if (next.equals("banned")) {
			user.setActive(false);
			user.setAccountLocked(true);
			user.setLockedAt(java.time.Instant.now());
		} else if (next.equals("active") || next.equals("restore")) {
			user.setActive(true);
			user.setAccountLocked(false);
			user.setLockedAt(null);
		} else {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Use Active, Suspended, or Banned");
		}
		return AdminUserResponse.from(userRepository.save(user));
	}

	@Transactional(readOnly = true)
	public List<AdminListingResponse> listings() {
		currentUser.requireStaff();
		return listingRepository.findAllWithOwnerAndMedia().stream().map(AdminListingResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public AdminListingResponse listing(UUID id) {
		currentUser.requireStaff();
		return AdminListingResponse.from(requireListing(id));
	}

	@Transactional
	public AdminListingResponse setListingStatus(UUID id, String status) {
		currentUser.requireStaff();
		Listing listing = requireListing(id);
		String next = status == null ? "" : status.trim().toLowerCase(Locale.ROOT);
		if (next.equals("disabled") || next.equals("unavailable")) {
			listing.setStatus(ListingStatus.UNAVAILABLE);
		} else if (next.equals("removed")) {
			listing.setStatus(ListingStatus.REMOVED);
		} else if (next.equals("available") || next.equals("active")) {
			listing.setStatus(ListingStatus.AVAILABLE);
		} else {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Use Available, Disabled, or Removed");
		}
		Listing saved = listingRepository.save(listing);
		rapCache.evictCatalog();
		return AdminListingResponse.from(saved);
	}

	@Transactional(readOnly = true)
	public List<AdminUserResponse> kycQueue() {
		currentUser.requireStaff();
		return userRepository.findAll().stream()
				.filter(user -> user.getRole() == Role.USER && user.getKycStatus() != KycStatus.NOT_STARTED)
				.map(AdminUserResponse::from)
				.toList();
	}

	@Transactional
	public AdminUserResponse reviewKyc(UUID id, ReviewKycRequest request) {
		currentUser.requireStaff();
		User user = requireUser(id);
		if (request.approved()) {
			user.setKycStatus(KycStatus.VERIFIED);
			user.setKycNotes(request.notes() == null || request.notes().isBlank() ? "Document matches profile." : request.notes().trim());
			notificationService.notify(
					user,
					NotificationKind.WELCOME,
					"KYC verified",
					"Your identity documents were approved. You can list items and request rentals.",
					"/user",
					null,
					true
			);
		} else {
			if (request.notes() == null || request.notes().isBlank()) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Add a reason when rejecting KYC");
			}
			user.setKycStatus(KycStatus.REJECTED);
			user.setKycNotes(request.notes().trim());
			notificationService.notify(
					user,
					NotificationKind.WELCOME,
					"KYC needs another try",
					"RAP could not verify your documents. " + request.notes().trim(),
					"/user/kyc",
					null,
					true
			);
		}
		return AdminUserResponse.from(userRepository.save(user));
	}

	@Transactional(readOnly = true)
	public List<AdminRentalResponse> rentals() {
		currentUser.requireStaff();
		return rentalRepository.findAllWithParties().stream().map(AdminRentalResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public AdminRentalResponse rental(UUID id) {
		currentUser.requireStaff();
		Rental rental = rentalRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rental not found"));
		return AdminRentalResponse.from(rental);
	}

	@Transactional(readOnly = true)
	public List<AdminUserResponse> staff() {
		currentUser.requireSuperAdmin();
		return userRepository.findByRoleOrderByCreatedAtDesc(Role.ADMIN).stream()
				.map(AdminUserResponse::from)
				.toList();
	}

	@Transactional(readOnly = true)
	public AdminUserResponse staffMember(UUID id) {
		return AdminUserResponse.from(requireAdminAccount(id));
	}

	@Transactional
	public AdminUserResponse createAdmin(CreateAdminRequest request) {
		currentUser.requireSuperAdmin();
		String email = request.email().trim().toLowerCase(Locale.ROOT);
		if (userRepository.existsByEmailIgnoreCase(email)) {
			throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
		}
		String phone = trimPhone(request.phone());
		if (phone != null && userRepository.existsByPhone(phone)) {
			throw new ApiException(HttpStatus.CONFLICT, "An account with this phone already exists");
		}
		requireStrongPassword(request.password());
		User user = new User();
		user.setFullName(request.fullName().trim());
		user.setEmail(email);
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setPhone(phone);
		user.setRole(Role.ADMIN);
		user.setActive(true);
		user.setAccountLocked(false);
		user.setKycStatus(KycStatus.VERIFIED);
		User saved = userRepository.save(user);
		notificationService.notify(
				saved,
				NotificationKind.WELCOME,
				"You were added as RAP staff",
				"A super admin created your admin account. Sign in with the email and password they gave you.",
				"/admin",
				null,
				true
		);
		return AdminUserResponse.from(saved);
	}

	@Transactional
	public AdminUserResponse updateAdmin(UUID id, UpdateAdminRequest request) {
		User actor = currentUser.requireSuperAdmin();
		User user = requireAdminAccount(id);
		String email = request.email().trim().toLowerCase(Locale.ROOT);
		if (userRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
			throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
		}
		String phone = trimPhone(request.phone());
		if (phone != null && userRepository.existsByPhoneAndIdNot(phone, id)) {
			throw new ApiException(HttpStatus.CONFLICT, "An account with this phone already exists");
		}
		user.setFullName(request.fullName().trim());
		user.setEmail(email);
		user.setPhone(phone);
		if (request.password() != null && !request.password().isBlank()) {
			requireStrongPassword(request.password());
			user.setPasswordHash(passwordEncoder.encode(request.password()));
			refreshTokenRepository.deleteByUser(user);
		}
		User saved = userRepository.save(user);
		if (!saved.getId().equals(actor.getId())) {
			notificationService.notify(
					saved,
					NotificationKind.WELCOME,
					"Your admin account was updated",
					"A super admin updated your RAP staff profile. Sign in again if your password changed.",
					"/admin",
					null,
					true
			);
		}
		return AdminUserResponse.from(saved);
	}

	@Transactional
	public AdminUserResponse setStaffStatus(UUID id, String status) {
		currentUser.requireSuperAdmin();
		User user = requireAdminAccount(id);
		User actor = currentUser.require();
		if (user.getId().equals(actor.getId())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot change your own staff status");
		}
		String next = status == null ? "" : status.trim().toLowerCase(Locale.ROOT);
		if (next.equals("suspended")) {
			user.setAccountLocked(true);
			user.setLockedAt(java.time.Instant.now());
			user.setActive(true);
			refreshTokenRepository.deleteByUser(user);
		} else if (next.equals("banned") || next.equals("disabled")) {
			user.setActive(false);
			user.setAccountLocked(true);
			user.setLockedAt(java.time.Instant.now());
			refreshTokenRepository.deleteByUser(user);
		} else if (next.equals("active") || next.equals("restore")) {
			user.setActive(true);
			user.setAccountLocked(false);
			user.setLockedAt(null);
		} else {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Use Active, Suspended, or Banned");
		}
		return AdminUserResponse.from(userRepository.save(user));
	}

	@Transactional
	public void deleteAdmin(UUID id) {
		User actor = currentUser.requireSuperAdmin();
		User user = requireAdminAccount(id);
		if (user.getId().equals(actor.getId())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot delete your own account");
		}
		if (!listingRepository.findByOwnerOrderByCreatedAtDesc(user).isEmpty()) {
			throw new ApiException(HttpStatus.CONFLICT, "This admin still owns listings. Disable the account instead.");
		}
		if (!rentalRepository.findByRenterOrderByCreatedAtDesc(user).isEmpty()
				|| !rentalRepository.findByOwnerOrderByCreatedAtDesc(user).isEmpty()) {
			throw new ApiException(HttpStatus.CONFLICT, "This admin is tied to rentals. Disable the account instead.");
		}
		notificationRepository.deleteByUser(user);
		walletRepository.deleteByUser(user);
		refreshTokenRepository.deleteByUser(user);
		emailOtpRepository.deleteByEmail(user.getEmail());
		userRepository.delete(user);
	}

	private User requireAdminAccount(UUID id) {
		currentUser.requireSuperAdmin();
		User user = requireUser(id);
		if (user.getRole() != Role.ADMIN) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Only admin staff can be managed here");
		}
		return user;
	}

	private static String trimPhone(String phone) {
		if (phone == null || phone.isBlank()) {
			return null;
		}
		return phone.trim();
	}

	private static void requireStrongPassword(String password) {
		if (password == null || password.length() < 8) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters long");
		}
		if (!password.matches(".*[A-Z].*")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Password must contain at least one uppercase letter");
		}
		if (!password.matches(".*[0-9].*")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Password must contain at least one digit");
		}
		if (!password.matches(".*[^a-zA-Z0-9].*")) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Password must contain at least one special character");
		}
	}

	private User requireUser(UUID id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
	}

	private Listing requireListing(UUID id) {
		return listingRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
	}
}
