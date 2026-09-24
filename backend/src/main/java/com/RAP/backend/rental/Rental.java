package com.RAP.backend.rental;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.payment.PaymentGateway;
import com.RAP.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "rentals")
public class Rental {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@JdbcTypeCode(SqlTypes.VARCHAR)
	@Column(length = 36)
	private UUID id;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "listing_id", nullable = false)
	private Listing listing;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "renter_id", nullable = false)
	private User renter;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id", nullable = false)
	private User owner;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	@Column(name = "end_date", nullable = false)
	private LocalDate endDate;

	@Column(nullable = false)
	private int days;

	@Column(name = "daily_rate", nullable = false, precision = 12, scale = 2)
	private BigDecimal dailyRate;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal deposit;

	@Column(name = "commitment_fee", nullable = false, precision = 12, scale = 2)
	private BigDecimal commitmentFee;

	@Column(name = "rental_total", nullable = false, precision = 12, scale = 2)
	private BigDecimal rentalTotal;

	@Column(name = "meetup_location", nullable = false, length = 255)
	private String meetupLocation;

	@Column(name = "renter_note", length = 500)
	private String renterNote;

	private Double meetupLatitude;

	private Double meetupLongitude;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 24)
	private RentalStatus status = RentalStatus.PENDING_PAYMENT;

	@Enumerated(EnumType.STRING)
	@Column(name = "payment_gateway", length = 16)
	private PaymentGateway paymentGateway;

	@Column(name = "payment_ref", length = 80)
	private String paymentRef;

	@Column(name = "meetup_code", nullable = false, length = 16)
	private String meetupCode;

	@Column(name = "meetup_renter_code", length = 16)
	private String meetupRenterCode;

	@Enumerated(EnumType.STRING)
	@Column(name = "escrow_status", length = 16)
	private EscrowStatus escrowStatus = EscrowStatus.NONE;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	private Instant paidAt;

	private Instant startedAt;

	private Instant completedAt;

	@Column(name = "return_meetup_location", length = 255)
	private String returnMeetupLocation;

	private Double returnMeetupLatitude;

	private Double returnMeetupLongitude;

	private Instant returnMeetupAt;

	@Column(name = "return_owner_code", length = 16)
	private String returnOwnerCode;

	@Column(name = "return_renter_code", length = 16)
	private String returnRenterCode;

	@Column(name = "commitment_applied", precision = 12, scale = 2)
	private BigDecimal commitmentApplied;

	@Column(name = "platform_commission", precision = 12, scale = 2)
	private BigDecimal platformCommission;

	@Column(name = "owner_payout", precision = 12, scale = 2)
	private BigDecimal ownerPayout;

	@PrePersist
	void onCreate() {
		Instant now = Instant.now().truncatedTo(ChronoUnit.MILLIS);
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now().truncatedTo(ChronoUnit.MILLIS);
	}
}
