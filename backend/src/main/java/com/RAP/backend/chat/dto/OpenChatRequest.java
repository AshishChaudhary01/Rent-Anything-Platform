package com.RAP.backend.chat.dto;

import java.util.UUID;

public record OpenChatRequest(UUID listingId, UUID rentalId, String draft) {
}
