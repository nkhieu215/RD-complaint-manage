package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ImplementationResult;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ImplementationResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImplementationResultRepository extends JpaRepository<ImplementationResult, Long> {}
