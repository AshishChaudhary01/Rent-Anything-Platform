package com.RAP.backend.mail;

import com.RAP.backend.notify.NotificationKind;
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

	public String otp(String heading, String intro, String code, int minutes, String notice) {
		return wrap(heading, render("otp", Map.of(
				"heading", escape(heading),
				"intro", escape(intro),
				"code", escape(code),
				"minutes", String.valueOf(minutes),
				"notice", escape(notice)
		)));
	}

	public String notification(NotificationKind kind, String title, String bodyText, String actionUrl) {
		return wrap(title, render("notification", Map.of(
				"kindLabel", escape(kindLabel(kind)),
				"title", escape(title),
				"bodyText", escape(bodyText),
				"notice", escape(notice(kind)),
				"actionUrl", actionUrl,
				"actionLabel", escape(actionLabel(kind))
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

	private static String kindLabel(NotificationKind kind) {
		if (kind == null) {
			return "RAP notice";
		}
		return switch (kind) {
			case REQUEST -> "Rental request";
			case BOOKING -> "Booking update";
			case PAYMENT -> "Payment notice";
			case PICKUP -> "Meetup notice";
			case RENTAL -> "Rental notice";
			case RETURN -> "Return notice";
			case MESSAGE -> "Message";
			case WELCOME -> "Account notice";
		};
	}

	private static String actionLabel(NotificationKind kind) {
		if (kind == null) {
			return "Open RAP";
		}
		return switch (kind) {
			case REQUEST -> "Review this request";
			case BOOKING -> "Open this booking";
			case PAYMENT -> "View payment";
			case PICKUP -> "View meetup";
			case RENTAL -> "View rental";
			case RETURN -> "View return";
			case MESSAGE -> "Open chat";
			case WELCOME -> "Open RAP";
		};
	}

	private static String notice(NotificationKind kind) {
		if (kind == null) {
			return "Open RAP to see the full details. This email is a short summary of an in-app notice.";
		}
		return switch (kind) {
			case REQUEST -> "A renter asked to book this listing. Accept or decline in RAP. No money moves until you accept and they pay the commitment fee through checkout.";
			case BOOKING -> "This updates a rental request. If it was accepted, pay the commitment fee in RAP to hold the dates. If it was declined or cancelled, no rental will start and no further payment is due.";
			case PAYMENT -> "A RAP checkout payment was recorded. Open the rental for the receipt and the next step. RAP does not take payment in chat.";
			case PICKUP -> "This is about the first meetup. If a no-show was recorded, RAP settles the held commitment fee based on who did not arrive.";
			case RENTAL -> "The rental is now active. The item stays with the renter until both sides complete the return QR.";
			case RETURN -> "The return QR was confirmed, so the rental is complete. Commitment is applied to the rent total, RAP takes platform commission, and the deposit is marked for refund on a clean return.";
			case MESSAGE -> "You have a new chat message in RAP. Reply in the app. RAP never asks you to pay outside eSewa checkout.";
			case WELCOME -> "You can browse listings now. Listing an item or starting a rental needs a profile photo, complete profile details, and verified KYC.";
		};
	}
}
