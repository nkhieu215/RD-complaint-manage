package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ComplaintStatusDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ComplaintStatusDTO.class);
        ComplaintStatusDTO complaintStatusDTO1 = new ComplaintStatusDTO();
        complaintStatusDTO1.setId(1L);
        ComplaintStatusDTO complaintStatusDTO2 = new ComplaintStatusDTO();
        assertThat(complaintStatusDTO1).isNotEqualTo(complaintStatusDTO2);
        complaintStatusDTO2.setId(complaintStatusDTO1.getId());
        assertThat(complaintStatusDTO1).isEqualTo(complaintStatusDTO2);
        complaintStatusDTO2.setId(2L);
        assertThat(complaintStatusDTO1).isNotEqualTo(complaintStatusDTO2);
        complaintStatusDTO1.setId(null);
        assertThat(complaintStatusDTO1).isNotEqualTo(complaintStatusDTO2);
    }
}
