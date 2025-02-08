package com.mycompany.myapp.domain;

import java.time.ZonedDateTime;
import java.util.Date;

public interface ComplaintListResponse {
    Long getId();

    String getProduct_code();

    String getProduct_name();

    String getLot_number();

    String getBranch();

    String getReflector();

    Integer getTotal_errors();

    Integer getQuantity();

    // Date getProduction_time();

    String getDepartment();

    String getChecker();

    Date getRectification_time();

    String getCreate_by();

    String getStatus();

    String getComplaint_detail();

    String getUnit_of_use();

    String getImplementation_result();

    String getComment();

    String getFollow_up_comment();

    String getComplaint();

    Date getCreated_at();

    Date getUpdated_at();

    String getSerial();

    String getMac_address();


    String getError_quantity();

    String getUsed_quantity();

}
