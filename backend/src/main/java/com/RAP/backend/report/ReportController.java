package com.RAP.backend.report;

import com.RAP.backend.report.dto.ReportResponse;
import java.util.List;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/reports")
public class ReportController {

	private final ReportService reportService;

	public ReportController(ReportService reportService) {
		this.reportService = reportService;
	}

	@GetMapping("/mine")
	public List<ReportResponse> mine() {
		return reportService.mine();
	}

	@GetMapping("/{id}")
	public ReportResponse get(@PathVariable UUID id) {
		return reportService.get(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ReportResponse create(
			@RequestParam String context,
			@RequestParam String reason,
			@RequestParam String detail,
			@RequestParam(required = false) UUID listingId,
			@RequestParam(required = false) UUID accusedId,
			@RequestParam(required = false) UUID rentalId,
			@RequestPart("files") List<MultipartFile> files
	) {
		return reportService.create(context, reason, detail, listingId, accusedId, rentalId, files);
	}
}
