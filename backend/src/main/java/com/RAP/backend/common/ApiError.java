package com.RAP.backend.common;

import java.util.Map;

public record ApiError(String message, String details, Map<String, String> fields) {

	public ApiError(String message, String details) {
		this(message, details, Map.of());
	}
}
