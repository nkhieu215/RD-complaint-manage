package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UnitOfUseDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(UnitOfUseDTO.class);
        UnitOfUseDTO unitOfUseDTO1 = new UnitOfUseDTO();
        unitOfUseDTO1.setId(1L);
        UnitOfUseDTO unitOfUseDTO2 = new UnitOfUseDTO();
        assertThat(unitOfUseDTO1).isNotEqualTo(unitOfUseDTO2);
        unitOfUseDTO2.setId(unitOfUseDTO1.getId());
        assertThat(unitOfUseDTO1).isEqualTo(unitOfUseDTO2);
        unitOfUseDTO2.setId(2L);
        assertThat(unitOfUseDTO1).isNotEqualTo(unitOfUseDTO2);
        unitOfUseDTO1.setId(null);
        assertThat(unitOfUseDTO1).isNotEqualTo(unitOfUseDTO2);
    }
}
