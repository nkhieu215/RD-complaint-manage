package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ImplementationResultTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ImplementationResultTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ImplementationResult.class);
        ImplementationResult implementationResult1 = getImplementationResultSample1();
        ImplementationResult implementationResult2 = new ImplementationResult();
        assertThat(implementationResult1).isNotEqualTo(implementationResult2);

        implementationResult2.setId(implementationResult1.getId());
        assertThat(implementationResult1).isEqualTo(implementationResult2);

        implementationResult2 = getImplementationResultSample2();
        assertThat(implementationResult1).isNotEqualTo(implementationResult2);
    }
}
