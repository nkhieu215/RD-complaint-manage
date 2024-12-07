package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ComplaintStatusTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ComplaintStatus getComplaintStatusSample1() {
        return new ComplaintStatus().id(1L).name("name1").create_by("create_by1");
    }

    public static ComplaintStatus getComplaintStatusSample2() {
        return new ComplaintStatus().id(2L).name("name2").create_by("create_by2");
    }

    public static ComplaintStatus getComplaintStatusRandomSampleGenerator() {
        return new ComplaintStatus()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .create_by(UUID.randomUUID().toString());
    }
}
