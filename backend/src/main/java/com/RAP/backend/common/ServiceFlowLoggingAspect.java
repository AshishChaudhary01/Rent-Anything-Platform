package com.RAP.backend.common;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ServiceFlowLoggingAspect {

	private static final Logger log = LoggerFactory.getLogger(ServiceFlowLoggingAspect.class);

	@Around(
			"execution(public * com.RAP.backend..*Service.*(..))"
					+ " && !execution(* com.RAP.backend.notify.NotificationService.*(..))"
					+ " && !execution(* com.RAP.backend.mail.MailService.*(..))"
					+ " && !execution(* com.RAP.backend.media.StorageService.*(..))"
					+ " && !execution(* com.RAP.backend.rental.ReceiptService.*(..))"
	)
	public Object aroundService(ProceedingJoinPoint joinPoint) throws Throwable {
		String type = joinPoint.getSignature().getDeclaringType().getSimpleName();
		String method = joinPoint.getSignature().getName();
		long start = System.nanoTime();
		try {
			Object result = joinPoint.proceed();
			log.info("flow ok {}.{} {}ms", type, method, elapsedMs(start));
			return result;
		} catch (ApiException ex) {
			log.warn("flow reject {}.{} {}ms : {}", type, method, elapsedMs(start), ex.getMessage());
			throw ex;
		} catch (RuntimeException ex) {
			log.error("flow fail {}.{} {}ms : {}", type, method, elapsedMs(start), ex.getClass().getSimpleName());
			throw ex;
		}
	}

	private static long elapsedMs(long startNanos) {
		return (System.nanoTime() - startNanos) / 1_000_000;
	}
}
