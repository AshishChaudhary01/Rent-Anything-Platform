package com.RAP.backend.auth.dto;

public record GoogleAuthRequest(String accessToken, String idToken) {
}
