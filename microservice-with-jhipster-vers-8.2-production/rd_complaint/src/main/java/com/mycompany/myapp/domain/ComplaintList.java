package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A ComplaintList.
 */
@Entity
@Table(name = "complaint_list")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ComplaintList implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "product_code")
    private String product_code;

    @Column(name = "product_name")
    private String product_name;

    @Column(name = "lot_number")
    private String lot_number;

    @Column(name = "branch")
    private String branch;

    @Column(name = "reflector_id")
    private Long reflector_id;

    @Column(name = "total_errors")
    private Integer total_errors;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "production_time")
    private ZonedDateTime production_time;

    @Column(name = "dapartment_id")
    private Long dapartment_id;

    @Column(name = "check_by_id")
    private Long check_by_id;

    @Column(name = "rectification_time")
    private ZonedDateTime rectification_time;

    @Column(name = "create_by")
    private String create_by;

    @Column(name = "status")
    private String status;

    @Column(name = "complaint_detail")
    private String complaint_detail;

    @Column(name = "unit_of_use")
    private String unit_of_use;

    @Column(name = "implementation_result_id")
    private Long implementation_result_id;

    @Column(name = "comment")
    private String comment;

    @Column(name = "follow_up_comment")
    private String follow_up_comment;

    @Column(name = "complaint_id")
    private Long complaint_id;

    @Column(name = "created_at")
    private ZonedDateTime created_at;

    @Column(name = "updated_at")
    private ZonedDateTime updated_at;

    @Column(name = "serial")
    private String serial;

    @Column(name = "mac_address")
    private String mac_address;
    @Column(name = "report_code")
    private String report_code;
    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ComplaintList id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProduct_code() {
        return this.product_code;
    }

    public ComplaintList product_code(String product_code) {
        this.setProduct_code(product_code);
        return this;
    }

    public void setProduct_code(String product_code) {
        this.product_code = product_code;
    }

    public String getProduct_name() {
        return this.product_name;
    }

    public ComplaintList product_name(String product_name) {
        this.setProduct_name(product_name);
        return this;
    }

    public void setProduct_name(String product_name) {
        this.product_name = product_name;
    }

    public String getLot_number() {
        return this.lot_number;
    }

    public ComplaintList lot_number(String lot_number) {
        this.setLot_number(lot_number);
        return this;
    }

    public void setLot_number(String lot_number) {
        this.lot_number = lot_number;
    }

    public String getBranch() {
        return this.branch;
    }

    public ComplaintList branch(String branch) {
        this.setBranch(branch);
        return this;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Long getReflector_id() {
        return this.reflector_id;
    }

    public ComplaintList reflector_id(Long reflector_id) {
        this.setReflector_id(reflector_id);
        return this;
    }

    public void setReflector_id(Long reflector_id) {
        this.reflector_id = reflector_id;
    }

    public Integer getTotal_errors() {
        return this.total_errors;
    }

    public ComplaintList total_errors(Integer total_errors) {
        this.setTotal_errors(total_errors);
        return this;
    }

    public void setTotal_errors(Integer total_errors) {
        this.total_errors = total_errors;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public ComplaintList quantity(Integer quantity) {
        this.setQuantity(quantity);
        return this;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public ZonedDateTime getProduction_time() {
        return this.production_time;
    }

    public ComplaintList production_time(ZonedDateTime production_time) {
        this.setProduction_time(production_time);
        return this;
    }

    public void setProduction_time(ZonedDateTime production_time) {
        this.production_time = production_time;
    }

    public Long getDapartment_id() {
        return this.dapartment_id;
    }

    public ComplaintList dapartment_id(Long dapartment_id) {
        this.setDapartment_id(dapartment_id);
        return this;
    }

    public void setDapartment_id(Long dapartment_id) {
        this.dapartment_id = dapartment_id;
    }

    public Long getCheck_by_id() {
        return this.check_by_id;
    }

    public ComplaintList check_by_id(Long check_by_id) {
        this.setCheck_by_id(check_by_id);
        return this;
    }

    public void setCheck_by_id(Long check_by_id) {
        this.check_by_id = check_by_id;
    }

    public ZonedDateTime getRectification_time() {
        return this.rectification_time;
    }

    public ComplaintList rectification_time(ZonedDateTime rectification_time) {
        this.setRectification_time(rectification_time);
        return this;
    }

    public void setRectification_time(ZonedDateTime rectification_time) {
        this.rectification_time = rectification_time;
    }

    public String getCreate_by() {
        return this.create_by;
    }

    public ComplaintList create_by(String create_by) {
        this.setCreate_by(create_by);
        return this;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    public String getStatus() {
        return this.status;
    }

    public ComplaintList status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComplaint_detail() {
        return this.complaint_detail;
    }

    public ComplaintList complaint_detail(String complaint_detail) {
        this.setComplaint_detail(complaint_detail);
        return this;
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

    public ComplaintList unit_of_use(String unit_of_use) {
        this.setUnit_of_use(unit_of_use);
        return this;
    }

    public Long getImplementation_result_id() {
        return this.implementation_result_id;
    }

    public ComplaintList implementation_result_id(Long implementation_result_id) {
        this.setImplementation_result_id(implementation_result_id);
        return this;
    }

    public void setImplementation_result_id(Long implementation_result_id) {
        this.implementation_result_id = implementation_result_id;
    }

    public String getComment() {
        return this.comment;
    }

    public ComplaintList comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getFollow_up_comment() {
        return this.follow_up_comment;
    }

    public ComplaintList follow_up_comment(String follow_up_comment) {
        this.setFollow_up_comment(follow_up_comment);
        return this;
    }

    public void setFollow_up_comment(String follow_up_comment) {
        this.follow_up_comment = follow_up_comment;
    }

    public Long getComplaint_id() {
        return this.complaint_id;
    }

    public ComplaintList complaint_id(Long complaint_id) {
        this.setComplaint_id(complaint_id);
        return this;
    }

    public void setComplaint_id(Long complaint_id) {
        this.complaint_id = complaint_id;
    }

    public ZonedDateTime getCreated_at() {
        return this.created_at;
    }

    public ComplaintList created_at(ZonedDateTime created_at) {
        this.setCreated_at(created_at);
        return this;
    }

    public void setCreated_at(ZonedDateTime created_at) {
        this.created_at = created_at;
    }

    public ZonedDateTime getUpdated_at() {
        return this.updated_at;
    }

    public ComplaintList updated_at(ZonedDateTime updated_at) {
        this.setUpdated_at(updated_at);
        return this;
    }

    public void setUpdated_at(ZonedDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public String getSerial() {
        return this.serial;
    }

    public ComplaintList serial(String serial) {
        this.setSerial(serial);
        return this;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getMac_address() {
        return this.mac_address;
    }

    public ComplaintList mac_address(String mac_address) {
        this.setMac_address(mac_address);
        return this;
    }

    public void setMac_address(String mac_address) {
        this.mac_address = mac_address;
    }

    public String getReport_code() {
        return report_code;
    }

    public void setReport_code(String report_code) {
        this.report_code = report_code;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ComplaintList)) {
            return false;
        }
        return getId() != null && getId().equals(((ComplaintList) o).getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ComplaintList{" +
                "id=" + getId() +
                ", product_code='" + getProduct_code() + "'" +
                ", product_name='" + getProduct_name() + "'" +
                ", lot_number='" + getLot_number() + "'" +
                ", branch='" + getBranch() + "'" +
                ", reflector_id=" + getReflector_id() +
                ", total_errors=" + getTotal_errors() +
                ", quantity=" + getQuantity() +
                ", production_time='" + getProduction_time() + "'" +
                ", dapartment_id=" + getDapartment_id() +
                ", check_by_id=" + getCheck_by_id() +
                ", rectification_time='" + getRectification_time() + "'" +
                ", create_by='" + getCreate_by() + "'" +
                ", status='" + getStatus() + "'" +
                ", complaint_detail='" + getComplaint_detail() + "'" +
                ", unit_of_use=" + getUnit_of_use() +
                ", implementation_result_id=" + getImplementation_result_id() +
                ", comment='" + getComment() + "'" +
                ", follow_up_comment='" + getFollow_up_comment() + "'" +
                ", complaint_id=" + getComplaint_id() +
                ", created_at='" + getCreated_at() + "'" +
                ", updated_at='" + getUpdated_at() + "'" +
                ", serial='" + getSerial() + "'" +
                ", mac_address='" + getMac_address() + "'" +
                "}";
    }
}
