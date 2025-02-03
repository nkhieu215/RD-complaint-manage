package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ComplaintList;
import com.mycompany.myapp.domain.ComplaintListResponse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the ComplaintList entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ComplaintListRepository extends JpaRepository<ComplaintList, Long> {
    @Query(value = "SELECT\n" +
        " compl.id as id,\n" +
        " compl.product_code as product_code,\n" +
        " compl.product_name as product_name,\n" +
        " compl.lot_number as lot_number,\n" +
        " compl.branch as branch,\n" +
        " ref.name as reflector,\n" +
        " compl.total_errors as total_errors,\n" +
        " compl.quantity as quantity,\n" +
        " compl.production_time as production_time,\n" +
        " dep.name as department,\n" +
        " ckr.name as checker,\n" +
        " compl.rectification_time as rectification_time,\n" +
        " compl.create_by as create_by,\n" +
        " compl.status as status,\n" +
        " compl.complaint_detail as complaint_detail,\n" +
        " compl.unit_of_use as unit_of_use,\n" +
        " impl.name as implementation_result,\n" +
        " compl.comment as comment,\n" +
        " compl.follow_up_comment as follow_up_comment,\n" +
        " comp.name as complaint,\n" +
        " compl.created_at as created_at,\n" +
        " compl.updated_at as updated_at,\n" +
        " compl.serial as serial,\n" +
        " compl.driver_info as driver_info,\n" +
        " compl.error_quantity as error_quantity,\n" +
        " compl.used_quantity as used_quantity,\n" +
        " compl.led_info as led_info,\n" +
        " compl.mac_address as mac_address,\n" +
        " compl.report_code as report_code\n" +
        " FROM `complaint_list` as compl\n" +
        "left join rdcomplaint.reflector as ref on compl.reflector_id = ref.id\n" +
        "left join rdcomplaint.department as dep on dep.id = compl.dapartment_id\n" +
        "left join rdcomplaint.checker_list as ckr on ckr.id = compl.check_by_id\n" +
        "left join rdcomplaint.implementation_result as impl on impl.id = compl.implementation_result_id\n" +
        "left join rdcomplaint.complaint as comp on comp.id = compl.complaint_id \n" +
        "union \n" +
        "SELECT\n" +
        " compl.id as id,\n" +
        " compl.product_code as product_code,\n" +
        " compl.product_name as product_name,\n" +
        " compl.lot_number as lot_number,\n" +
        " compl.branch as branch,\n" +
        " ref.name as reflector,\n" +
        " compl.total_errors as total_errors,\n" +
        " compl.quantity as quantity,\n" +
        " compl.production_time as production_time,\n" +
        " dep.name as department,\n" +
        " ckr.name as checker,\n" +
        " compl.rectification_time as rectification_time,\n" +
        " compl.create_by as create_by,\n" +
        " compl.status as status,\n" +
        " compl.complaint_detail as complaint_detail,\n" +
        " compl.unit_of_use as unit_of_use,\n" +
        " impl.name as implementation_result,\n" +
        " compl.comment as comment,\n" +
        " compl.follow_up_comment as follow_up_comment,\n" +
        " comp.name as complaint,\n" +
        " compl.created_at as created_at,\n" +
        " compl.updated_at as updated_at,\n" +
        " compl.serial as serial,\n" +
        " compl.driver_info as driver_info,\n" +
        " compl.error_quantity as error_quantity,\n" +
        " compl.used_quantity as used_quantity,\n" +
        " compl.led_info as led_info,\n" +
        " compl.mac_address as mac_address,\n" +
        " compl.report_code as report_code\n" +
        " FROM `complaint_list` as compl\n" +
        "right join rdcomplaint.reflector as ref on compl.reflector_id = ref.id\n" +
        "right join rdcomplaint.department as dep on dep.id = compl.dapartment_id\n" +
        "right join rdcomplaint.checker_list as ckr on ckr.id = compl.check_by_id\n" +
        "right join rdcomplaint.implementation_result as impl on impl.id = compl.implementation_result_id\n" +
        "right join rdcomplaint.complaint as comp on comp.id = compl.complaint_id ;",nativeQuery = true)
    public List<ComplaintListResponse> getAll();
}
