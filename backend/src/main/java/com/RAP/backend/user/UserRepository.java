package com.RAP.backend.user;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCaseAndIdNot(String email, UUID id);

	boolean existsByPhoneAndIdNot(String phone, UUID id);

	Optional<User> findByEmailIgnoreCase(String email);

	Optional<User> findByGoogleId(String googleId);

	List<User> findByKycStatusAndRole(KycStatus kycStatus, Role role);
}
