package com.RAP.backend.admin;

import com.RAP.backend.admin.dto.AdminListingResponse;
import com.RAP.backend.admin.dto.AdminOverviewResponse;
import com.RAP.backend.admin.dto.AdminRentalResponse;
import com.RAP.backend.admin.dto.AdminStatusRequest;
import com.RAP.backend.admin.dto.AdminUserResponse;
import com.RAP.backend.admin.dto.CreateAdminRequest;
import com.RAP.backend.admin.dto.ResolveReportRequest;
import com.RAP.backend.admin.dto.ReviewKycRequest;
import com.RAP.backend.admin.dto.UpdateAdminRequest;
import com.RAP.backend.report.ReportService;
import com.RAP.backend.report.dto.ReportResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

	private final AdminService adminService;
	private final ReportService reportService;

	public AdminController(AdminService adminService, ReportService reportService) {
		this.adminService = adminService;
		this.reportService = reportService;
	}

	@GetMapping("/overview")
	public AdminOverviewResponse overview() {
		return adminService.overview();
	}

	@GetMapping("/users")
	public List<AdminUserResponse> users() {
		return adminService.users();
	}

	@GetMapping("/users/{id}")
	public AdminUserResponse user(@PathVariable UUID id) {
		return adminService.user(id);
	}

	@PostMapping("/users/{id}/status")
	public AdminUserResponse userStatus(@PathVariable UUID id, @Valid @RequestBody AdminStatusRequest request) {
		return adminService.setUserStatus(id, request.status());
	}

	@GetMapping("/listings")
	public List<AdminListingResponse> listings() {
		return adminService.listings();
	}

	@GetMapping("/listings/{id}")
	public AdminListingResponse listing(@PathVariable UUID id) {
		return adminService.listing(id);
	}

	@PostMapping("/listings/{id}/status")
	public AdminListingResponse listingStatus(@PathVariable UUID id, @Valid @RequestBody AdminStatusRequest request) {
		return adminService.setListingStatus(id, request.status());
	}

	@GetMapping("/kyc")
	public List<AdminUserResponse> kyc() {
		return adminService.kycQueue();
	}

	@GetMapping("/kyc/{id}")
	public AdminUserResponse kycCase(@PathVariable UUID id) {
		return adminService.user(id);
	}

	@PostMapping("/kyc/{id}/review")
	public AdminUserResponse reviewKyc(@PathVariable UUID id, @RequestBody ReviewKycRequest request) {
		return adminService.reviewKyc(id, request);
	}

	@GetMapping("/reports")
	public List<ReportResponse> reports() {
		return reportService.adminAll();
	}

	@GetMapping("/reports/{id}")
	public ReportResponse report(@PathVariable UUID id) {
		return reportService.adminGet(id);
	}

	@PostMapping("/reports/{id}/resolve")
	public ReportResponse resolve(@PathVariable UUID id, @Valid @RequestBody ResolveReportRequest request) {
		return reportService.resolve(id, request.action(), request.notes());
	}

	@GetMapping("/rentals")
	public List<AdminRentalResponse> rentals() {
		return adminService.rentals();
	}

	@GetMapping("/rentals/{id}")
	public AdminRentalResponse rental(@PathVariable UUID id) {
		return adminService.rental(id);
	}

	@GetMapping("/staff")
	public List<AdminUserResponse> staff() {
		return adminService.staff();
	}

	@GetMapping("/staff/{id}")
	public AdminUserResponse staffMember(@PathVariable UUID id) {
		return adminService.staffMember(id);
	}

	@PostMapping("/staff")
	public AdminUserResponse createAdmin(@Valid @RequestBody CreateAdminRequest request) {
		return adminService.createAdmin(request);
	}

	@PutMapping("/staff/{id}")
	public AdminUserResponse updateAdmin(@PathVariable UUID id, @Valid @RequestBody UpdateAdminRequest request) {
		return adminService.updateAdmin(id, request);
	}

	@PostMapping("/staff/{id}/status")
	public AdminUserResponse staffStatus(@PathVariable UUID id, @Valid @RequestBody AdminStatusRequest request) {
		return adminService.setStaffStatus(id, request.status());
	}

	@DeleteMapping("/staff/{id}")
	public void deleteAdmin(@PathVariable UUID id) {
		adminService.deleteAdmin(id);
	}
}
