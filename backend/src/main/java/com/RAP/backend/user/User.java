package com.RAP.backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.Instant;
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
@Table(name = "users")
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@JdbcTypeCode(SqlTypes.VARCHAR)
	@Column(length = 36)
	private UUID id;

	@Column(name = "full_name", nullable = false, length = 120)
	private String fullName;

	@Column(nullable = false, unique = true, length = 191)
	private String email;

	@Column(name = "password_hash", nullable = false, length = 255)
	private String passwordHash;

	@Column(length = 20, unique = true)
	private String phone;

	@Column(name = "address_line", length = 255)
	private String addressLine;

	@Column(length = 80)
	private String city;

	@Column(length = 80)
	private String district;

	@Column(name = "avatar_url", length = 500)
	private String avatarUrl;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 32)
	private Role role = Role.USER;

	@Column(name = "is_active", nullable = false)
	private boolean active = true;

	@Column(name = "account_locked", nullable = false)
	private boolean accountLocked = false;

	@Column(name = "locked_at")
	private Instant lockedAt;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@PrePersist
	void onCreate() {
		Instant now = Instant.now().truncatedTo(java.time.temporal.ChronoUnit.MILLIS);
		createdAt = now;
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}
}
