package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ComplaintListDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ComplaintListDTO.class);
        ComplaintListDTO complaintListDTO1 = new ComplaintListDTO();
        complaintListDTO1.setId(1L);
        ComplaintListDTO complaintListDTO2 = new ComplaintListDTO();
        assertThat(complaintListDTO1).isNotEqualTo(complaintListDTO2);
        complaintListDTO2.setId(complaintListDTO1.getId());
        assertThat(complaintListDTO1).isEqualTo(complaintListDTO2);
        complaintListDTO2.setId(2L);
        assertThat(complaintListDTO1).isNotEqualTo(complaintListDTO2);
        complaintListDTO1.setId(null);
        assertThat(complaintListDTO1).isNotEqualTo(complaintListDTO2);
    }
}
