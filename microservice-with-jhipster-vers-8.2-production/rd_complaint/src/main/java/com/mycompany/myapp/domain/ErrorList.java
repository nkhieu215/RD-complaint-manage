package com.mycompany.myapp.domain;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "error_list")
public class ErrorList implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "attribute_key")
    private String attributeKey;
    @Column(name = "err_name")
    private String errName;

    public ErrorList(Integer id, String attributeKey, String errName) {
        this.id = id;
        this.attributeKey = attributeKey;
        this.errName = errName;
    }

    public ErrorList() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAttributeKey() {
        return attributeKey;
    }

    public void setAttributeKey(String attributeKey) {
        this.attributeKey = attributeKey;
    }

    public String getErrName() {
        return errName;
    }

    public void setErrName(String errName) {
        this.errName = errName;
    }
}
