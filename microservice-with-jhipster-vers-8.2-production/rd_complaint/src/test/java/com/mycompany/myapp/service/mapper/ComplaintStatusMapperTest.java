package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.ComplaintStatusAsserts.*;
import static com.mycompany.myapp.domain.ComplaintStatusTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ComplaintStatusMapperTest {

    private ComplaintStatusMapper complaintStatusMapper;

    @BeforeEach
    void setUp() {
        complaintStatusMapper = new ComplaintStatusMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getComplaintStatusSample1();
        var actual = complaintStatusMapper.toEntity(complaintStatusMapper.toDto(expected));
        assertComplaintStatusAllPropertiesEquals(expected, actual);
    }
}
