package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ReflectorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReflectorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reflector.class);
        Reflector reflector1 = getReflectorSample1();
        Reflector reflector2 = new Reflector();
        assertThat(reflector1).isNotEqualTo(reflector2);

        reflector2.setId(reflector1.getId());
        assertThat(reflector1).isEqualTo(reflector2);

        reflector2 = getReflectorSample2();
        assertThat(reflector1).isNotEqualTo(reflector2);
    }
}
