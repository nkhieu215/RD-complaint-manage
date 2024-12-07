package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.ComplaintList;
import com.mycompany.myapp.service.dto.ComplaintListDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ComplaintList} and its DTO {@link ComplaintListDTO}.
 */
@Mapper(componentModel = "spring")
public interface ComplaintListMapper extends EntityMapper<ComplaintListDTO, ComplaintList> {}
