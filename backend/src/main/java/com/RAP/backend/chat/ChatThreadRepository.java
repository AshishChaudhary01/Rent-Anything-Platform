package com.RAP.backend.chat;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatThreadRepository extends JpaRepository<ChatThread, UUID> {

	List<ChatThread> findByUserAOrUserBOrderByCreatedAtDesc(User userA, User userB);

	Optional<ChatThread> findByListingAndUserAAndUserB(Listing listing, User userA, User userB);

	Optional<ChatThread> findByRental(Rental rental);
}
