package com.RAP.backend.listing.dto;

import java.util.List;
import org.springframework.data.domain.Page;

public record ListingPageResponse(
		List<ListingResponse> items,
		long total,
		int page,
		int size
) {

	public static ListingPageResponse from(Page<ListingResponse> page) {
		return new ListingPageResponse(
				page.getContent(),
				page.getTotalElements(),
				page.getNumber(),
				page.getSize()
		);
	}
}
