package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.UnitOfUseTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UnitOfUseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UnitOfUse.class);
        UnitOfUse unitOfUse1 = getUnitOfUseSample1();
        UnitOfUse unitOfUse2 = new UnitOfUse();
        assertThat(unitOfUse1).isNotEqualTo(unitOfUse2);

        unitOfUse2.setId(unitOfUse1.getId());
        assertThat(unitOfUse1).isEqualTo(unitOfUse2);

        unitOfUse2 = getUnitOfUseSample2();
        assertThat(unitOfUse1).isNotEqualTo(unitOfUse2);
    }
}
