package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReflectorDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReflectorDTO.class);
        ReflectorDTO reflectorDTO1 = new ReflectorDTO();
        reflectorDTO1.setId(1L);
        ReflectorDTO reflectorDTO2 = new ReflectorDTO();
        assertThat(reflectorDTO1).isNotEqualTo(reflectorDTO2);
        reflectorDTO2.setId(reflectorDTO1.getId());
        assertThat(reflectorDTO1).isEqualTo(reflectorDTO2);
        reflectorDTO2.setId(2L);
        assertThat(reflectorDTO1).isNotEqualTo(reflectorDTO2);
        reflectorDTO1.setId(null);
        assertThat(reflectorDTO1).isNotEqualTo(reflectorDTO2);
    }
}
