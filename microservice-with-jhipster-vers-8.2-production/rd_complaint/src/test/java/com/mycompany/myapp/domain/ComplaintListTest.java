package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ComplaintListTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ComplaintListTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ComplaintList.class);
        ComplaintList complaintList1 = getComplaintListSample1();
        ComplaintList complaintList2 = new ComplaintList();
        assertThat(complaintList1).isNotEqualTo(complaintList2);

        complaintList2.setId(complaintList1.getId());
        assertThat(complaintList1).isEqualTo(complaintList2);

        complaintList2 = getComplaintListSample2();
        assertThat(complaintList1).isNotEqualTo(complaintList2);
    }
}
