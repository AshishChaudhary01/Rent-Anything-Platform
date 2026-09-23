package com.RAP.backend.auth;

import com.RAP.backend.common.ApiException;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

	private final UserRepository userRepository;

	public CurrentUser(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public User require() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof UUID userId)) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized");
		}
		return userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Account not found"));
	}
}
