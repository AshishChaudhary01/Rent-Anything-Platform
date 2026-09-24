package com.RAP.backend.rental;

import com.RAP.backend.account.AccountReadiness;
import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.config.PaymentProperties;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.listing.ListingStatus;
import com.RAP.backend.payment.PaymentGateway;
import com.RAP.backend.payment.PaymentGatewayService;
import com.RAP.backend.payment.WalletService;
import com.RAP.backend.payment.dto.PaymentConfigResponse;
import com.RAP.backend.payment.dto.PaymentInitiateResponse;
import com.RAP.backend.rental.dto.CreateRentalRequest;
import com.RAP.backend.rental.dto.InitiatePaymentRequest;
import com.RAP.backend.rental.dto.RentalResponse;
import com.RAP.backend.rental.dto.ScheduleReturnRequest;
import com.RAP.backend.rental.dto.StartRentalRequest;
import com.RAP.backend.review.Review;
import com.RAP.backend.review.ReviewRepository;
import com.RAP.backend.review.dto.SubmitReviewRequest;
import com.RAP.backend.user.User;
import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RentalService {

	private static final ZoneId NEPAL = ZoneId.of("Asia/Kathmandu");
	private static final int MAX_DAYS = 30;
	private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

	private final RentalRepository rentalRepository;
	private final ListingRepository listingRepository;
	private final CurrentUser currentUser;
	private final PaymentProperties paymentProperties;
	private final PaymentGatewayService paymentGatewayService;
	private final WalletService walletService;
	private final ReviewRepository reviewRepository;
	private final SecureRandom random = new SecureRandom();

	public RentalService(
			RentalRepository rentalRepository,
			ListingRepository listingRepository,
			CurrentUser currentUser,
			PaymentProperties paymentProperties,
			PaymentGatewayService paymentGatewayService,
			WalletService walletService,
			ReviewRepository reviewRepository
	) {
		this.rentalRepository = rentalRepository;
		this.listingRepository = listingRepository;
		this.currentUser = currentUser;
		this.paymentProperties = paymentProperties;
		this.paymentGatewayService = paymentGatewayService;
		this.walletService = walletService;
		this.reviewRepository = reviewRepository;
	}

	@Transactional(readOnly = true)
	public PaymentConfigResponse paymentConfig() {
		return new PaymentConfigResponse(
				paymentProperties.getCommitmentFee(),
				paymentProperties.getCommissionPercent(),
				paymentProperties.getEsewa().isConfigured(),
				paymentProperties.getKhalti().isConfigured()
		);
	}

	@Transactional(readOnly = true)
	public List<RentalResponse> mine() {
		User user = currentUser.require();
		return rentalRepository.findByRenterOrderByCreatedAtDesc(user).stream()
				.map(rental -> toResponse(rental, user))
				.toList();
	}

	@Transactional(readOnly = true)
	public List<RentalResponse> owned() {
		User user = currentUser.require();
		return rentalRepository.findByOwnerOrderByCreatedAtDesc(user).stream()
				.map(rental -> toResponse(rental, user))
				.toList();
	}

	@Transactional(readOnly = true)
	public RentalResponse get(UUID id) {
		User user = currentUser.require();
		return toResponse(requireParticipant(id, user), user);
	}

	@Transactional
	public RentalResponse create(CreateRentalRequest request) {
		User renter = currentUser.require();
		if (!AccountReadiness.canTransact(renter)) {
			throw new ApiException(
					HttpStatus.FORBIDDEN,
					"Complete your profile photo, details, and verified KYC before renting"
			);
		}
		Listing listing = listingRepository.findById(request.listingId())
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
		if (listing.getOwner().getId().equals(renter.getId())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot rent your own listing");
		}
		if (listing.getStatus() == ListingStatus.REMOVED || listing.getStatus() == ListingStatus.UNAVAILABLE) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This listing is not available to rent");
		}
		if (listing.getStatus() != ListingStatus.AVAILABLE && listing.getStatus() != ListingStatus.RENTED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This listing is not available to rent");
		}
		LocalDate start = request.startDate();
		LocalDate end = request.endDate();
		LocalDate today = LocalDate.now(NEPAL);
		if (start.isBefore(today)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Start date cannot be in the past");
		}
		if (end.isBefore(start)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "End date cannot be before the start date");
		}
		long days = ChronoUnit.DAYS.between(start, end) + 1;
		if (days > MAX_DAYS) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Rentals can be at most 30 days");
		}
		String meetup = request.meetupLocation() == null ? "" : request.meetupLocation().trim();
		if (meetup.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a meetup location");
		}
		if (rentalRepository.hasOverlap(listing, List.of(RentalStatus.PAID, RentalStatus.ACTIVE), start, end)) {
			throw new ApiException(HttpStatus.CONFLICT, "Those dates overlap an existing booking");
		}

		Rental rental = new Rental();
		rental.setListing(listing);
		rental.setRenter(renter);
		rental.setOwner(listing.getOwner());
		rental.setStartDate(start);
		rental.setEndDate(end);
		rental.setDays((int) days);
		rental.setDailyRate(listing.getDailyRate());
		rental.setDeposit(listing.getDeposit());
		rental.setCommitmentFee(paymentProperties.getCommitmentFee());
		rental.setRentalTotal(listing.getDailyRate().multiply(BigDecimal.valueOf(days)));
		rental.setMeetupLocation(meetup);
		rental.setMeetupLatitude(request.meetupLatitude());
		rental.setMeetupLongitude(request.meetupLongitude());
		if (request.note() != null && !request.note().isBlank()) {
			rental.setRenterNote(request.note().trim());
		}
		rental.setStatus(RentalStatus.REQUESTED);
		rental.setEscrowStatus(EscrowStatus.NONE);
		rental.setMeetupCode(randomCode());
		rental.setMeetupRenterCode(randomCode());
		return toResponse(rentalRepository.save(rental), renter);
	}

	@Transactional
	public PaymentInitiateResponse initiatePayment(UUID id, InitiatePaymentRequest request) {
		User renter = currentUser.require();
		Rental rental = requireRenter(id, renter);
		if (rental.getStatus() == RentalStatus.PAID || rental.getStatus() == RentalStatus.ACTIVE) {
			throw new ApiException(HttpStatus.CONFLICT, "This rental is already paid");
		}
		if (rental.getStatus() == RentalStatus.CANCELLED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This rental was cancelled");
		}
		requirePending(rental);
		Listing listing = rental.getListing();
		if (listing.getStatus() == ListingStatus.REMOVED || listing.getStatus() == ListingStatus.UNAVAILABLE) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This listing is no longer available");
		}
		if (rentalRepository.hasOverlap(listing, List.of(RentalStatus.PAID, RentalStatus.ACTIVE), rental.getStartDate(), rental.getEndDate())) {
			throw new ApiException(HttpStatus.CONFLICT, "Those dates overlap an existing booking");
		}
		rental.setPaymentGateway(request.gateway());
		if (request.gateway() == PaymentGateway.ESEWA) {
			rental.setPaymentRef(rental.getId() + "-t" + System.currentTimeMillis());
		}
		rentalRepository.save(rental);
		if (request.gateway() == PaymentGateway.KHALTI) {
			PaymentInitiateResponse initiated = paymentGatewayService.initiateKhalti(rental, renter);
			rentalRepository.save(rental);
			return initiated;
		}
		return paymentGatewayService.initiateEsewa(rental);
	}

	@Transactional
	public RentalResponse verifyEsewa(UUID id, String data) {
		User renter = currentUser.require();
		Rental rental = requireRenter(id, renter);
		if (rental.getStatus() == RentalStatus.PAID || rental.getStatus() == RentalStatus.ACTIVE) {
			return toResponse(rental, renter);
		}
		requirePending(rental);
		paymentGatewayService.verifyEsewa(rental, data);
		markPaid(rental, PaymentGateway.ESEWA);
		return toResponse(rentalRepository.save(rental), renter);
	}

	@Transactional
	public RentalResponse verifyKhalti(UUID id, String pidx) {
		User renter = currentUser.require();
		Rental rental = requireRenter(id, renter);
		if (rental.getStatus() == RentalStatus.PAID || rental.getStatus() == RentalStatus.ACTIVE) {
			return toResponse(rental, renter);
		}
		requirePending(rental);
		paymentGatewayService.verifyKhalti(rental, pidx);
		markPaid(rental, PaymentGateway.KHALTI);
		return toResponse(rentalRepository.save(rental), renter);
	}

	@Transactional
	public RentalResponse start(UUID id, StartRentalRequest request) {
		User user = currentUser.require();
		Rental rental = requireParticipant(id, user);
		ensureMeetupCodes(rental);
		rentalRepository.save(rental);
		if (rental.getStatus() == RentalStatus.ACTIVE) {
			return toResponse(rental, user);
		}
		if (rental.getStatus() != RentalStatus.PAID) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Pay the commitment fee before meetup");
		}
		boolean isOwner = rental.getOwner().getId().equals(user.getId());
		requirePeerScan(rental, user, request.code(), false);
		Listing listing = rental.getListing();
		if (listing.getStatus() == ListingStatus.REMOVED) {
			throw new ApiException(HttpStatus.CONFLICT, "This listing is no longer available");
		}
		rental.setStatus(RentalStatus.ACTIVE);
		rental.setStartedAt(Instant.now());
		listing.setStatus(ListingStatus.RENTED);
		listingRepository.save(listing);
		return toResponse(rentalRepository.save(rental), user);
	}

	@Transactional
	public RentalResponse cancel(UUID id) {
		User user = currentUser.require();
		Rental rental = requireParticipant(id, user);
		boolean isOwner = rental.getOwner().getId().equals(user.getId());
		if (rental.getStatus() == RentalStatus.ACTIVE) {
			throw new ApiException(
					HttpStatus.CONFLICT,
					"An active rental cannot be cancelled here. Finish the return or open a report."
			);
		}
		if (rental.getStatus() == RentalStatus.COMPLETED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "A completed rental cannot be cancelled");
		}
		if (rental.getStatus() == RentalStatus.CANCELLED || rental.getStatus() == RentalStatus.DECLINED) {
			return toResponse(rental, user);
		}
		if (rental.getStatus() == RentalStatus.REQUESTED) {
			rental.setStatus(isOwner ? RentalStatus.DECLINED : RentalStatus.CANCELLED);
			return toResponse(rentalRepository.save(rental), user);
		}
		if (rental.getStatus() == RentalStatus.PENDING_PAYMENT) {
			if (isOwner) {
				throw new ApiException(HttpStatus.FORBIDDEN, "Only the renter can cancel an unpaid request");
			}
			rental.setStatus(RentalStatus.CANCELLED);
			return toResponse(rentalRepository.save(rental), user);
		}
		if (rental.getStatus() != RentalStatus.PAID) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This rental cannot be cancelled");
		}
		LocalDate today = LocalDate.now(NEPAL);
		boolean lateRenterCancel = !isOwner && !rental.getStartDate().isAfter(today.plusDays(1));
		if (isOwner) {
			refundToRenter(rental);
		} else if (lateRenterCancel) {
			forfeitToOwner(rental);
		} else {
			refundToRenter(rental);
		}
		rental.setStatus(RentalStatus.CANCELLED);
		return toResponse(rentalRepository.save(rental), user);
	}

	@Transactional
	public RentalResponse accept(UUID id) {
		User owner = currentUser.require();
		Rental rental = requireParticipant(id, owner);
		if (!rental.getOwner().getId().equals(owner.getId())) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Only the owner can accept this request");
		}
		if (rental.getStatus() != RentalStatus.REQUESTED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This request is no longer pending");
		}
		if (rentalRepository.hasOverlap(
				rental.getListing(),
				List.of(RentalStatus.PAID, RentalStatus.ACTIVE),
				rental.getStartDate(),
				rental.getEndDate()
		)) {
			throw new ApiException(HttpStatus.CONFLICT, "Those dates overlap an existing booking");
		}
		rental.setStatus(RentalStatus.PENDING_PAYMENT);
		return toResponse(rentalRepository.save(rental), owner);
	}

	@Transactional
	public RentalResponse decline(UUID id) {
		User owner = currentUser.require();
		Rental rental = requireParticipant(id, owner);
		if (!rental.getOwner().getId().equals(owner.getId())) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Only the owner can decline this request");
		}
		if (rental.getStatus() != RentalStatus.REQUESTED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This request is no longer pending");
		}
		rental.setStatus(RentalStatus.DECLINED);
		return toResponse(rentalRepository.save(rental), owner);
	}

	@Transactional
	public RentalResponse scheduleReturn(UUID id, ScheduleReturnRequest request) {
		User user = currentUser.require();
		Rental rental = requireParticipant(id, user);
		if (rental.getStatus() != RentalStatus.ACTIVE) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Schedule a return after pickup");
		}
		LocalDate date;
		LocalTime time;
		try {
			date = LocalDate.parse(request.date().trim());
			time = LocalTime.parse(request.time().trim());
		} catch (Exception ex) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a valid return date and time");
		}
		String location = request.location() == null ? "" : request.location().trim();
		if (location.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a return meetup location");
		}
		rental.setReturnMeetupLocation(location);
		rental.setReturnMeetupLatitude(request.latitude());
		rental.setReturnMeetupLongitude(request.longitude());
		rental.setReturnMeetupAt(LocalDateTime.of(date, time).atZone(NEPAL).toInstant());
		ensureReturnCodes(rental);
		return toResponse(rentalRepository.save(rental), user);
	}

	@Transactional
	public RentalResponse finishReturn(UUID id, StartRentalRequest request) {
		User user = currentUser.require();
		Rental rental = requireParticipant(id, user);
		if (rental.getStatus() == RentalStatus.COMPLETED) {
			return toResponse(rental, user);
		}
		if (rental.getStatus() != RentalStatus.ACTIVE) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Return QR is only for an active rental");
		}
		if (rental.getReturnMeetupAt() == null || rental.getReturnMeetupLocation() == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Schedule the return meetup first");
		}
		ensureReturnCodes(rental);
		requirePeerScan(rental, user, request.code(), true);
		settleSuccessfulReturn(rental);
		return toResponse(rental, user);
	}

	@Transactional
	public RentalResponse reportNoShow(UUID id) {
		User user = currentUser.require();
		Rental rental = requireParticipant(id, user);
		boolean isOwner = rental.getOwner().getId().equals(user.getId());
		if (rental.getStatus() != RentalStatus.PAID) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "No-show can only be recorded at the first meetup");
		}
		if (isOwner) {
			forfeitToOwner(rental);
		} else {
			refundToRenter(rental);
		}
		rental.setStatus(RentalStatus.CANCELLED);
		return toResponse(rentalRepository.save(rental), user);
	}

	@Transactional
	public RentalResponse review(UUID id, SubmitReviewRequest request) {
		User author = currentUser.require();
		Rental rental = requireParticipant(id, author);
		if (rental.getStatus() != RentalStatus.COMPLETED) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "You can review after the rental is completed");
		}
		int rating = request == null || request.rating() == null ? 0 : request.rating();
		if (rating < 1 || rating > 5) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a rating from 1 to 5");
		}
		boolean isOwner = rental.getOwner().getId().equals(author.getId());
		User subject = isOwner ? rental.getRenter() : rental.getOwner();
		Review review = reviewRepository.findByRentalAndAuthor(rental, author).orElseGet(Review::new);
		review.setRental(rental);
		review.setListing(rental.getListing());
		review.setAuthor(author);
		review.setSubject(subject);
		review.setRating(rating);
		review.setComment(request.comment() == null ? "" : request.comment().trim());
		reviewRepository.save(review);
		return toResponse(rental, author);
	}

	private RentalResponse toResponse(Rental rental, User viewer) {
		boolean completed = rental.getStatus() == RentalStatus.COMPLETED;
		var existing = reviewRepository.findByRentalAndAuthor(rental, viewer);
		boolean canReview = completed;
		Integer myRating = existing.map(Review::getRating).orElse(null);
		String myComment = existing.map(Review::getComment).orElse(null);
		User renter = rental.getRenter();
		Double renterRating = reviewRepository.averageForSubject(renter);
		long renterReviewCount = reviewRepository.countForSubject(renter);
		long completedCount = rentalRepository.countByRenterAndStatus(renter, RentalStatus.COMPLETED);
		String city = renter.getCity() == null || renter.getCity().isBlank() ? renter.getAddressLine() : renter.getCity();
		return RentalResponse.from(
				rental,
				viewer.getId(),
				canReview,
				myRating,
				myComment,
				renterRating,
				renterReviewCount,
				completedCount,
				city,
				paymentProperties.getCommissionPercent()
		);
	}

	private void markPaid(Rental rental, PaymentGateway gateway) {
		rental.setStatus(RentalStatus.PAID);
		rental.setPaymentGateway(gateway);
		rental.setPaidAt(Instant.now());
		rental.setEscrowStatus(EscrowStatus.HELD);
	}

	private void settleSuccessfulReturn(Rental rental) {
		BigDecimal total = rental.getRentalTotal();
		BigDecimal commitment = rental.getCommitmentFee();
		BigDecimal applied = commitment.min(total);
		BigDecimal percent = paymentProperties.getCommissionPercent() == null
				? new BigDecimal("0.08")
				: paymentProperties.getCommissionPercent();
		BigDecimal commission = total.multiply(percent).setScale(2, RoundingMode.HALF_UP);
		if (commission.compareTo(total) > 0) {
			commission = total;
		}
		rental.setCommitmentApplied(applied);
		rental.setPlatformCommission(commission);
		rental.setOwnerPayout(total.subtract(commission));
		rental.setStatus(RentalStatus.COMPLETED);
		rental.setCompletedAt(Instant.now());
		rental.setEscrowStatus(EscrowStatus.RELEASED);
		rentalRepository.save(rental);
		Listing listing = rental.getListing();
		long remaining = rentalRepository.countByListingAndStatusIn(listing, List.of(RentalStatus.ACTIVE));
		if (remaining == 0 && listing.getStatus() == ListingStatus.RENTED) {
			listing.setStatus(ListingStatus.AVAILABLE);
			listingRepository.save(listing);
		}
	}

	private void forfeitToOwner(Rental rental) {
		rental.setEscrowStatus(EscrowStatus.FORFEITED);
		rental.setCommitmentApplied(BigDecimal.ZERO);
		rental.setPlatformCommission(BigDecimal.ZERO);
		rental.setOwnerPayout(rental.getCommitmentFee());
	}

	private void refundToRenter(Rental rental) {
		rental.setEscrowStatus(EscrowStatus.REFUNDED);
		rental.setCommitmentApplied(BigDecimal.ZERO);
		rental.setPlatformCommission(BigDecimal.ZERO);
		rental.setOwnerPayout(BigDecimal.ZERO);
	}

	private void requirePeerScan(Rental rental, User user, String code, boolean returning) {
		boolean isOwner = rental.getOwner().getId().equals(user.getId());
		String submitted = code == null ? "" : code.trim();
		String ownerCode = returning ? rental.getReturnOwnerCode() : rental.getMeetupCode();
		String renterCode = returning
				? (rental.getReturnRenterCode() == null ? rental.getReturnOwnerCode() : rental.getReturnRenterCode())
				: (rental.getMeetupRenterCode() == null ? rental.getMeetupCode() : rental.getMeetupRenterCode());
		String ownerPayload = returning
				? RentalResponse.returnPayload(rental.getId(), "OWNER", ownerCode)
				: RentalResponse.payload(rental.getId(), "OWNER", ownerCode);
		String renterPayload = returning
				? RentalResponse.returnPayload(rental.getId(), "RENTER", renterCode)
				: RentalResponse.payload(rental.getId(), "RENTER", renterCode);
		boolean scannedOwner = matches(submitted, ownerCode, ownerPayload);
		boolean scannedRenter = matches(submitted, renterCode, renterPayload);
		String action = returning ? "finish this return" : "start this rental";
		if (isOwner && !scannedRenter) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Scan the renter QR to " + action);
		}
		if (!isOwner && !scannedOwner) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Scan the owner QR to " + action);
		}
	}

	private void ensureMeetupCodes(Rental rental) {
		if (rental.getMeetupCode() == null || rental.getMeetupCode().isBlank()) {
			rental.setMeetupCode(randomCode());
		}
		if (rental.getMeetupRenterCode() == null || rental.getMeetupRenterCode().isBlank()) {
			rental.setMeetupRenterCode(randomCode());
		}
	}

	private void ensureReturnCodes(Rental rental) {
		if (rental.getReturnOwnerCode() == null || rental.getReturnOwnerCode().isBlank()) {
			rental.setReturnOwnerCode(randomCode());
		}
		if (rental.getReturnRenterCode() == null || rental.getReturnRenterCode().isBlank()) {
			rental.setReturnRenterCode(randomCode());
		}
	}

	private static boolean matches(String submitted, String code, String payload) {
		return submitted.equalsIgnoreCase(code) || submitted.equalsIgnoreCase(payload);
	}

	private void requirePending(Rental rental) {
		if (rental.getStatus() != RentalStatus.PENDING_PAYMENT) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "This rental is not awaiting payment");
		}
	}

	private Rental requireRenter(UUID id, User user) {
		Rental rental = rentalRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rental not found"));
		if (!rental.getRenter().getId().equals(user.getId())) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Only the renter can do this");
		}
		return rental;
	}

	private Rental requireParticipant(UUID id, User user) {
		Rental rental = rentalRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rental not found"));
		boolean allowed = rental.getRenter().getId().equals(user.getId())
				|| rental.getOwner().getId().equals(user.getId());
		if (!allowed) {
			throw new ApiException(HttpStatus.FORBIDDEN, "You are not part of this rental");
		}
		return rental;
	}

	private String randomCode() {
		StringBuilder builder = new StringBuilder(8);
		for (int i = 0; i < 8; i++) {
			builder.append(CODE_ALPHABET.charAt(random.nextInt(CODE_ALPHABET.length())));
		}
		return builder.toString();
	}
}
