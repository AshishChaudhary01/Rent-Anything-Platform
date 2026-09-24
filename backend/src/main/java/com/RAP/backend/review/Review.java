package com.RAP.backend.review;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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
@Table(
		name = "reviews",
		uniqueConstraints = @UniqueConstraint(name = "uk_review_rental_author", columnNames = { "rental_id", "author_id" })
)
public class Review {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@JdbcTypeCode(SqlTypes.VARCHAR)
	@Column(length = 36)
	private UUID id;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "rental_id", nullable = false)
	private Rental rental;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "listing_id", nullable = false)
	private Listing listing;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "author_id", nullable = false)
	private User author;

	@ManyToOne(optional = false, fetch = FetchType.LAZY)
	@JoinColumn(name = "subject_id", nullable = false)
	private User subject;

	@Column(nullable = false)
	private int rating;

	@Column(length = 1000)
	private String comment;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@PrePersist
	void onCreate() {
		createdAt = Instant.now().truncatedTo(ChronoUnit.MILLIS);
	}
}
