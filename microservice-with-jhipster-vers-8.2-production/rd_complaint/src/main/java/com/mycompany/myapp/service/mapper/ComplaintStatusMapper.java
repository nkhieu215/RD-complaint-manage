package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.ComplaintStatus;
import com.mycompany.myapp.service.dto.ComplaintStatusDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ComplaintStatus} and its DTO {@link ComplaintStatusDTO}.
 */
@Mapper(componentModel = "spring")
public interface ComplaintStatusMapper extends EntityMapper<ComplaintStatusDTO, ComplaintStatus> {}
