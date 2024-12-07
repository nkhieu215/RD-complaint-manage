package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ReflectorAsserts.*;
import static com.mycompany.myapp.domain.ReflectorTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ReflectorMapperTest {

    private ReflectorMapper reflectorMapper;

    @BeforeEach
    void setUp() {
        reflectorMapper = new ReflectorMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getReflectorSample1();
        var actual = reflectorMapper.toEntity(reflectorMapper.toDto(expected));
        assertReflectorAllPropertiesEquals(expected, actual);
    }
}
