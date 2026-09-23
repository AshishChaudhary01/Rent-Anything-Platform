package com.RAP.backend.media;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.RAP.backend.common.ApiException;
import com.RAP.backend.config.CloudinaryProperties;
import java.io.IOException;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

	private static final Logger log = LoggerFactory.getLogger(StorageService.class);

	private final Cloudinary cloudinary;
	private final CloudinaryProperties properties;

	public StorageService(Cloudinary cloudinary, CloudinaryProperties properties) {
		this.cloudinary = cloudinary;
		this.properties = properties;
	}

	public String uploadImage(MultipartFile file, String folder, String publicId) {
		return upload(file, folder, publicId, "image");
	}

	public String uploadVideo(MultipartFile file, String folder, String publicId) {
		return upload(file, folder, publicId, "video");
	}

	public String uploadAuto(MultipartFile file, String folder, String publicId) {
		return upload(file, folder, publicId, "auto");
	}

	private String upload(MultipartFile file, String folder, String publicId, String resourceType) {
		assertConfigured();
		try {
			Map<?, ?> result = cloudinary.uploader().upload(
					file.getBytes(),
					ObjectUtils.asMap(
							"folder", folder,
							"public_id", publicId,
							"overwrite", true,
							"invalidate", true,
							"unique_filename", false,
							"resource_type", resourceType
					)
			);
			Object url = result.get("secure_url");
			if (url == null) {
				throw new ApiException(HttpStatus.BAD_GATEWAY, "Cloudinary did not return a file URL");
			}
			return url.toString();
		} catch (ApiException ex) {
			throw ex;
		} catch (IOException | RuntimeException ex) {
			log.warn("Cloudinary upload failed: {}", ex.getMessage());
			throw new ApiException(
					HttpStatus.BAD_GATEWAY,
					"Could not upload the file to Cloudinary",
					cloudinaryHint(ex)
			);
		}
	}

	private void assertConfigured() {
		if (!properties.isConfigured()) {
			throw new ApiException(
					HttpStatus.SERVICE_UNAVAILABLE,
					"Cloudinary is not configured",
					"Add app.cloudinary.cloud-name, api-key, and api-secret to application-local.properties"
			);
		}
	}

	private static String cloudinaryHint(Exception ex) {
		String message = ex.getMessage();
		if (message == null || message.isBlank()) {
			return "Cloudinary rejected the upload. Check cloud name, API key, and API secret.";
		}
		return message;
	}
}
