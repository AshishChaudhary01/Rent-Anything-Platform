package com.RAP.backend.listing;

import java.util.Comparator;

public final class ListingCovers {

	private ListingCovers() {
	}

	public static String imageUrl(Listing listing) {
		if (listing == null || listing.getMedia() == null || listing.getMedia().isEmpty()) {
			return "";
		}
		return listing.getMedia().stream()
				.sorted(Comparator.comparingInt(ListingMedia::getSortOrder))
				.filter(media -> !isVideo(media))
				.map(ListingMedia::getUrl)
				.filter(url -> url != null && !url.isBlank())
				.findFirst()
				.orElseGet(() -> listing.getMedia().stream()
						.sorted(Comparator.comparingInt(ListingMedia::getSortOrder))
						.map(ListingCovers::posterUrl)
						.filter(url -> url != null && !url.isBlank())
						.findFirst()
						.orElse(""));
	}

	private static boolean isVideo(ListingMedia media) {
		String type = media.getResourceType() == null ? "" : media.getResourceType().toLowerCase();
		String url = media.getUrl() == null ? "" : media.getUrl();
		return type.contains("video") || url.contains("/video/upload/");
	}

	private static String posterUrl(ListingMedia media) {
		String url = media.getUrl();
		if (url == null || url.isBlank()) {
			return "";
		}
		if (!isVideo(media)) {
			return url;
		}
		if (url.contains("/video/upload/")) {
			return url.replace("/video/upload/", "/video/upload/so_0,f_jpg/");
		}
		return url;
	}
}
