package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ReasonTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReasonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reason.class);
        Reason reason1 = getReasonSample1();
        Reason reason2 = new Reason();
        assertThat(reason1).isNotEqualTo(reason2);

        reason2.setId(reason1.getId());
        assertThat(reason1).isEqualTo(reason2);

        reason2 = getReasonSample2();
        assertThat(reason1).isNotEqualTo(reason2);
    }
}
