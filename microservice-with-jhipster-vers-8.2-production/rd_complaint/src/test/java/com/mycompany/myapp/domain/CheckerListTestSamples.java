package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CheckerListTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static CheckerList getCheckerListSample1() {
        return new CheckerList().id(1L).name("name1").create_by("create_by1");
    }

    public static CheckerList getCheckerListSample2() {
        return new CheckerList().id(2L).name("name2").create_by("create_by2");
    }

    public static CheckerList getCheckerListRandomSampleGenerator() {
        return new CheckerList().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).create_by(UUID.randomUUID().toString());
    }
}
