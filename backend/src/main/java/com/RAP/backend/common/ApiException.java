package com.RAP.backend.common;

import java.util.Map;
import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

	private final HttpStatus status;
	private final String details;
	private final Map<String, String> fields;

	public ApiException(HttpStatus status, String message) {
		this(status, message, message, Map.of());
	}

	public ApiException(HttpStatus status, String message, String details) {
		this(status, message, details, Map.of());
	}

	public ApiException(HttpStatus status, String message, String details, Map<String, String> fields) {
		super(message);
		this.status = status;
		this.details = details;
		this.fields = fields == null ? Map.of() : fields;
	}

	public HttpStatus getStatus() {
		return status;
	}

	public String getDetails() {
		return details;
	}

	public Map<String, String> getFields() {
		return fields;
	}
}
