package com.RAP.backend.payment;

import com.RAP.backend.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedWalletRepository extends JpaRepository<SavedWallet, UUID> {

	List<SavedWallet> findByUserOrderByIsDefaultDescCreatedAtAsc(User user);

	Optional<SavedWallet> findByUserAndGateway(User user, PaymentGateway gateway);

	Optional<SavedWallet> findByIdAndUser(UUID id, User user);

	long countByUser(User user);

	void deleteByUser(User user);
}
