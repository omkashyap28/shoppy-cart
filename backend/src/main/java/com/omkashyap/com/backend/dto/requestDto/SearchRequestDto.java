package com.omkashyap.com.backend.dto.requestDto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SearchRequestDto {
    private String query;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Double rating;

    private Boolean inStock;

    private String userId;

    @Builder.Default
    private Integer limit = 20;

    private String cursor;

}
