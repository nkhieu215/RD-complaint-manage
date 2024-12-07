package com.mycompany.myapp.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.CheckerList} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CheckerListDTO implements Serializable {

    private Long id;

    private String name;

    private String create_by;

    private ZonedDateTime created_at;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreate_by() {
        return create_by;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }

    public ZonedDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(ZonedDateTime created_at) {
        this.created_at = created_at;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CheckerListDTO)) {
            return false;
        }

        CheckerListDTO checkerListDTO = (CheckerListDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, checkerListDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CheckerListDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", create_by='" + getCreate_by() + "'" +
            ", created_at='" + getCreated_at() + "'" +
            "}";
    }
}
