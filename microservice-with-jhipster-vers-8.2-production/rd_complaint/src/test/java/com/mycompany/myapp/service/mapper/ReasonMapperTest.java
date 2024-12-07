package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ReasonAsserts.*;
import static com.mycompany.myapp.domain.ReasonTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ReasonMapperTest {

    private ReasonMapper reasonMapper;

    @BeforeEach
    void setUp() {
        reasonMapper = new ReasonMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getReasonSample1();
        var actual = reasonMapper.toEntity(reasonMapper.toDto(expected));
        assertReasonAllPropertiesEquals(expected, actual);
    }
}
