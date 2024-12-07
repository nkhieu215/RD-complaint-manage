package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ListOfErrorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ListOfError getListOfErrorSample1() {
        return new ListOfError()
            .id(1L)
            .error_code("error_code1")
            .error_name("error_name1")
            .quantity(1)
            .error_source("error_source1")
            .reason_id(1L)
            .method("method1")
            .check_by_id(1L)
            .create_by("create_by1")
            .image("image1")
            .complaint_id(1L);
    }

    public static ListOfError getListOfErrorSample2() {
        return new ListOfError()
            .id(2L)
            .error_code("error_code2")
            .error_name("error_name2")
            .quantity(2)
            .error_source("error_source2")
            .reason_id(2L)
            .method("method2")
            .check_by_id(2L)
            .create_by("create_by2")
            .image("image2")
            .complaint_id(2L);
    }

    public static ListOfError getListOfErrorRandomSampleGenerator() {
        return new ListOfError()
            .id(longCount.incrementAndGet())
            .error_code(UUID.randomUUID().toString())
            .error_name(UUID.randomUUID().toString())
            .quantity(intCount.incrementAndGet())
            .error_source(UUID.randomUUID().toString())
            .reason_id(longCount.incrementAndGet())
            .method(UUID.randomUUID().toString())
            .check_by_id(longCount.incrementAndGet())
            .create_by(UUID.randomUUID().toString())
            .image(UUID.randomUUID().toString())
            .complaint_id(longCount.incrementAndGet());
    }
}
