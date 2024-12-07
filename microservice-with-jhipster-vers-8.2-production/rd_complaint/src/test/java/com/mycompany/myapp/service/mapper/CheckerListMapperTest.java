package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.CheckerListAsserts.*;
import static com.mycompany.myapp.domain.CheckerListTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CheckerListMapperTest {

    private CheckerListMapper checkerListMapper;

    @BeforeEach
    void setUp() {
        checkerListMapper = new CheckerListMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCheckerListSample1();
        var actual = checkerListMapper.toEntity(checkerListMapper.toDto(expected));
        assertCheckerListAllPropertiesEquals(expected, actual);
    }
}
