package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ErrorList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ErrorListRepository extends JpaRepository<ErrorList,Integer> {
}
