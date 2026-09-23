package com.RAP.backend.config;

import com.RAP.backend.user.Role;
import com.RAP.backend.user.User;
import com.RAP.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

	private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		seed("superadmin@rap.np", "RAP Super Admin", Role.SUPER_ADMIN, "rapadmin1");
		seed("admin@rap.np", "RAP Admin", Role.ADMIN, "rapadmin1");
	}

	private void seed(String email, String fullName, Role role, String rawPassword) {
		if (userRepository.existsByEmailIgnoreCase(email)) {
			return;
		}
		User user = new User();
		user.setEmail(email);
		user.setFullName(fullName);
		user.setRole(role);
		user.setPasswordHash(passwordEncoder.encode(rawPassword));
		user.setActive(true);
		userRepository.save(user);
		log.info("Seeded {} account: {}", role, email);
	}
}
