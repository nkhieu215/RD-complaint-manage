package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ComplaintStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ComplaintStatus entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ComplaintStatusRepository extends JpaRepository<ComplaintStatus, Long> {}
