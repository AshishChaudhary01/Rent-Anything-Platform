package com.RAP.backend.user;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCaseAndIdNot(String email, UUID id);

	boolean existsByPhone(String phone);

	boolean existsByPhoneAndIdNot(String phone, UUID id);

	List<User> findByRoleOrderByCreatedAtDesc(Role role);

	Optional<User> findByEmailIgnoreCase(String email);

	Optional<User> findByGoogleId(String googleId);

	List<User> findByKycStatusAndRole(KycStatus kycStatus, Role role);

	List<User> findByRoleIn(Collection<Role> roles);

	long countByKycStatusAndRole(KycStatus kycStatus, Role role);

	long countByRole(Role role);
}
