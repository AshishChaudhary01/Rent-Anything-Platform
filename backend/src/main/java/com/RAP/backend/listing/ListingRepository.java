package com.RAP.backend.listing;

import com.RAP.backend.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<Listing, UUID> {

	@Query("select distinct l from Listing l left join fetch l.owner left join fetch l.media")
	List<Listing> findAllWithOwnerAndMedia();

	List<Listing> findByOwnerOrderByCreatedAtDesc(User owner);

	List<Listing> findByOwnerAndStatusInOrderByUpdatedAtDesc(User owner, java.util.Collection<ListingStatus> statuses);

	Page<Listing> findByOwnerAndStatusIn(User owner, java.util.Collection<ListingStatus> statuses, Pageable pageable);

	@Query("""
			select l from Listing l
			where l.status in :statuses
			  and (:category is null or l.category = :category)
			  and (
			    :query is null
			    or lower(l.title) like :query
			    or lower(l.location) like :query
			    or lower(l.description) like :query
			  )
			""")
	Page<Listing> searchPublic(
			@Param("statuses") java.util.Collection<ListingStatus> statuses,
			@Param("category") String category,
			@Param("query") String query,
			Pageable pageable
	);
}
