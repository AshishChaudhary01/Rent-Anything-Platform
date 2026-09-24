package com.RAP.backend.chat;

import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.chat.dto.ChatThreadResponse;
import com.RAP.backend.chat.dto.OpenChatRequest;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingRepository;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.rental.RentalRepository;
import com.RAP.backend.user.User;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChatService {

	private final ChatThreadRepository threadRepository;
	private final ChatMessageRepository messageRepository;
	private final ListingRepository listingRepository;
	private final RentalRepository rentalRepository;
	private final CurrentUser currentUser;

	public ChatService(
			ChatThreadRepository threadRepository,
			ChatMessageRepository messageRepository,
			ListingRepository listingRepository,
			RentalRepository rentalRepository,
			CurrentUser currentUser
	) {
		this.threadRepository = threadRepository;
		this.messageRepository = messageRepository;
		this.listingRepository = listingRepository;
		this.rentalRepository = rentalRepository;
		this.currentUser = currentUser;
	}

	@Transactional(readOnly = true)
	public List<ChatThreadResponse> mine() {
		User user = currentUser.require();
		return threadRepository.findByUserAOrUserBOrderByCreatedAtDesc(user, user).stream()
				.map(thread -> ChatThreadResponse.from(thread, user, messageRepository.findByThreadOrderByCreatedAtAsc(thread)))
				.sorted(Comparator.comparing(ChatThreadResponse::updatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
				.toList();
	}

	@Transactional(readOnly = true)
	public ChatThreadResponse get(UUID id) {
		User user = currentUser.require();
		ChatThread thread = requireParticipant(id, user);
		return ChatThreadResponse.from(thread, user, messageRepository.findByThreadOrderByCreatedAtAsc(thread));
	}

	@Transactional
	public ChatThreadResponse open(OpenChatRequest request) {
		User user = currentUser.require();
		Listing listing;
		Rental rental = null;
		User peer;
		if (request.rentalId() != null) {
			rental = rentalRepository.findById(request.rentalId())
					.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rental not found"));
			boolean participant = rental.getRenter().getId().equals(user.getId())
					|| rental.getOwner().getId().equals(user.getId());
			if (!participant) {
				throw new ApiException(HttpStatus.FORBIDDEN, "You are not part of this rental");
			}
			listing = rental.getListing();
			peer = rental.getOwner().getId().equals(user.getId()) ? rental.getRenter() : rental.getOwner();
		} else if (request.listingId() != null) {
			listing = listingRepository.findById(request.listingId())
					.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Listing not found"));
			if (listing.getOwner().getId().equals(user.getId())) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Open a rental chat to message a renter");
			}
			peer = listing.getOwner();
		} else {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Choose a listing or rental to chat");
		}

		User userA = user.getId().compareTo(peer.getId()) < 0 ? user : peer;
		User userB = userA.getId().equals(user.getId()) ? peer : user;
		ChatThread thread = rental != null
				? threadRepository.findByRental(rental).orElse(null)
				: threadRepository.findByListingAndUserAAndUserB(listing, userA, userB).orElse(null);
		if (thread == null) {
			thread = new ChatThread();
			thread.setListing(listing);
			thread.setRental(rental);
			thread.setUserA(userA);
			thread.setUserB(userB);
			thread = threadRepository.save(thread);
		} else if (rental != null && thread.getRental() == null) {
			thread.setRental(rental);
			thread = threadRepository.save(thread);
		}
		if (request.draft() != null && !request.draft().isBlank()) {
			ChatMessage message = new ChatMessage();
			message.setThread(thread);
			message.setSender(user);
			message.setText(request.draft().trim());
			messageRepository.save(message);
		}
		return ChatThreadResponse.from(thread, user, messageRepository.findByThreadOrderByCreatedAtAsc(thread));
	}

	@Transactional
	public ChatThreadResponse send(UUID id, String text) {
		User user = currentUser.require();
		if (text == null || text.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Write a message");
		}
		ChatThread thread = requireParticipant(id, user);
		ChatMessage message = new ChatMessage();
		message.setThread(thread);
		message.setSender(user);
		message.setText(text.trim());
		messageRepository.save(message);
		return ChatThreadResponse.from(thread, user, messageRepository.findByThreadOrderByCreatedAtAsc(thread));
	}

	private ChatThread requireParticipant(UUID id, User user) {
		ChatThread thread = threadRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Chat not found"));
		boolean allowed = thread.getUserA().getId().equals(user.getId())
				|| thread.getUserB().getId().equals(user.getId());
		if (!allowed) {
			throw new ApiException(HttpStatus.FORBIDDEN, "You are not in this chat");
		}
		return thread;
	}
}
