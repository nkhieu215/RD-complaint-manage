package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ListOfError;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the ListOfError entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ListOfErrorRepository extends JpaRepository<ListOfError, Long> {
    @Query(value = "select * from `list_of_error` where complaint_id = ?1 ;",nativeQuery = true)
    public List<ListOfError> getByComplaintId(Long id);
}
