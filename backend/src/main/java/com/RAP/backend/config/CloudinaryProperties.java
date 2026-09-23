package com.RAP.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cloudinary")
public class CloudinaryProperties {

	private String cloudName = "";
	private String apiKey = "";
	private String apiSecret = "";

	public String getCloudName() {
		return cloudName;
	}

	public void setCloudName(String cloudName) {
		this.cloudName = clean(cloudName);
	}

	public String getApiKey() {
		return apiKey;
	}

	public void setApiKey(String apiKey) {
		this.apiKey = clean(apiKey);
	}

	public String getApiSecret() {
		return apiSecret;
	}

	public void setApiSecret(String apiSecret) {
		this.apiSecret = clean(apiSecret);
	}

	public boolean isConfigured() {
		return notBlank(cloudName) && notBlank(apiKey) && notBlank(apiSecret);
	}

	private static boolean notBlank(String value) {
		return value != null && !value.isBlank();
	}

	private static String clean(String value) {
		if (value == null) {
			return "";
		}
		String trimmed = value.trim();
		if ((trimmed.startsWith("\"") && trimmed.endsWith("\""))
				|| (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
			return trimmed.substring(1, trimmed.length() - 1).trim();
		}
		return trimmed;
	}
}
