package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ComplaintListTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static ComplaintList getComplaintListSample1() {
        return new ComplaintList()
            .id(1L)
            .product_code("product_code1")
            .product_name("product_name1")
            .lot_number("lot_number1")
            .branch("branch1")
            .reflector_id(1L)
            .total_errors(1)
            .quantity(1)
            .dapartment_id(1L)
            .check_by_id(1L)
            .create_by("create_by1")
            .status("status1")
            .complaint_detail("complaint_detail1")
            .unit_of_use_id(1L)
            .implementation_result_id(1L)
            .comment("comment1")
            .follow_up_comment("follow_up_comment1")
            .complaint_id(1L)
            .serial("serial1")
            .mac_address("mac_address1");
    }

    public static ComplaintList getComplaintListSample2() {
        return new ComplaintList()
            .id(2L)
            .product_code("product_code2")
            .product_name("product_name2")
            .lot_number("lot_number2")
            .branch("branch2")
            .reflector_id(2L)
            .total_errors(2)
            .quantity(2)
            .dapartment_id(2L)
            .check_by_id(2L)
            .create_by("create_by2")
            .status("status2")
            .complaint_detail("complaint_detail2")
            .unit_of_use_id(2L)
            .implementation_result_id(2L)
            .comment("comment2")
            .follow_up_comment("follow_up_comment2")
            .complaint_id(2L)
            .serial("serial2")
            .mac_address("mac_address2");
    }

    public static ComplaintList getComplaintListRandomSampleGenerator() {
        return new ComplaintList()
            .id(longCount.incrementAndGet())
            .product_code(UUID.randomUUID().toString())
            .product_name(UUID.randomUUID().toString())
            .lot_number(UUID.randomUUID().toString())
            .branch(UUID.randomUUID().toString())
            .reflector_id(longCount.incrementAndGet())
            .total_errors(intCount.incrementAndGet())
            .quantity(intCount.incrementAndGet())
            .dapartment_id(longCount.incrementAndGet())
            .check_by_id(longCount.incrementAndGet())
            .create_by(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .complaint_detail(UUID.randomUUID().toString())
            .unit_of_use_id(longCount.incrementAndGet())
            .implementation_result_id(longCount.incrementAndGet())
            .comment(UUID.randomUUID().toString())
            .follow_up_comment(UUID.randomUUID().toString())
            .complaint_id(longCount.incrementAndGet())
            .serial(UUID.randomUUID().toString())
            .mac_address(UUID.randomUUID().toString());
    }
}
