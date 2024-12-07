package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ImplementationResultTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ImplementationResult getImplementationResultSample1() {
        return new ImplementationResult().id(1L).name("name1").create_by("create_by1").status("status1");
    }

    public static ImplementationResult getImplementationResultSample2() {
        return new ImplementationResult().id(2L).name("name2").create_by("create_by2").status("status2");
    }

    public static ImplementationResult getImplementationResultRandomSampleGenerator() {
        return new ImplementationResult()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .create_by(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString());
    }
}
