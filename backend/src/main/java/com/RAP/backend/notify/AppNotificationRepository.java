package com.RAP.backend.notify;

import com.RAP.backend.user.User;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppNotificationRepository extends JpaRepository<AppNotification, UUID> {

	Page<AppNotification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

	long countByUserAndReadFlagFalse(User user);

	void deleteByUser(User user);
}
