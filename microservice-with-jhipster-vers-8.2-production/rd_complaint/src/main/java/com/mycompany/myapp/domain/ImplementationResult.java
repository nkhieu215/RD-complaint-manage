package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A ImplementationResult.
 */
@Entity
@Table(name = "implementation_result")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ImplementationResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "create_by")
    private String create_by;

    @Column(name = "created_at")
    private ZonedDateTime created_at;

    @Column(name = "status")
    private String status;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ImplementationResult id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ImplementationResult name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreate_by() {
        return this.create_by;
    }

    public ImplementationResult create_by(String create_by) {
        this.setCreate_by(create_by);
        return this;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    public ZonedDateTime getCreated_at() {
        return this.created_at;
    }

    public ImplementationResult created_at(ZonedDateTime created_at) {
        this.setCreated_at(created_at);
        return this;
    }

    public void setCreated_at(ZonedDateTime created_at) {
        this.created_at = created_at;
    }

    public String getStatus() {
        return this.status;
    }

    public ImplementationResult status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ImplementationResult)) {
            return false;
        }
        return getId() != null && getId().equals(((ImplementationResult) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ImplementationResult{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", create_by='" + getCreate_by() + "'" +
            ", created_at='" + getCreated_at() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
