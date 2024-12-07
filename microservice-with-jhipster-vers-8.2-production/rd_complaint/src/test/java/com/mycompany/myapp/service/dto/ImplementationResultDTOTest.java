package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ImplementationResultDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ImplementationResultDTO.class);
        ImplementationResultDTO implementationResultDTO1 = new ImplementationResultDTO();
        implementationResultDTO1.setId(1L);
        ImplementationResultDTO implementationResultDTO2 = new ImplementationResultDTO();
        assertThat(implementationResultDTO1).isNotEqualTo(implementationResultDTO2);
        implementationResultDTO2.setId(implementationResultDTO1.getId());
        assertThat(implementationResultDTO1).isEqualTo(implementationResultDTO2);
        implementationResultDTO2.setId(2L);
        assertThat(implementationResultDTO1).isNotEqualTo(implementationResultDTO2);
        implementationResultDTO1.setId(null);
        assertThat(implementationResultDTO1).isNotEqualTo(implementationResultDTO2);
    }
}
