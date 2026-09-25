package com.RAP.backend.contact;

import com.RAP.backend.contact.dto.ContactRequest;
import com.RAP.backend.contact.dto.ContactResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contact")
public class ContactController {

	private final ContactService contactService;

	public ContactController(ContactService contactService) {
		this.contactService = contactService;
	}

	@PostMapping
	public ContactResponse submit(@Valid @RequestBody ContactRequest request) {
		return contactService.submit(request);
	}
}
