package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CheckerListTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CheckerListTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CheckerList.class);
        CheckerList checkerList1 = getCheckerListSample1();
        CheckerList checkerList2 = new CheckerList();
        assertThat(checkerList1).isNotEqualTo(checkerList2);

        checkerList2.setId(checkerList1.getId());
        assertThat(checkerList1).isEqualTo(checkerList2);

        checkerList2 = getCheckerListSample2();
        assertThat(checkerList1).isNotEqualTo(checkerList2);
    }
}
