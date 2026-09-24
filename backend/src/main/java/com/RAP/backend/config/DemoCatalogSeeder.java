package com.RAP.backend.config;

import com.RAP.backend.chat.ChatThread;
import com.RAP.backend.chat.ChatThreadRepository;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingMedia;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.listing.ListingStatus;
import com.RAP.backend.rental.RentalRepository;
import com.RAP.backend.report.UserReport;
import com.RAP.backend.report.UserReportRepository;
import com.RAP.backend.review.ReviewRepository;
import com.RAP.backend.user.KycStatus;
import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(20)
public class DemoCatalogSeeder implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(DemoCatalogSeeder.class);
	private static final String SEED_MARK = "Seeded catalog listing.";

	private static final SeedListing[] SEEDS = {
			new SeedListing("Sony A7R IV Kit", "photography", "6110", "15000", "Lazimpat, Kathmandu", 27.7215, 85.3222),
			new SeedListing("MacBook Pro M1", "electronics", "1800", "25000", "Baneshwor, Kathmandu", 27.6939, 85.3420),
			new SeedListing("DeWalt Drill", "adventure-tools", "350", "4000", "Patan, Lalitpur", 27.6710, 85.3250),
			new SeedListing("North Face Tent", "outdoor", "600", "5000", "Lakeside, Pokhara", 28.2096, 83.9556),
			new SeedListing("PS5 Console + Controllers", "gaming", "1500", "20000", "Bhaktapur", 27.6710, 85.4298),
			new SeedListing("Yamaha Acoustic Guitar", "music", "500", "6000", "Pulchowk, Lalitpur", 27.6780, 85.3170),
			new SeedListing("Dyson Vacuum", "appliances", "900", "8000", "New Road, Kathmandu", 27.7041, 85.3145),
			new SeedListing("IKEA Dining Set", "home", "800", "7000", "Kalanki, Kathmandu", 27.6930, 85.2810)
	};

	private final UserRepository userRepository;
	private final ListingRepository listingRepository;
	private final RentalRepository rentalRepository;
	private final ReviewRepository reviewRepository;
	private final ChatThreadRepository chatThreadRepository;
	private final UserReportRepository userReportRepository;

	public DemoCatalogSeeder(
			UserRepository userRepository,
			ListingRepository listingRepository,
			RentalRepository rentalRepository,
			ReviewRepository reviewRepository,
			ChatThreadRepository chatThreadRepository,
			UserReportRepository userReportRepository
	) {
		this.userRepository = userRepository;
		this.listingRepository = listingRepository;
		this.rentalRepository = rentalRepository;
		this.reviewRepository = reviewRepository;
		this.chatThreadRepository = chatThreadRepository;
		this.userReportRepository = userReportRepository;
	}

	@Override
	@Transactional
	public void run(String... args) {
		boolean already = listingRepository.findAll().stream()
				.anyMatch(listing -> listing.getDescription() != null && listing.getDescription().contains(SEED_MARK));
		if (already) {
			return;
		}
		clearRentals();
		seedListings();
	}

	private void clearRentals() {
		if (rentalRepository.count() == 0) {
			return;
		}
		reviewRepository.deleteAll();
		List<UserReport> reports = userReportRepository.findAll();
		reports.forEach(report -> report.setRental(null));
		userReportRepository.saveAll(reports);
		List<ChatThread> threads = chatThreadRepository.findAll();
		threads.forEach(thread -> thread.setRental(null));
		chatThreadRepository.saveAll(threads);
		rentalRepository.deleteAll();
		List<Listing> listings = listingRepository.findAll();
		for (Listing listing : listings) {
			if (listing.getStatus() == ListingStatus.RENTED) {
				listing.setStatus(ListingStatus.AVAILABLE);
			}
		}
		listingRepository.saveAll(listings);
		log.info("Cleared rental data for a fresh start");
	}

	private void seedListings() {
		List<User> owners = userRepository.findByKycStatusAndRole(KycStatus.VERIFIED, Role.USER);
		if (owners.isEmpty()) {
			log.info("No verified user accounts found; skipped catalog listing seed");
			return;
		}
		List<ListingMedia> existingMedia = listingRepository.findAll().stream()
				.flatMap(listing -> listing.getMedia().stream())
				.toList();
		if (existingMedia.isEmpty()) {
			log.info("No listing media URLs in the database; skipped catalog listing seed");
			return;
		}
		int created = 0;
		for (int i = 0; i < SEEDS.length; i++) {
			SeedListing seed = SEEDS[i];
			User owner = owners.get(i % owners.size());
			Listing listing = new Listing();
			listing.setOwner(owner);
			listing.setTitle(seed.title());
			listing.setDescription(SEED_MARK + " " + seed.title() + " available for peer-to-peer rent in Nepal. Deposit is refundable after a clean return.");
			listing.setCategory(seed.category());
			listing.setDailyRate(new BigDecimal(seed.rate()));
			listing.setDeposit(new BigDecimal(seed.deposit()));
			listing.setLocation(seed.location());
			listing.setLatitude(seed.lat());
			listing.setLongitude(seed.lng());
			listing.setStatus(ListingStatus.AVAILABLE);
			List<ListingMedia> copies = new ArrayList<>();
			int take = Math.min(3, existingMedia.size());
			for (int m = 0; m < take; m++) {
				ListingMedia source = existingMedia.get((i + m) % existingMedia.size());
				ListingMedia media = new ListingMedia();
				media.setListing(listing);
				media.setUrl(source.getUrl());
				media.setResourceType(source.getResourceType());
				media.setSortOrder(m);
				copies.add(media);
			}
			listing.getMedia().addAll(copies);
			listingRepository.save(listing);
			created++;
		}
		log.info("Seeded {} catalog listings under verified accounts using existing media URLs", created);
	}

	private record SeedListing(
			String title,
			String category,
			String rate,
			String deposit,
			String location,
			double lat,
			double lng
	) {
	}
}
