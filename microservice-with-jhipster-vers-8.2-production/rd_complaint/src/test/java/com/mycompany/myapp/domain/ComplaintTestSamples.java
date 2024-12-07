package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ComplaintTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Complaint getComplaintSample1() {
        return new Complaint().id(1L).name("name1").create_by("create_by1").status("status1");
    }

    public static Complaint getComplaintSample2() {
        return new Complaint().id(2L).name("name2").create_by("create_by2").status("status2");
    }

    public static Complaint getComplaintRandomSampleGenerator() {
        return new Complaint()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .create_by(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString());
    }
}
