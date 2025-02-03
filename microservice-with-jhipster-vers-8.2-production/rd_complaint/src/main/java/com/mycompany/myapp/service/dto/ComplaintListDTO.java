package com.mycompany.myapp.service.dto;

import jakarta.persistence.Column;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.ComplaintList} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ComplaintListDTO implements Serializable {

    private Long id;

    private String product_code;

    private String product_name;

    private String lot_number;

    private String branch;

    private Long reflector_id;

    private Integer total_errors;

    private Integer quantity;

    private ZonedDateTime production_time;

    private Long dapartment_id;

    private Long check_by_id;

    private ZonedDateTime rectification_time;

    private String create_by;

    private String status;

    private String complaint_detail;

    private String unit_of_use;

    private Long implementation_result_id;

    private String comment;

    private String follow_up_comment;

    private Long complaint_id;

    private ZonedDateTime created_at;

    private ZonedDateTime updated_at;

    private String serial;

    private String mac_address;
    private String report_code;
    private String driver_info;
    private String error_quantity;
    private String used_quantity;
    private String led_info;

    public String getDriver_info() {
        return driver_info;
    }

    public void setDriver_info(String driver_info) {
        this.driver_info = driver_info;
    }

    public String getError_quantity() {
        return error_quantity;
    }

    public void setError_quantity(String error_quantity) {
        this.error_quantity = error_quantity;
    }

    public String getUsed_quantity() {
        return used_quantity;
    }

    public void setUsed_quantity(String used_quantity) {
        this.used_quantity = used_quantity;
    }

    public String getLed_info() {
        return led_info;
    }

    public void setLed_info(String led_info) {
        this.led_info = led_info;
    }

    public String getReport_code() {
        return report_code;
    }

    public void setReport_code(String report_code) {
        this.report_code = report_code;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProduct_code() {
        return product_code;
    }

    public void setProduct_code(String product_code) {
        this.product_code = product_code;
    }

    public String getProduct_name() {
        return product_name;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getLot_number() {
        return lot_number;
    }

    public void setLot_number(String lot_number) {
        this.lot_number = lot_number;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Long getReflector_id() {
        return reflector_id;
    }

    public void setReflector_id(Long reflector_id) {
        this.reflector_id = reflector_id;
    }

    public Integer getTotal_errors() {
        return total_errors;
    }

    public void setTotal_errors(Integer total_errors) {
        this.total_errors = total_errors;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ZonedDateTime getProduction_time() {
        return production_time;
    }

    public void setProduction_time(ZonedDateTime production_time) {
        this.production_time = production_time;
    }

    public Long getDapartment_id() {
        return dapartment_id;
    }

    public void setDapartment_id(Long dapartment_id) {
        this.dapartment_id = dapartment_id;
    }

    public Long getCheck_by_id() {
        return check_by_id;
    }

    public void setCheck_by_id(Long check_by_id) {
        this.check_by_id = check_by_id;
    }

    public ZonedDateTime getRectification_time() {
        return rectification_time;
    }

    public void setRectification_time(ZonedDateTime rectification_time) {
        this.rectification_time = rectification_time;
    }

    public String getCreate_by() {
        return create_by;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComplaint_detail() {
        return complaint_detail;
    }

    public void setComplaint_detail(String complaint_detail) {
        this.complaint_detail = complaint_detail;
    }

    public String getUnit_of_use() {
        return unit_of_use;
    }

    public void setUnit_of_use(String unit_of_use) {
        this.unit_of_use = unit_of_use;
    }

    public Long getImplementation_result_id() {
        return implementation_result_id;
    }

    public void setImplementation_result_id(Long implementation_result_id) {
        this.implementation_result_id = implementation_result_id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getFollow_up_comment() {
        return follow_up_comment;
    }

    public void setFollow_up_comment(String follow_up_comment) {
        this.follow_up_comment = follow_up_comment;
    }

    public Long getComplaint_id() {
        return complaint_id;
    }

    public void setComplaint_id(Long complaint_id) {
        this.complaint_id = complaint_id;
    }

    public ZonedDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(ZonedDateTime created_at) {
        this.created_at = created_at;
    }

    public ZonedDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(ZonedDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getMac_address() {
        return mac_address;
    }

    public void setMac_address(String mac_address) {
        this.mac_address = mac_address;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ComplaintListDTO)) {
            return false;
        }

        ComplaintListDTO complaintListDTO = (ComplaintListDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, complaintListDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return "ComplaintListDTO{" +
            "id=" + id +
            ", product_code='" + product_code + '\'' +
            ", product_name='" + product_name + '\'' +
            ", lot_number='" + lot_number + '\'' +
            ", branch='" + branch + '\'' +
            ", reflector_id=" + reflector_id +
            ", total_errors=" + total_errors +
            ", quantity=" + quantity +
            ", production_time=" + production_time +
            ", dapartment_id=" + dapartment_id +
            ", check_by_id=" + check_by_id +
            ", rectification_time=" + rectification_time +
            ", create_by='" + create_by + '\'' +
            ", status='" + status + '\'' +
            ", complaint_detail='" + complaint_detail + '\'' +
            ", unit_of_use=" + unit_of_use +
            ", implementation_result_id=" + implementation_result_id +
            ", comment='" + comment + '\'' +
            ", follow_up_comment='" + follow_up_comment + '\'' +
            ", complaint_id=" + complaint_id +
            ", created_at=" + created_at +
            ", updated_at=" + updated_at +
            ", serial='" + serial + '\'' +
            ", mac_address='" + mac_address + '\'' +
            ", report_code='" + report_code + '\'' +
            '}';
    }
}
