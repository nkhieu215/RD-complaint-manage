package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ImplementationResultAsserts.*;
import static com.mycompany.myapp.domain.ImplementationResultTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ImplementationResultMapperTest {

    private ImplementationResultMapper implementationResultMapper;

    @BeforeEach
    void setUp() {
        implementationResultMapper = new ImplementationResultMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getImplementationResultSample1();
        var actual = implementationResultMapper.toEntity(implementationResultMapper.toDto(expected));
        assertImplementationResultAllPropertiesEquals(expected, actual);
    }
}
