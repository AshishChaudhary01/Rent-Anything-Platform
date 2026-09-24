package com.RAP.backend.listing;

import com.RAP.backend.user.User;
import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
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
@Table(name = "listings")
public class Listing {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@JdbcTypeCode(SqlTypes.VARCHAR)
	@Column(length = 36)
	private UUID id;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "owner_id", nullable = false)
	private User owner;

	@Column(nullable = false, length = 120)
	private String title;

	@Column(nullable = false, length = 2000)
	private String description;

	@Column(nullable = false, length = 64)
	private String category;

	@Column(name = "daily_rate", nullable = false, precision = 12, scale = 2)
	private BigDecimal dailyRate;

	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal deposit;

	@Column(nullable = false, length = 255)
	private String location;

	private Double latitude;

	private Double longitude;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 24)
	private ListingStatus status = ListingStatus.AVAILABLE;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("sortOrder ASC")
	private List<ListingMedia> media = new ArrayList<>();

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
