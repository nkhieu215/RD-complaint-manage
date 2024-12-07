package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ComplaintStatusTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ComplaintStatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ComplaintStatus.class);
        ComplaintStatus complaintStatus1 = getComplaintStatusSample1();
        ComplaintStatus complaintStatus2 = new ComplaintStatus();
        assertThat(complaintStatus1).isNotEqualTo(complaintStatus2);

        complaintStatus2.setId(complaintStatus1.getId());
        assertThat(complaintStatus1).isEqualTo(complaintStatus2);

        complaintStatus2 = getComplaintStatusSample2();
        assertThat(complaintStatus1).isNotEqualTo(complaintStatus2);
    }
}
