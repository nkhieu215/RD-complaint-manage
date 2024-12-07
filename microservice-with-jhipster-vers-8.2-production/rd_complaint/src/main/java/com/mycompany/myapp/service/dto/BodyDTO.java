package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.*;

import java.util.List;

public class BodyDTO {
    private List<CheckerList> checkerLists;
    private List<Complaint>complaintList;
    private List<ComplaintListResponse> complaintListResponseList;
    private List<ComplaintStatus>complaintStatusList;
    private List<Department> departmentList;
    private List<ImplementationResult> implementationResultList;
    private List<ListOfError> listOfErrorList;
    private List<Reason>reasonList;
    private List<Reflector>reflectorList;
    private List<UnitOfUse>unitOfUseList;
    private ComplaintList complaintListDTOById;

    public BodyDTO() {
    }

    public ComplaintList getComplaintListDTOById() {
        return complaintListDTOById;
    }

    public void setComplaintListDTOById(ComplaintList complaintListDTOById) {
        this.complaintListDTOById = complaintListDTOById;
    }

    public List<CheckerList> getCheckerLists() {
        return checkerLists;
    }

    public void setCheckerLists(List<CheckerList> checkerLists) {
        this.checkerLists = checkerLists;
    }

    public List<Complaint> getComplaintList() {
        return complaintList;
    }

    public void setComplaintList(List<Complaint> complaintList) {
        this.complaintList = complaintList;
    }

    public List<ComplaintListResponse> getComplaintListResponseList() {
        return complaintListResponseList;
    }

    public void setComplaintListResponseList(List<ComplaintListResponse> complaintListResponseList) {
        this.complaintListResponseList = complaintListResponseList;
    }

    public List<ComplaintStatus> getComplaintStatusList() {
        return complaintStatusList;
    }

    public void setComplaintStatusList(List<ComplaintStatus> complaintStatusList) {
        this.complaintStatusList = complaintStatusList;
    }

    public List<Department> getDepartmentList() {
        return departmentList;
    }

    public void setDepartmentList(List<Department> departmentList) {
        this.departmentList = departmentList;
    }

    public List<ImplementationResult> getImplementationResultList() {
        return implementationResultList;
    }

    public void setImplementationResultList(List<ImplementationResult> implementationResultList) {
        this.implementationResultList = implementationResultList;
    }

    public List<ListOfError> getListOfErrorList() {
        return listOfErrorList;
    }

    public void setListOfErrorList(List<ListOfError> listOfErrorList) {
        this.listOfErrorList = listOfErrorList;
    }

    public List<Reason> getReasonList() {
        return reasonList;
    }

    public void setReasonList(List<Reason> reasonList) {
        this.reasonList = reasonList;
    }

    public List<Reflector> getReflectorList() {
        return reflectorList;
    }

    public void setReflectorList(List<Reflector> reflectorList) {
        this.reflectorList = reflectorList;
    }

    public List<UnitOfUse> getUnitOfUseList() {
        return unitOfUseList;
    }

    public void setUnitOfUseList(List<UnitOfUse> unitOfUseList) {
        this.unitOfUseList = unitOfUseList;
    }
}
