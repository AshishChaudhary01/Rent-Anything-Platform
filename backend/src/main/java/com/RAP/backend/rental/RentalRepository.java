package com.RAP.backend.rental;

import com.RAP.backend.listing.Listing;
import com.RAP.backend.user.User;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RentalRepository extends JpaRepository<Rental, UUID> {

	List<Rental> findByRenterOrderByCreatedAtDesc(User renter);

	List<Rental> findByOwnerOrderByCreatedAtDesc(User owner);

	java.util.Optional<Rental> findFirstByListingAndStatusInOrderByCreatedAtDesc(
			Listing listing,
			Collection<RentalStatus> statuses
	);

	List<Rental> findByListingAndStatusInOrderByStartDateAsc(
			Listing listing,
			Collection<RentalStatus> statuses
	);

	long countByRenterAndStatus(User renter, RentalStatus status);

	long countByOwnerAndStatus(User owner, RentalStatus status);

	long countByListingAndStatusIn(Listing listing, Collection<RentalStatus> statuses);

	@Query("""
			select (count(r) > 0) from Rental r
			where r.listing = :listing
			  and r.status in :statuses
			  and r.startDate <= :endDate
			  and r.endDate >= :startDate
			""")
	boolean hasOverlap(
			@Param("listing") Listing listing,
			@Param("statuses") Collection<RentalStatus> statuses,
			@Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate
	);
}
