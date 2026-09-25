package com.RAP.backend.otp;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, UUID> {

	Optional<EmailOtp> findTopByEmailAndPurposeAndConsumedAtIsNullOrderByCreatedAtDesc(String email, OtpPurpose purpose);

	void deleteByEmail(String email);
}
