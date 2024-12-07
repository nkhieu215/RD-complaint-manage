package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ListOfErrorAsserts.*;
import static com.mycompany.myapp.domain.ListOfErrorTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ListOfErrorMapperTest {

    private ListOfErrorMapper listOfErrorMapper;

    @BeforeEach
    void setUp() {
        listOfErrorMapper = new ListOfErrorMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getListOfErrorSample1();
        var actual = listOfErrorMapper.toEntity(listOfErrorMapper.toDto(expected));
        assertListOfErrorAllPropertiesEquals(expected, actual);
    }
}
