package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Reflector;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Reflector entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ReflectorRepository extends JpaRepository<Reflector, Long> {}
