package com.RAP.backend.cache;

import java.util.function.Supplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

@Component
public class RapCacheStore {

	private static final Logger log = LoggerFactory.getLogger(RapCacheStore.class);

	private final CacheManager cacheManager;

	public RapCacheStore(CacheManager cacheManager) {
		this.cacheManager = cacheManager;
	}

	public <T> T getOrLoad(String cacheName, String key, Supplier<T> loader) {
		Cache cache = cacheManager.getCache(cacheName);
		if (cache == null) {
			return loader.get();
		}
		Cache.ValueWrapper wrapper = cache.get(key);
		if (wrapper != null && wrapper.get() != null) {
			@SuppressWarnings("unchecked")
			T cached = (T) wrapper.get();
			log.debug("cache hit {} {}", cacheName, key);
			return cached;
		}
		T value = loader.get();
		if (value != null) {
			cache.put(key, value);
		}
		return value;
	}

	public void evictCatalog() {
		clear(RapCaches.LISTING_BROWSE);
		clear(RapCaches.LISTING_DETAIL);
		clear(RapCaches.LISTING_REVIEWS);
		clear(RapCaches.PUBLIC_PROFILE);
		clear(RapCaches.PUBLIC_LISTINGS);
		clear(RapCaches.PUBLIC_REVIEWS);
		log.info("flow catalog cache cleared");
	}

	private void clear(String cacheName) {
		Cache cache = cacheManager.getCache(cacheName);
		if (cache != null) {
			cache.clear();
		}
	}
}
