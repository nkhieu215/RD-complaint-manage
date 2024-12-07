package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CheckerList;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CheckerList entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CheckerListRepository extends JpaRepository<CheckerList, Long> {}
