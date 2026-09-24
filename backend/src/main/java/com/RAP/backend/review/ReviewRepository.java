package com.RAP.backend.review;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

	@Query("select r from Review r where r.listing = :listing and r.author.id <> r.listing.owner.id order by r.createdAt desc")
	List<Review> findListingReviews(@Param("listing") Listing listing);

	Optional<Review> findByRentalAndAuthor(Rental rental, User author);

	boolean existsByRentalAndAuthor(Rental rental, User author);

	@Query("select avg(r.rating) from Review r where r.subject = :user")
	Double averageForSubject(@Param("user") User user);

	@Query("select count(r) from Review r where r.subject = :user")
	long countForSubject(@Param("user") User user);

	@Query("select avg(r.rating) from Review r where r.listing = :listing and r.author.id <> r.listing.owner.id")
	Double averageForListing(@Param("listing") Listing listing);

	@Query("""
			select r from Review r
			where r.subject.id = :userId
			  and (:rating = 0 or r.rating = :rating)
			  and (
			    :role = 'ALL'
			    or (:role = 'OWNER' and r.listing.owner.id = :userId)
			    or (:role = 'RENTER' and r.listing.owner.id <> :userId)
			  )
			""")
	Page<Review> searchForSubject(
			@Param("userId") UUID userId,
			@Param("rating") int rating,
			@Param("role") String role,
			Pageable pageable
	);
}
