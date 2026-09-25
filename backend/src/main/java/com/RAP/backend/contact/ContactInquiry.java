package com.RAP.backend.contact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "contact_inquiries")
public class ContactInquiry {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@JdbcTypeCode(SqlTypes.VARCHAR)
	@Column(length = 36)
	private UUID id;

	@Column(nullable = false, length = 120)
	private String name;

	@Column(nullable = false, length = 191)
	private String email;

	@Column(nullable = false, length = 2000)
	private String message;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@PrePersist
	void onCreate() {
		createdAt = Instant.now().truncatedTo(ChronoUnit.MILLIS);
	}
}
