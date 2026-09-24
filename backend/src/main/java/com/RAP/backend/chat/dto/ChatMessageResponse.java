package com.RAP.backend.chat.dto;

import com.RAP.backend.chat.ChatMessage;
import java.time.Instant;
import java.util.UUID;

public record ChatMessageResponse(UUID id, boolean fromMe, String text, Instant createdAt) {

	public static ChatMessageResponse from(ChatMessage message, UUID viewerId) {
		return new ChatMessageResponse(
				message.getId(),
				message.getSender().getId().equals(viewerId),
				message.getText(),
				message.getCreatedAt()
		);
	}
}
