package com.RAP.backend.rental.dto;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingCovers;
import com.RAP.backend.rental.EscrowStatus;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalStatus;
import com.RAP.backend.payment.PaymentGateway;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record RentalResponse(
		UUID id,
		UUID listingId,
		String listingTitle,
		String listingImage,
		BigDecimal dailyRate,
		BigDecimal deposit,
		BigDecimal commitmentFee,
		BigDecimal rentalTotal,
		BigDecimal payLater,
		int days,
		LocalDate startDate,
		LocalDate endDate,
		String meetupLocation,
		Double meetupLatitude,
		Double meetupLongitude,
		RentalStatus status,
		PaymentGateway paymentGateway,
		EscrowStatus escrowStatus,
		String escrowNote,
		String myQrPayload,
		UUID ownerId,
		String ownerName,
		String ownerAvatarUrl,
		UUID renterId,
		String renterName,
		String renterAvatarUrl,
		boolean owner,
		boolean renter,
		String renterNote,
		Instant createdAt,
		boolean canReview,
		Integer myRating,
		String myComment,
		Double renterRating,
		Long renterReviewCount,
		Long renterCompletedRentals,
		String renterCity,
		String returnMeetupLocation,
		Double returnMeetupLatitude,
		Double returnMeetupLongitude,
		Instant returnMeetupAt,
		boolean returnScheduled,
		String myReturnQrPayload,
		BigDecimal commitmentApplied,
		BigDecimal platformCommission,
		BigDecimal ownerPayout
) {

	public static RentalResponse from(Rental rental, UUID viewerId) {
		return from(rental, viewerId, false, null, null, null, 0L, 0L, null, new BigDecimal("0.08"));
	}

	public static RentalResponse from(
			Rental rental,
			UUID viewerId,
			boolean canReview,
			Integer myRating,
			String myComment,
			Double renterRating,
			long renterReviewCount,
			long renterCompletedRentals,
			String renterCity,
			BigDecimal commissionPercent
	) {
		Listing listing = rental.getListing();
		String image = ListingCovers.imageUrl(listing);
		BigDecimal applied = rental.getCommitmentApplied() != null
				? rental.getCommitmentApplied()
				: rental.getCommitmentFee().min(rental.getRentalTotal());
		BigDecimal payLater = rental.getRentalTotal().subtract(applied).add(rental.getDeposit());
		BigDecimal percent = commissionPercent == null ? new BigDecimal("0.08") : commissionPercent;
		BigDecimal commission = rental.getPlatformCommission() != null
				? rental.getPlatformCommission()
				: rental.getRentalTotal().multiply(percent).setScale(2, RoundingMode.HALF_UP);
		BigDecimal payout = rental.getOwnerPayout() != null
				? rental.getOwnerPayout()
				: rental.getRentalTotal().subtract(commission);
		boolean isOwner = viewerId != null && viewerId.equals(rental.getOwner().getId());
		boolean isRenter = viewerId != null && viewerId.equals(rental.getRenter().getId());
		String ownerQr = payload(rental.getId(), "OWNER", rental.getMeetupCode());
		String renterCode = rental.getMeetupRenterCode() == null ? rental.getMeetupCode() : rental.getMeetupRenterCode();
		String renterQr = payload(rental.getId(), "RENTER", renterCode);
		String myQr = isOwner ? ownerQr : isRenter ? renterQr : null;
		String returnOwnerCode = rental.getReturnOwnerCode();
		String returnRenterCode = rental.getReturnRenterCode() == null ? returnOwnerCode : rental.getReturnRenterCode();
		String myReturnQr = null;
		if (returnOwnerCode != null && !returnOwnerCode.isBlank()) {
			myReturnQr = isOwner
					? returnPayload(rental.getId(), "OWNER", returnOwnerCode)
					: isRenter ? returnPayload(rental.getId(), "RENTER", returnRenterCode) : null;
		}
		boolean scheduled = rental.getReturnMeetupAt() != null && rental.getReturnMeetupLocation() != null;
		return new RentalResponse(
				rental.getId(),
				listing.getId(),
				listing.getTitle(),
				image,
				rental.getDailyRate(),
				rental.getDeposit(),
				rental.getCommitmentFee(),
				rental.getRentalTotal(),
				payLater,
				rental.getDays(),
				rental.getStartDate(),
				rental.getEndDate(),
				rental.getMeetupLocation(),
				rental.getMeetupLatitude(),
				rental.getMeetupLongitude(),
				rental.getStatus(),
				rental.getPaymentGateway(),
				rental.getEscrowStatus(),
				escrowNote(rental),
				myQr,
				rental.getOwner().getId(),
				rental.getOwner().getFullName(),
				rental.getOwner().getAvatarUrl(),
				rental.getRenter().getId(),
				rental.getRenter().getFullName(),
				rental.getRenter().getAvatarUrl(),
				isOwner,
				isRenter,
				rental.getRenterNote(),
				rental.getCreatedAt(),
				canReview,
				myRating,
				myComment,
				renterRating,
				renterReviewCount,
				renterCompletedRentals,
				renterCity,
				rental.getReturnMeetupLocation(),
				rental.getReturnMeetupLatitude(),
				rental.getReturnMeetupLongitude(),
				rental.getReturnMeetupAt(),
				scheduled,
				myReturnQr,
				applied,
				commission,
				payout
		);
	}

	public static String payload(UUID rentalId, String role, String code) {
		return "RAP:MEET:" + rentalId + ":" + role + ":" + code;
	}

	public static String returnPayload(UUID rentalId, String role, String code) {
		return "RAP:RETURN:" + rentalId + ":" + role + ":" + code;
	}

	private static String escrowNote(Rental rental) {
		EscrowStatus status = rental.getEscrowStatus() == null ? EscrowStatus.NONE : rental.getEscrowStatus();
		if (status == EscrowStatus.HELD && rental.getStartedAt() != null) {
			return "Commitment is held. At return it is deducted from the rental total, commission is taken, and the rest is paid to the lister. Deposit is due at pickup and refunded on a clean return.";
		}
		if (status == EscrowStatus.HELD) {
			return "RAP holds the commitment fee until pickup QR. Scan to start; a renter no-show pays this fee to the lister.";
		}
		if (status == EscrowStatus.REFUNDED) {
			return "The commitment fee is marked for refund to the renter.";
		}
		if (status == EscrowStatus.FORFEITED) {
			return "The requester did not show. The held commitment fee was paid to the lister.";
		}
		if (status == EscrowStatus.RELEASED) {
			BigDecimal commission = rental.getPlatformCommission() == null ? BigDecimal.ZERO : rental.getPlatformCommission();
			BigDecimal payout = rental.getOwnerPayout() == null ? BigDecimal.ZERO : rental.getOwnerPayout();
			return "Return QR confirmed. Commitment was applied to the rental total. Platform commission Nrs. "
					+ commission.toPlainString()
					+ ". Lister payout Nrs. "
					+ payout.toPlainString()
					+ ". Deposit is marked for refund.";
		}
		return "No fee is held yet.";
	}
}
