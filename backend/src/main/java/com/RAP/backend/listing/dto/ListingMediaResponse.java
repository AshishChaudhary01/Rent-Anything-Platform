package com.RAP.backend.listing.dto;

import com.RAP.backend.listing.ListingMedia;

public record ListingMediaResponse(String url, String type) {

	public static ListingMediaResponse from(ListingMedia media) {
		return new ListingMediaResponse(media.getUrl(), media.getResourceType());
	}
}
