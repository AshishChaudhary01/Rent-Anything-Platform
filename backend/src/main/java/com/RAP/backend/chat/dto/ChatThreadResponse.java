package com.RAP.backend.chat.dto;

import com.RAP.backend.chat.ChatMessage;
import com.RAP.backend.chat.ChatThread;
import com.RAP.backend.listing.Listing;
import com.RAP.backend.listing.ListingCovers;
import com.RAP.backend.user.User;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChatThreadResponse(
		UUID id,
		UUID listingId,
		UUID rentalId,
		String peerName,
		UUID peerId,
		String peerRole,
		String peerAvatarUrl,
		String listingTitle,
		String listingImage,
		String listingRate,
		String lastMessage,
		Instant updatedAt,
		List<ChatMessageResponse> messages
) {

	public static ChatThreadResponse from(ChatThread thread, User viewer, List<ChatMessage> messages) {
		User peer = thread.getUserA().getId().equals(viewer.getId()) ? thread.getUserB() : thread.getUserA();
		boolean viewerIsOwner = thread.getListing().getOwner().getId().equals(viewer.getId());
		Listing listing = thread.getListing();
		String image = ListingCovers.imageUrl(listing);
		ChatMessage last = messages.isEmpty() ? null : messages.get(messages.size() - 1);
		return new ChatThreadResponse(
				thread.getId(),
				listing.getId(),
				thread.getRental() == null ? null : thread.getRental().getId(),
				peer.getFullName(),
				peer.getId(),
				viewerIsOwner ? "Renter" : "Owner",
				peer.getAvatarUrl(),
				listing.getTitle(),
				image,
				"Nrs. " + listing.getDailyRate() + " / day",
				last == null ? "" : last.getText(),
				last == null ? thread.getCreatedAt() : last.getCreatedAt(),
				messages.stream().map(message -> ChatMessageResponse.from(message, viewer.getId())).toList()
		);
	}
}
