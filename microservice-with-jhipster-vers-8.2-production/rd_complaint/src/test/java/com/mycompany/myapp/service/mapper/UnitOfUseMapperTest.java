package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.UnitOfUseAsserts.*;
import static com.mycompany.myapp.domain.UnitOfUseTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UnitOfUseMapperTest {

    private UnitOfUseMapper unitOfUseMapper;

    @BeforeEach
    void setUp() {
        unitOfUseMapper = new UnitOfUseMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getUnitOfUseSample1();
        var actual = unitOfUseMapper.toEntity(unitOfUseMapper.toDto(expected));
        assertUnitOfUseAllPropertiesEquals(expected, actual);
    }
}
