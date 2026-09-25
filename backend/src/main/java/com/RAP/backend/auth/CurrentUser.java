package com.RAP.backend.auth;

import com.RAP.backend.common.ApiException;
import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import java.util.Optional;
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
		return find().orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
	}

	public Optional<User> find() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof UUID userId)) {
			return Optional.empty();
		}
		return userRepository.findById(userId);
	}

	public User requireStaff() {
		User user = require();
		if (user.getRole() != Role.ADMIN && user.getRole() != Role.SUPER_ADMIN) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Staff access only");
		}
		return user;
	}

	public User requireSuperAdmin() {
		User user = require();
		if (user.getRole() != Role.SUPER_ADMIN) {
			throw new ApiException(HttpStatus.FORBIDDEN, "Super admin access only");
		}
		return user;
	}
}
