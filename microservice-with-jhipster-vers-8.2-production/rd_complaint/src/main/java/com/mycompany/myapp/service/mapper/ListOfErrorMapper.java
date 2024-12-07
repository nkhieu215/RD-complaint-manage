package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.ListOfError;
import com.mycompany.myapp.service.dto.ListOfErrorDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ListOfError} and its DTO {@link ListOfErrorDTO}.
 */
@Mapper(componentModel = "spring")
public interface ListOfErrorMapper extends EntityMapper<ListOfErrorDTO, ListOfError> {}
