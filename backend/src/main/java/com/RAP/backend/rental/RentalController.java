package com.RAP.backend.rental;

import com.RAP.backend.payment.dto.PaymentConfigResponse;
import com.RAP.backend.payment.dto.PaymentInitiateResponse;
import com.RAP.backend.rental.dto.CreateRentalRequest;
import com.RAP.backend.rental.dto.InitiatePaymentRequest;
import com.RAP.backend.rental.dto.RentalResponse;
import com.RAP.backend.rental.dto.StartRentalRequest;
import com.RAP.backend.rental.dto.VerifyEsewaRequest;
import com.RAP.backend.rental.dto.VerifyKhaltiRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rentals")
public class RentalController {

	private final RentalService rentalService;

	public RentalController(RentalService rentalService) {
		this.rentalService = rentalService;
	}

	@GetMapping("/payment-config")
	public PaymentConfigResponse paymentConfig() {
		return rentalService.paymentConfig();
	}

	@GetMapping("/mine")
	public List<RentalResponse> mine() {
		return rentalService.mine();
	}

	@GetMapping("/owned")
	public List<RentalResponse> owned() {
		return rentalService.owned();
	}

	@GetMapping("/{id}")
	public RentalResponse get(@PathVariable UUID id) {
		return rentalService.get(id);
	}

	@PostMapping
	public RentalResponse create(@Valid @RequestBody CreateRentalRequest request) {
		return rentalService.create(request);
	}

	@PostMapping("/{id}/payments")
	public PaymentInitiateResponse initiate(
			@PathVariable UUID id,
			@Valid @RequestBody InitiatePaymentRequest request
	) {
		return rentalService.initiatePayment(id, request);
	}

	@PostMapping("/{id}/payments/esewa/verify")
	public RentalResponse verifyEsewa(@PathVariable UUID id, @RequestBody VerifyEsewaRequest request) {
		return rentalService.verifyEsewa(id, request == null ? null : request.data());
	}

	@PostMapping("/{id}/payments/khalti/verify")
	public RentalResponse verifyKhalti(@PathVariable UUID id, @RequestBody VerifyKhaltiRequest request) {
		return rentalService.verifyKhalti(id, request == null ? null : request.pidx());
	}

	@PostMapping("/{id}/start")
	public RentalResponse start(@PathVariable UUID id, @Valid @RequestBody StartRentalRequest request) {
		return rentalService.start(id, request);
	}

	@PostMapping("/{id}/return-schedule")
	public RentalResponse scheduleReturn(
			@PathVariable UUID id,
			@Valid @RequestBody com.RAP.backend.rental.dto.ScheduleReturnRequest request
	) {
		return rentalService.scheduleReturn(id, request);
	}

	@PostMapping("/{id}/return")
	public RentalResponse finishReturn(@PathVariable UUID id, @Valid @RequestBody StartRentalRequest request) {
		return rentalService.finishReturn(id, request);
	}

	@PostMapping("/{id}/no-show")
	public RentalResponse reportNoShow(@PathVariable UUID id) {
		return rentalService.reportNoShow(id);
	}

	@PostMapping("/{id}/accept")
	public RentalResponse accept(@PathVariable UUID id) {
		return rentalService.accept(id);
	}

	@PostMapping("/{id}/decline")
	public RentalResponse decline(@PathVariable UUID id) {
		return rentalService.decline(id);
	}

	@PostMapping("/{id}/reviews")
	public RentalResponse review(
			@PathVariable UUID id,
			@Valid @RequestBody com.RAP.backend.review.dto.SubmitReviewRequest request
	) {
		return rentalService.review(id, request);
	}

	@PostMapping("/{id}/cancel")
	public RentalResponse cancel(@PathVariable UUID id) {
		return rentalService.cancel(id);
	}
}
