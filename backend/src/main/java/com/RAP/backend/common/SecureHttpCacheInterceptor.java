package com.RAP.backend.common;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Authenticated RAP APIs are private. Browsers and CDNs must not store them.
 * Short-lived in-memory Caffeine is used instead of shared HTTP cache.
 */
@Component
public class SecureHttpCacheInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
		response.setHeader("Pragma", "no-cache");
		response.setDateHeader("Expires", 0);
		return true;
	}
}
