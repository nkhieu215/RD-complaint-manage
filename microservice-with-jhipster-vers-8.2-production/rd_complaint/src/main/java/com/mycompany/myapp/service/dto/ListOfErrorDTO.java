package com.mycompany.myapp.service.dto;

import jakarta.persistence.Column;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.ListOfError} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListOfErrorDTO implements Serializable {

    private Long id;

    private String error_code;

    private String error_name;

    private Integer quantity;

    private String error_source;

    private Long reason_id;

    private String method;

    private Long check_by_id;

    private String create_by;

    private String image;

    private ZonedDateTime created_at;

    private ZonedDateTime updated_at;

    private ZonedDateTime check_time;

    private Long complaint_id;
    private String lot_number;
    private String serial;

    private String mac_address;

    public String getLot_number() {
        return lot_number;
    }

    public void setLot_number(String lot_number) {
        this.lot_number = lot_number;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getError_code() {
        return error_code;
    }

    public void setError_code(String error_code) {
        this.error_code = error_code;
    }

    public String getError_name() {
        return error_name;
    }

    public void setError_name(String error_name) {
        this.error_name = error_name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getError_source() {
        return error_source;
    }

    public void setError_source(String error_source) {
        this.error_source = error_source;
    }

    public Long getReason_id() {
        return reason_id;
    }

    public void setReason_id(Long reason_id) {
        this.reason_id = reason_id;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Long getCheck_by_id() {
        return check_by_id;
    }

    public void setCheck_by_id(Long check_by_id) {
        this.check_by_id = check_by_id;
    }

    public String getCreate_by() {
        return create_by;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
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

    public ZonedDateTime getCheck_time() {
        return check_time;
    }

    public void setCheck_time(ZonedDateTime check_time) {
        this.check_time = check_time;
    }

    public Long getComplaint_id() {
        return complaint_id;
    }

    public void setComplaint_id(Long complaint_id) {
        this.complaint_id = complaint_id;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListOfErrorDTO)) {
            return false;
        }

        ListOfErrorDTO listOfErrorDTO = (ListOfErrorDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, listOfErrorDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListOfErrorDTO{" +
            "id=" + getId() +
            ", error_code='" + getError_code() + "'" +
            ", error_name='" + getError_name() + "'" +
            ", quantity=" + getQuantity() +
            ", error_source='" + getError_source() + "'" +
            ", reason_id=" + getReason_id() +
            ", method='" + getMethod() + "'" +
            ", check_by_id=" + getCheck_by_id() +
            ", create_by='" + getCreate_by() + "'" +
            ", image='" + getImage() + "'" +
            ", created_at='" + getCreated_at() + "'" +
            ", updated_at='" + getUpdated_at() + "'" +
            ", check_time='" + getCheck_time() + "'" +
            ", complaint_id=" + getComplaint_id() +
            "}";
    }
}
