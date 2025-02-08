package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A ListOfError.
 */
@Entity
@Table(name = "list_of_error")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListOfError implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "error_code")
    private String error_code;

    @Column(name = "error_name")
    private String error_name;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "error_source")
    private String error_source;

    @Column(name = "reason_id")
    private Long reason_id;

    @Column(name = "method")
    private String method;

    @Column(name = "check_by_id")
    private Long check_by_id;

    @Column(name = "create_by")
    private String create_by;

    @Column(name = "image")
    private String image;

    @Column(name = "created_at")
    private ZonedDateTime created_at;

    @Column(name = "updated_at")
    private ZonedDateTime updated_at;

    @Column(name = "check_time")
    private ZonedDateTime check_time;

    @Column(name = "complaint_id")
    private Long complaint_id;
    @Column(name = "lot_number")
    private String lot_number;
    @Column(name = "serial")
    private String serial;

    @Column(name = "mac_address")
    private String mac_address;
    @Column(name = "led_infor")
    private String led_infor;
    @Column(name = "driver_infor")
    private String driver_infor;
    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getLed_infor() {
        return led_infor;
    }

    public void setLed_infor(String led_infor) {
        this.led_infor = led_infor;
    }

    public String getDriver_infor() {
        return driver_infor;
    }

    public void setDriver_infor(String driver_infor) {
        this.driver_infor = driver_infor;
    }

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
        return this.id;
    }

    public ListOfError id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getError_code() {
        return this.error_code;
    }

    public ListOfError error_code(String error_code) {
        this.setError_code(error_code);
        return this;
    }

    public void setError_code(String error_code) {
        this.error_code = error_code;
    }

    public String getError_name() {
        return this.error_name;
    }

    public ListOfError error_name(String error_name) {
        this.setError_name(error_name);
        return this;
    }

    public void setError_name(String error_name) {
        this.error_name = error_name;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public ListOfError quantity(Integer quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getError_source() {
        return this.error_source;
    }

    public ListOfError error_source(String error_source) {
        this.setError_source(error_source);
        return this;
    }

    public void setError_source(String error_source) {
        this.error_source = error_source;
    }

    public Long getReason_id() {
        return this.reason_id;
    }

    public ListOfError reason_id(Long reason_id) {
        this.setReason_id(reason_id);
        return this;
    }

    public void setReason_id(Long reason_id) {
        this.reason_id = reason_id;
    }

    public String getMethod() {
        return this.method;
    }

    public ListOfError method(String method) {
        this.setMethod(method);
        return this;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Long getCheck_by_id() {
        return this.check_by_id;
    }

    public ListOfError check_by_id(Long check_by_id) {
        this.setCheck_by_id(check_by_id);
        return this;
    }

    public void setCheck_by_id(Long check_by_id) {
        this.check_by_id = check_by_id;
    }

    public String getCreate_by() {
        return this.create_by;
    }

    public ListOfError create_by(String create_by) {
        this.setCreate_by(create_by);
        return this;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    public String getImage() {
        return this.image;
    }

    public ListOfError image(String image) {
        this.setImage(image);
        return this;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public ZonedDateTime getCreated_at() {
        return this.created_at;
    }

    public ListOfError created_at(ZonedDateTime created_at) {
        this.setCreated_at(created_at);
        return this;
    }

    public void setCreated_at(ZonedDateTime created_at) {
        this.created_at = created_at;
    }

    public ZonedDateTime getUpdated_at() {
        return this.updated_at;
    }

    public ListOfError updated_at(ZonedDateTime updated_at) {
        this.setUpdated_at(updated_at);
        return this;
    }

    public void setUpdated_at(ZonedDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public ZonedDateTime getCheck_time() {
        return this.check_time;
    }

    public ListOfError check_time(ZonedDateTime check_time) {
        this.setCheck_time(check_time);
        return this;
    }

    public void setCheck_time(ZonedDateTime check_time) {
        this.check_time = check_time;
    }

    public Long getComplaint_id() {
        return this.complaint_id;
    }

    public ListOfError complaint_id(Long complaint_id) {
        this.setComplaint_id(complaint_id);
        return this;
    }

    public void setComplaint_id(Long complaint_id) {
        this.complaint_id = complaint_id;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListOfError)) {
            return false;
        }
        return getId() != null && getId().equals(((ListOfError) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListOfError{" +
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
