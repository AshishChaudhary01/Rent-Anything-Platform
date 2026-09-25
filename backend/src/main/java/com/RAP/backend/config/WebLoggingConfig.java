package com.RAP.backend.config;

import com.RAP.backend.common.RequestLoggingInterceptor;
import com.RAP.backend.common.SecureHttpCacheInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebLoggingConfig implements WebMvcConfigurer {

	private final RequestLoggingInterceptor requestLoggingInterceptor;
	private final SecureHttpCacheInterceptor secureHttpCacheInterceptor;

	public WebLoggingConfig(
			RequestLoggingInterceptor requestLoggingInterceptor,
			SecureHttpCacheInterceptor secureHttpCacheInterceptor
	) {
		this.requestLoggingInterceptor = requestLoggingInterceptor;
		this.secureHttpCacheInterceptor = secureHttpCacheInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(secureHttpCacheInterceptor).addPathPatterns("/**");
		registry.addInterceptor(requestLoggingInterceptor).addPathPatterns("/**");
	}
}
