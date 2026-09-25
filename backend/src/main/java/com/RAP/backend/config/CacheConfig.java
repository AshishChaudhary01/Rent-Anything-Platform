package com.RAP.backend.config;

import com.RAP.backend.cache.RapCaches;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import java.util.List;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

	@Bean
	CacheManager cacheManager() {
		CaffeineCacheManager manager = new CaffeineCacheManager();
		manager.setCacheNames(List.of(
				RapCaches.LISTING_BROWSE,
				RapCaches.LISTING_DETAIL,
				RapCaches.LISTING_REVIEWS,
				RapCaches.PUBLIC_PROFILE,
				RapCaches.PUBLIC_LISTINGS,
				RapCaches.PUBLIC_REVIEWS
		));
		manager.setCaffeine(Caffeine.newBuilder()
				.expireAfterWrite(Duration.ofMinutes(5))
				.maximumSize(2_000)
				.recordStats());
		manager.setAllowNullValues(false);
		return manager;
	}
}
