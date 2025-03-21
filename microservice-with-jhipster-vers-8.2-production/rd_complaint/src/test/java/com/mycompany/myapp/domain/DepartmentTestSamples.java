package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DepartmentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Department getDepartmentSample1() {
        return new Department().id(1L).name("name1").create_by("create_by1").status("status1");
    }

    public static Department getDepartmentSample2() {
        return new Department().id(2L).name("name2").create_by("create_by2").status("status2");
    }

    public static Department getDepartmentRandomSampleGenerator() {
        return new Department()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .create_by(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString());
    }
}
