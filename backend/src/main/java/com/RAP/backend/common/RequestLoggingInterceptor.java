package com.RAP.backend.common;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

	private static final Logger log = LoggerFactory.getLogger(RequestLoggingInterceptor.class);
	private static final String STARTED = RequestLoggingInterceptor.class.getName() + ".started";

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
		String incoming = request.getHeader("X-Request-Id");
		String requestId = incoming == null || incoming.isBlank() ? UUID.randomUUID().toString().substring(0, 8) : incoming.trim();
		MDC.put("requestId", requestId);
		MDC.put("user", currentUser());
		response.setHeader("X-Request-Id", requestId);
		request.setAttribute(STARTED, System.nanoTime());
		log.info("http in {} {}", request.getMethod(), safePath(request));
		return true;
	}

	@Override
	public void afterCompletion(
			HttpServletRequest request,
			HttpServletResponse response,
			Object handler,
			Exception exception
	) {
		try {
			MDC.put("user", currentUser());
			Object started = request.getAttribute(STARTED);
			long ms = started instanceof Long nano ? (System.nanoTime() - nano) / 1_000_000 : -1;
			if (exception != null) {
				log.warn(
						"http fail {} {} -> {} {}ms : {}",
						request.getMethod(),
						safePath(request),
						response.getStatus(),
						ms,
						exception.getClass().getSimpleName()
				);
			} else {
				log.info("http out {} {} -> {} {}ms", request.getMethod(), safePath(request), response.getStatus(), ms);
			}
		} finally {
			MDC.clear();
		}
	}

	private static String currentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
			return "-";
		}
		String name = auth.getName();
		if (name == null || name.isBlank() || "anonymousUser".equals(name)) {
			return "-";
		}
		return name;
	}

	private static String safePath(HttpServletRequest request) {
		String path = request.getRequestURI();
		return path == null ? "/" : path;
	}
}
