package com.RAP.backend.payment;

import com.RAP.backend.common.ApiException;
import com.RAP.backend.config.PaymentProperties;
import com.RAP.backend.payment.dto.PaymentInitiateResponse;
import com.RAP.backend.rental.Rental;
import com.RAP.backend.user.User;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class PaymentGatewayService {

	private static final ParameterizedTypeReference<Map<String, Object>> MAP =
			new ParameterizedTypeReference<>() {
			};

	private final PaymentProperties properties;
	private final RestClient restClient;

	public PaymentGatewayService(PaymentProperties properties) {
		this.properties = properties;
		this.restClient = RestClient.builder().build();
	}

	public PaymentInitiateResponse initiateEsewa(Rental rental) {
		if (!properties.getEsewa().isConfigured()) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "eSewa is not configured");
		}
		String amount = money(rental.getCommitmentFee());
		String uuid = rental.getPaymentRef();
		String product = properties.getEsewa().getProductCode();
		String signed = "total_amount=" + amount + ",transaction_uuid=" + uuid + ",product_code=" + product;
		Map<String, String> fields = new LinkedHashMap<>();
		fields.put("amount", amount);
		fields.put("tax_amount", "0");
		fields.put("total_amount", amount);
		fields.put("transaction_uuid", uuid);
		fields.put("product_code", product);
		fields.put("product_service_charge", "0");
		fields.put("product_delivery_charge", "0");
		fields.put("success_url", esewaCallbackUrl(rental.getId()));
		fields.put("failure_url", failureUrl(rental.getId()));
		fields.put("signed_field_names", "total_amount,transaction_uuid,product_code");
		fields.put("signature", hmacBase64(signed, properties.getEsewa().getSecret()));
		return new PaymentInitiateResponse(PaymentGateway.ESEWA, properties.getEsewa().getFormUrl(), fields, null);
	}

	public PaymentInitiateResponse initiateKhalti(Rental rental, User renter) {
		if (!properties.getKhalti().isConfigured()) {
			throw new ApiException(
					HttpStatus.SERVICE_UNAVAILABLE,
					"Khalti sandbox is not configured. Add a free test merchant secret in application-local.properties"
			);
		}
		int paisa = rental.getCommitmentFee().multiply(BigDecimal.valueOf(100)).intValueExact();
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("return_url", callbackUrl(rental.getId(), PaymentGateway.KHALTI));
		body.put("website_url", properties.getFrontendBaseUrl());
		body.put("amount", paisa);
		body.put("purchase_order_id", rental.getId().toString());
		body.put("purchase_order_name", rental.getListing().getTitle());
		body.put("customer_info", Map.of(
				"name", renter.getFullName(),
				"email", renter.getEmail(),
				"phone", renter.getPhone() == null ? "" : renter.getPhone()
		));
		Map<String, Object> response;
		try {
			response = restClient.post()
					.uri(properties.getKhalti().getInitiateUrl())
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", "Key " + properties.getKhalti().getSecret())
					.body(body)
					.retrieve()
					.body(MAP);
		} catch (Exception ex) {
			throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not start Khalti payment", ex.getMessage());
		}
		if (response == null || response.get("payment_url") == null) {
			throw new ApiException(HttpStatus.BAD_GATEWAY, "Khalti did not return a payment URL");
		}
		Object pidx = response.get("pidx");
		if (pidx != null && !pidx.toString().isBlank()) {
			rental.setPaymentRef(pidx.toString());
		}
		return new PaymentInitiateResponse(
				PaymentGateway.KHALTI,
				null,
				Map.of(),
				response.get("payment_url").toString()
		);
	}

	public void verifyEsewa(Rental rental, String encodedData) {
		String payload = encodedData == null ? "" : encodedData.trim();
		if (payload.contains("data=")) {
			payload = payload.substring(payload.indexOf("data=") + 5);
		}
		if (!payload.isBlank()) {
			String json;
			try {
				json = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
			} catch (Exception urlSafe) {
				try {
					json = new String(Base64.getDecoder().decode(payload), StandardCharsets.UTF_8);
				} catch (Exception ex) {
					json = "";
				}
			}
			if (!json.isBlank()) {
				String status = jsonString(json, "status").toUpperCase(Locale.ROOT);
				String uuid = jsonString(json, "transaction_uuid");
				if (!uuid.isBlank() && !uuid.equals(rental.getPaymentRef())) {
					throw new ApiException(HttpStatus.BAD_REQUEST, "eSewa transaction does not match this rental");
				}
				if ("COMPLETE".equals(status)) {
					return;
				}
			}
		}
		if (!confirmEsewaStatus(rental)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "eSewa payment is not complete");
		}
	}

	public void verifyKhalti(Rental rental, String pidx) {
		if (!properties.getKhalti().isConfigured()) {
			throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "Khalti is not configured");
		}
		String id = pidx == null || pidx.isBlank() ? rental.getPaymentRef() : pidx;
		if (id == null || id.isBlank()) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Missing Khalti payment reference");
		}
		Map<String, Object> response;
		try {
			response = restClient.post()
					.uri(properties.getKhalti().getLookupUrl())
					.contentType(MediaType.APPLICATION_JSON)
					.header("Authorization", "Key " + properties.getKhalti().getSecret())
					.body(Map.of("pidx", id))
					.retrieve()
					.body(MAP);
		} catch (Exception ex) {
			throw new ApiException(HttpStatus.BAD_GATEWAY, "Could not verify Khalti payment", ex.getMessage());
		}
		if (response == null) {
			throw new ApiException(HttpStatus.BAD_GATEWAY, "Empty Khalti lookup response");
		}
		String status = String.valueOf(response.getOrDefault("status", ""));
		if (!"Completed".equalsIgnoreCase(status)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Khalti payment is not complete");
		}
		int expected = rental.getCommitmentFee().multiply(BigDecimal.valueOf(100)).intValueExact();
		Object amount = response.get("total_amount");
		if (amount instanceof Number number && number.intValue() != expected) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Khalti amount does not match the commitment fee");
		}
	}

	private boolean confirmEsewaStatus(Rental rental) {
		String uuid = rental.getPaymentRef();
		if (uuid == null || uuid.isBlank()) {
			return false;
		}
		String product = properties.getEsewa().getProductCode();
		for (String amount : List.of(
				money(rental.getCommitmentFee()),
				rental.getCommitmentFee().setScale(1, RoundingMode.HALF_UP).toPlainString(),
				rental.getCommitmentFee().setScale(2, RoundingMode.HALF_UP).toPlainString()
		)) {
			String url = properties.getEsewa().getStatusUrl()
					+ "?product_code=" + product
					+ "&total_amount=" + amount
					+ "&transaction_uuid=" + uuid;
			try {
				Map<String, Object> response = restClient.get().uri(url).retrieve().body(MAP);
				if (response == null) {
					continue;
				}
				String status = String.valueOf(response.getOrDefault("status", "")).toUpperCase(Locale.ROOT);
				if ("COMPLETE".equals(status)) {
					return true;
				}
			} catch (Exception ignored) {
				// try the next amount format
			}
		}
		return false;
	}

	private String esewaCallbackUrl(java.util.UUID rentalId) {
		return properties.getFrontendBaseUrl() + "/user/rent/payment/callback/ESEWA/" + rentalId;
	}

	private String callbackUrl(java.util.UUID rentalId, PaymentGateway gateway) {
		return properties.getFrontendBaseUrl() + "/user/rent/payment/callback/" + gateway.name() + "/" + rentalId;
	}

	private String failureUrl(java.util.UUID rentalId) {
		return properties.getFrontendBaseUrl() + "/user/rent/checkout?rentalId=" + rentalId + "&failed=1";
	}

	private static String money(BigDecimal value) {
		return value.stripTrailingZeros().toPlainString();
	}

	private static String jsonString(String json, String key) {
		Matcher matcher = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\"([^\"]*)\"").matcher(json);
		return matcher.find() ? matcher.group(1) : "";
	}

	private static String hmacBase64(String message, String secret) {
		try {
			Mac mac = Mac.getInstance("HmacSHA256");
			mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
			return Base64.getEncoder().encodeToString(mac.doFinal(message.getBytes(StandardCharsets.UTF_8)));
		} catch (Exception ex) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not sign eSewa request");
		}
	}
}
