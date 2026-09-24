package com.RAP.backend.rental.dto;

import jakarta.validation.constraints.NotBlank;

public record StartRentalRequest(@NotBlank String code) {
}
