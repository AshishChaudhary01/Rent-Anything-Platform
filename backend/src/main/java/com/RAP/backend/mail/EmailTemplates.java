package com.RAP.backend.mail;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class EmailTemplates {

	public String welcome(String name, String actionUrl) {
		return wrap("Welcome to RAP", render("welcome", Map.of(
				"name", escape(name),
				"actionUrl", actionUrl
		)));
	}

	public String otp(String heading, String intro, String code, int minutes) {
		return wrap(heading, render("otp", Map.of(
				"heading", escape(heading),
				"intro", escape(intro),
				"code", escape(code),
				"minutes", String.valueOf(minutes)
		)));
	}

	public String notification(String title, String bodyText, String actionUrl, String actionLabel) {
		return wrap(title, render("notification", Map.of(
				"title", escape(title),
				"bodyText", escape(bodyText),
				"actionUrl", actionUrl,
				"actionLabel", escape(actionLabel)
		)));
	}

	public String receipt(Map<String, String> values) {
		return wrap("Payment receipt", render("receipt", values));
	}

	public String wrap(String title, String body) {
		return renderRaw(load("layout"), Map.of("title", escape(title), "body", body));
	}

	private String render(String name, Map<String, String> values) {
		return renderRaw(load(name), values);
	}

	private static String renderRaw(String template, Map<String, String> values) {
		String html = template;
		for (Map.Entry<String, String> entry : values.entrySet()) {
			html = html.replace("{{" + entry.getKey() + "}}", entry.getValue() == null ? "" : entry.getValue());
		}
		return html;
	}

	private static String load(String name) {
		ClassPathResource resource = new ClassPathResource("mail/" + name + ".html");
		try (InputStream in = resource.getInputStream()) {
			return new String(in.readAllBytes(), StandardCharsets.UTF_8);
		} catch (IOException ex) {
			throw new IllegalStateException("Missing mail template " + name, ex);
		}
	}

	public static String escape(String value) {
		if (value == null) return "";
		return value
				.replace("&", "&amp;")
				.replace("<", "&lt;")
				.replace(">", "&gt;")
				.replace("\"", "&quot;");
	}
}
