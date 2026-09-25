package com.RAP.backend.rental;

import com.RAP.backend.auth.CurrentUser;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.user.User;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReceiptService {

	private static final DateTimeFormatter WHEN = DateTimeFormatter.ofPattern("d MMM yyyy, h:mm a")
			.withZone(ZoneId.of("Asia/Kathmandu"));

	private final RentalRepository rentalRepository;
	private final CurrentUser currentUser;

	public ReceiptService(RentalRepository rentalRepository, CurrentUser currentUser) {
		this.rentalRepository = rentalRepository;
		this.currentUser = currentUser;
	}

	@Transactional(readOnly = true)
	public byte[] pdf(UUID id, String kind) {
		Rental rental = require(id);
		String resolved = kind == null ? "COMMITMENT" : kind.trim().toUpperCase();
		boolean remaining = resolved.equals("RENT") || resolved.equals("REMAINING");
		if (remaining) {
			if (!rental.remainingPaid() && rental.getStatus() != RentalStatus.ACTIVE && rental.getStatus() != RentalStatus.COMPLETED) {
				throw new ApiException(HttpStatus.BAD_REQUEST, "Remaining rent is not paid yet");
			}
		} else if (rental.getPaidAt() == null) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "Commitment is not paid yet");
		}
		BigDecimal amount = remaining ? rental.remainingRent() : rental.getCommitmentFee();
		String ref = remaining ? rental.getRemainingPaymentRef() : rental.getPaymentRef();
		var when = remaining ? rental.getRemainingPaidAt() : rental.getPaidAt();
		String kindLabel = remaining ? "Remaining rent" : "Commitment fee";
		String receiptNo = (remaining ? "RENT-" : "CMT-") + rental.getId().toString().substring(0, 8).toUpperCase();
		try (PDDocument document = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
			PDPage page = new PDPage(PDRectangle.A4);
			document.addPage(page);
			PDType1Font heading = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
			PDType1Font body = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
			try (PDPageContentStream stream = new PDPageContentStream(document, page)) {
				float y = 760;
				y = write(stream, heading, 18, 50, y, "RAP payment receipt");
				y = write(stream, body, 11, 50, y - 8, kindLabel + "  ·  " + (when == null ? "" : WHEN.format(when)));
				y -= 24;
				y = row(stream, heading, body, y, "Receipt", receiptNo);
				y = row(stream, heading, body, y, "Listing", rental.getListing().getTitle());
				y = row(stream, heading, body, y, "Renter", rental.getRenter().getFullName());
				y = row(stream, heading, body, y, "Dates", rental.getStartDate() + " - " + rental.getEndDate());
				y = row(stream, heading, body, y, "Gateway", rental.getPaymentGateway() == null ? "eSewa" : rental.getPaymentGateway().name());
				y = row(stream, heading, body, y, "Reference", ref == null || ref.isBlank() ? "-" : ref);
				row(stream, heading, heading, y - 8, "Amount paid", "Nrs. " + amount.toPlainString());
				write(stream, body, 10, 50, 80, "Keep this receipt for your records. RAP holds commitment fees in escrow until the rental is completed.");
			}
			document.save(out);
			return out.toByteArray();
		} catch (IOException ex) {
			throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not build the receipt PDF");
		}
	}

	private Rental require(UUID id) {
		User user = currentUser.require();
		Rental rental = rentalRepository.findById(id)
				.orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Rental not found"));
		boolean allowed = rental.getRenter().getId().equals(user.getId())
				|| rental.getOwner().getId().equals(user.getId());
		if (!allowed) {
			throw new ApiException(HttpStatus.FORBIDDEN, "You are not part of this rental");
		}
		return rental;
	}

	private static float row(
			PDPageContentStream stream,
			PDType1Font labelFont,
			PDType1Font valueFont,
			float y,
			String label,
			String value
	) throws IOException {
		write(stream, labelFont, 11, 50, y, label);
		write(stream, valueFont, 11, 280, y, value == null ? "" : value);
		return y - 22;
	}

	private static float write(PDPageContentStream stream, PDType1Font font, float size, float x, float y, String text)
			throws IOException {
		stream.beginText();
		stream.setFont(font, size);
		stream.newLineAtOffset(x, y);
		stream.showText(winAnsi(text));
		stream.endText();
		return y - size - 4;
	}

	private static String winAnsi(String value) {
		if (value == null) {
			return "";
		}
		StringBuilder builder = new StringBuilder(value.length());
		for (int i = 0; i < value.length(); i++) {
			char ch = value.charAt(i);
			builder.append(ch >= 32 && ch <= 126 ? ch : '?');
		}
		return builder.toString();
	}
}
