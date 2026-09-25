package com.RAP.backend.report;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.rental.Rental;
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
import jakarta.persistence.Table;
import java.time.Instant;
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
@Table(name = "reports")
public class UserReport {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@JdbcTypeCode(SqlTypes.VARCHAR)
	@Column(length = 36)
	private UUID id;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "reporter_id", nullable = false)
	private User reporter;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "accused_id")
	private User accused;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "listing_id")
	private Listing listing;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rental_id")
	private Rental rental;

	@Column(nullable = false, length = 24)
	private String context;

	@Column(nullable = false, length = 120)
	private String reason;

	@Column(nullable = false, length = 2000)
	private String detail;

	@Column(name = "proof_urls", length = 2000)
	private String proofUrls;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 16)
	private ReportStatus status = ReportStatus.PENDING;

	@Column(name = "resolution_action", length = 80)
	private String resolutionAction;

	@Column(name = "resolution_notes", length = 2000)
	private String resolutionNotes;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "resolver_id")
	private User resolver;

	@Column(name = "resolver_name", length = 120)
	private String resolverName;

	@Column(name = "resolver_role", length = 32)
	private String resolverRole;

	@Column(name = "resolver_email", length = 191)
	private String resolverEmail;

	@Column(name = "resolved_at")
	private Instant resolvedAt;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@PrePersist
	void onCreate() {
		createdAt = Instant.now().truncatedTo(ChronoUnit.MILLIS);
	}
}
