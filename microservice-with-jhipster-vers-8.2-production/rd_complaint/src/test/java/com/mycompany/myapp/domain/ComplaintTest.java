package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ComplaintTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ComplaintTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Complaint.class);
        Complaint complaint1 = getComplaintSample1();
        Complaint complaint2 = new Complaint();
        assertThat(complaint1).isNotEqualTo(complaint2);

        complaint2.setId(complaint1.getId());
        assertThat(complaint1).isEqualTo(complaint2);

        complaint2 = getComplaintSample2();
        assertThat(complaint1).isNotEqualTo(complaint2);
    }
}
