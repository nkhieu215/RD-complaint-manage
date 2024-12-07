package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CheckerListDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CheckerListDTO.class);
        CheckerListDTO checkerListDTO1 = new CheckerListDTO();
        checkerListDTO1.setId(1L);
        CheckerListDTO checkerListDTO2 = new CheckerListDTO();
        assertThat(checkerListDTO1).isNotEqualTo(checkerListDTO2);
        checkerListDTO2.setId(checkerListDTO1.getId());
        assertThat(checkerListDTO1).isEqualTo(checkerListDTO2);
        checkerListDTO2.setId(2L);
        assertThat(checkerListDTO1).isNotEqualTo(checkerListDTO2);
        checkerListDTO1.setId(null);
        assertThat(checkerListDTO1).isNotEqualTo(checkerListDTO2);
    }
}
