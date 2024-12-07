package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Reason;
import com.mycompany.myapp.service.dto.ReasonDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Reason} and its DTO {@link ReasonDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReasonMapper extends EntityMapper<ReasonDTO, Reason> {}
