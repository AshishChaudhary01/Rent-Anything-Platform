package com.RAP.backend.config;

import java.math.BigDecimal;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.payment")
public class PaymentProperties {

	private BigDecimal commitmentFee = new BigDecimal("100.00");
	private BigDecimal commissionPercent = new BigDecimal("0.08");
	private String frontendBaseUrl = "http://localhost:5173";
	private final Esewa esewa = new Esewa();
	private final Khalti khalti = new Khalti();

	public BigDecimal getCommitmentFee() {
		return commitmentFee;
	}

	public void setCommitmentFee(BigDecimal commitmentFee) {
		this.commitmentFee = commitmentFee;
	}

	public BigDecimal getCommissionPercent() {
		return commissionPercent;
	}

	public void setCommissionPercent(BigDecimal commissionPercent) {
		this.commissionPercent = commissionPercent == null ? new BigDecimal("0.08") : commissionPercent;
	}

	public String getFrontendBaseUrl() {
		return frontendBaseUrl;
	}

	public void setFrontendBaseUrl(String frontendBaseUrl) {
		this.frontendBaseUrl = trimToEmpty(frontendBaseUrl);
	}

	public Esewa getEsewa() {
		return esewa;
	}

	public Khalti getKhalti() {
		return khalti;
	}

	public static class Esewa {
		private String productCode = "EPAYTEST";
		private String secret = "8gBm/:&EnhH.1/q";
		private String formUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
		private String statusUrl = "https://rc.esewa.com.np/api/epay/transaction/status/";

		public String getProductCode() {
			return productCode;
		}

		public void setProductCode(String productCode) {
			this.productCode = blankToDefault(productCode, "EPAYTEST");
		}

		public String getSecret() {
			return secret;
		}

		public void setSecret(String secret) {
			this.secret = blankToDefault(secret, "8gBm/:&EnhH.1/q");
		}

		public String getFormUrl() {
			return formUrl;
		}

		public void setFormUrl(String formUrl) {
			this.formUrl = blankToDefault(formUrl, "https://rc-epay.esewa.com.np/api/epay/main/v2/form");
		}

		public String getStatusUrl() {
			return statusUrl;
		}

		public void setStatusUrl(String statusUrl) {
			this.statusUrl = blankToDefault(statusUrl, "https://rc.esewa.com.np/api/epay/transaction/status/");
		}

		public boolean isConfigured() {
			return notBlank(productCode) && notBlank(secret) && notBlank(formUrl);
		}
	}

	public static class Khalti {
		private String secret = "";
		private String initiateUrl = "https://dev.khalti.com/api/v2/epayment/initiate/";
		private String lookupUrl = "https://dev.khalti.com/api/v2/epayment/lookup/";

		public String getSecret() {
			return secret;
		}

		public void setSecret(String secret) {
			this.secret = trimToEmpty(secret);
		}

		public String getInitiateUrl() {
			return initiateUrl;
		}

		public void setInitiateUrl(String initiateUrl) {
			this.initiateUrl = blankToDefault(initiateUrl, "https://dev.khalti.com/api/v2/epayment/initiate/");
		}

		public String getLookupUrl() {
			return lookupUrl;
		}

		public void setLookupUrl(String lookupUrl) {
			this.lookupUrl = blankToDefault(lookupUrl, "https://dev.khalti.com/api/v2/epayment/lookup/");
		}

		public boolean isConfigured() {
			return notBlank(secret) && notBlank(initiateUrl) && notBlank(lookupUrl);
		}
	}

	private static String trimToEmpty(String value) {
		return value == null ? "" : value.trim();
	}

	private static boolean notBlank(String value) {
		return value != null && !value.isBlank();
	}

	private static String blankToDefault(String value, String fallback) {
		return notBlank(value) ? value.trim() : fallback;
	}
}
