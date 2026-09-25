package com.RAP.backend.rental.dto;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingCovers;
import com.RAP.backend.rental.EscrowStatus;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalStatus;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

public final class RentalMapper {

	private RentalMapper() {
	}

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
		BigDecimal dueAfterCommitment = rental.remainingPaid() ? BigDecimal.ZERO : rental.remainingRent();
		BigDecimal dueAtPickup = dueAfterCommitment.add(rental.getDeposit());
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
				dueAtPickup,
				dueAfterCommitment,
				rental.remainingPaid(),
				rental.getDays(),
				rental.getStartDate(),
				rental.getEndDate(),
				rental.getMeetupLocation(),
				rental.getMeetupLatitude(),
				rental.getMeetupLongitude(),
				rental.getStatus(),
				rental.getPaymentGateway(),
				rental.getEscrowStatus(),
				noteFor(rental),
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

	private static String noteFor(Rental rental) {
		EscrowStatus escrow = rental.getEscrowStatus() == null ? EscrowStatus.NONE : rental.getEscrowStatus();
		if (escrow == EscrowStatus.HELD && rental.getStatus() == RentalStatus.MEETUP_CONFIRMED) {
			return "Meetup QR matched. Pay the remaining rental fee to start. Deposit is still due at pickup and refunded on a clean return.";
		}
		if (escrow == EscrowStatus.HELD && rental.getStartedAt() != null) {
			return "Rent is paid and the item is with the renter. Commitment was credited toward the total. Deposit is due at pickup and refunded on a clean return.";
		}
		if (escrow == EscrowStatus.HELD) {
			return "RAP holds the commitment fee until pickup QR. After scan, the renter pays remaining rent to start. A renter no-show pays this fee to the lister.";
		}
		if (escrow == EscrowStatus.REFUNDED) {
			return "The commitment fee is marked for refund to the renter.";
		}
		if (escrow == EscrowStatus.FORFEITED) {
			return "The requester did not show. The held commitment fee was paid to the lister.";
		}
		if (escrow == EscrowStatus.RELEASED) {
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
