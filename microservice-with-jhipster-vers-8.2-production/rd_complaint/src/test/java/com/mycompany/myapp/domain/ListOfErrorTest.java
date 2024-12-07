package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ListOfErrorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ListOfErrorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ListOfError.class);
        ListOfError listOfError1 = getListOfErrorSample1();
        ListOfError listOfError2 = new ListOfError();
        assertThat(listOfError1).isNotEqualTo(listOfError2);

        listOfError2.setId(listOfError1.getId());
        assertThat(listOfError1).isEqualTo(listOfError2);

        listOfError2 = getListOfErrorSample2();
        assertThat(listOfError1).isNotEqualTo(listOfError2);
    }
}
