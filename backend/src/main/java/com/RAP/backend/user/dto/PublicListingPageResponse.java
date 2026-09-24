package com.RAP.backend.user.dto;

import java.util.List;

public record PublicListingPageResponse(
		int page,
		int size,
		long total,
		List<PublicProfileListingResponse> items
) {
}
