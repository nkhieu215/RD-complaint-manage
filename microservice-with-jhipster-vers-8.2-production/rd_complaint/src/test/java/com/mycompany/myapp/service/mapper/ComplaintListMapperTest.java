package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ComplaintListAsserts.*;
import static com.mycompany.myapp.domain.ComplaintListTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ComplaintListMapperTest {

    private ComplaintListMapper complaintListMapper;

    @BeforeEach
    void setUp() {
        complaintListMapper = new ComplaintListMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getComplaintListSample1();
        var actual = complaintListMapper.toEntity(complaintListMapper.toDto(expected));
        assertComplaintListAllPropertiesEquals(expected, actual);
    }
}
