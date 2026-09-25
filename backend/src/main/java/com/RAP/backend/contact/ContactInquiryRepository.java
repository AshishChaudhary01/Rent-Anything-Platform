package com.RAP.backend.contact;

import java.time.Instant;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactInquiryRepository extends JpaRepository<ContactInquiry, UUID> {

	long countByEmailIgnoreCaseAndCreatedAtAfter(String email, Instant since);
}
