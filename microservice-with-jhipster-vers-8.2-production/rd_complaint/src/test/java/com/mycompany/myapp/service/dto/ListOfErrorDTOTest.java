package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ListOfErrorDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ListOfErrorDTO.class);
        ListOfErrorDTO listOfErrorDTO1 = new ListOfErrorDTO();
        listOfErrorDTO1.setId(1L);
        ListOfErrorDTO listOfErrorDTO2 = new ListOfErrorDTO();
        assertThat(listOfErrorDTO1).isNotEqualTo(listOfErrorDTO2);
        listOfErrorDTO2.setId(listOfErrorDTO1.getId());
        assertThat(listOfErrorDTO1).isEqualTo(listOfErrorDTO2);
        listOfErrorDTO2.setId(2L);
        assertThat(listOfErrorDTO1).isNotEqualTo(listOfErrorDTO2);
        listOfErrorDTO1.setId(null);
        assertThat(listOfErrorDTO1).isNotEqualTo(listOfErrorDTO2);
    }
}
