package com.RAP.backend.report;

import com.RAP.backend.user.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserReportRepository extends JpaRepository<UserReport, UUID> {

	List<UserReport> findByReporterOrderByCreatedAtDesc(User reporter);

	List<UserReport> findAllByOrderByCreatedAtDesc();

	long countByStatus(ReportStatus status);
}
