package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Complaint;
import com.mycompany.myapp.service.dto.ComplaintDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Complaint} and its DTO {@link ComplaintDTO}.
 */
@Mapper(componentModel = "spring")
public interface ComplaintMapper extends EntityMapper<ComplaintDTO, Complaint> {}
