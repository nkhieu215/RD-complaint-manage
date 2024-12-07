package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.UnitOfUse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UnitOfUse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UnitOfUseRepository extends JpaRepository<UnitOfUse, Long> {}
