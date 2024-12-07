package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReasonTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Reason getReasonSample1() {
        return new Reason().id(1L).name("name1").create_by("create_by1").status("status1");
    }

    public static Reason getReasonSample2() {
        return new Reason().id(2L).name("name2").create_by("create_by2").status("status2");
    }

    public static Reason getReasonRandomSampleGenerator() {
        return new Reason()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .create_by(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString());
    }
}
