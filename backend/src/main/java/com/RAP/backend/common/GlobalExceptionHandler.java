package com.RAP.backend.common;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ApiError> handleApi(ApiException ex) {
		log.warn("exception api {} : {}", ex.getStatus().value(), ex.getMessage());
		return ResponseEntity.status(ex.getStatus())
				.body(new ApiError(ex.getMessage(), ex.getDetails(), ex.getFields()));
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex) {
		log.warn("exception auth : invalid credentials");
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiError(
						"Invalid email or password",
						ex.getMessage(),
						Map.of("password", "Invalid email or password")
				));
	}

	@ExceptionHandler(AuthenticationException.class)
	public ResponseEntity<ApiError> handleAuth(AuthenticationException ex) {
		log.warn("exception auth : {}", ex.getClass().getSimpleName());
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new ApiError("Authentication failed", ex.getMessage(), Map.of()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> fields = new LinkedHashMap<>();
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			fields.putIfAbsent(error.getField(), error.getDefaultMessage());
		}
		String details = fields.entrySet().stream()
				.map(entry -> entry.getKey() + ": " + entry.getValue())
				.collect(Collectors.joining("; "));
		log.warn("exception validation : {}", details);
		return ResponseEntity.badRequest().body(new ApiError("Validation failed", details, fields));
	}

	@ExceptionHandler(MaxUploadSizeExceededException.class)
	public ResponseEntity<ApiError> handleUploadSize(MaxUploadSizeExceededException ex) {
		log.warn("exception upload : file too large");
		return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE)
				.body(new ApiError(
						"That file is too large",
						"Use a photo or a video under 100 MB.",
						Map.of()
				));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiError> handleOther(Exception ex) {
		log.error("exception unhandled {}", ex.getClass().getName(), ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new ApiError("Something went wrong", ex.getMessage(), Map.of()));
	}
}
