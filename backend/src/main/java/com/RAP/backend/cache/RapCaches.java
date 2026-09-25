package com.RAP.backend.cache;

/**
 * In-memory catalog caches only. Never put tokens, passwords, OTPs, cookies,
 * payment secrets, or private account/rental/chat payloads in these names.
 */
public final class RapCaches {

	public static final String LISTING_BROWSE = "listingBrowse";
	public static final String LISTING_DETAIL = "listingDetail";
	public static final String LISTING_REVIEWS = "listingReviews";
	public static final String PUBLIC_PROFILE = "publicProfile";
	public static final String PUBLIC_LISTINGS = "publicListings";
	public static final String PUBLIC_REVIEWS = "publicReviews";

	private RapCaches() {
	}
}
