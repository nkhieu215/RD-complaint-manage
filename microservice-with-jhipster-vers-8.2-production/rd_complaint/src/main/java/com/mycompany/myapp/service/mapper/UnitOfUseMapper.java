package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.UnitOfUse;
import com.mycompany.myapp.service.dto.UnitOfUseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UnitOfUse} and its DTO {@link UnitOfUseDTO}.
 */
@Mapper(componentModel = "spring")
public interface UnitOfUseMapper extends EntityMapper<UnitOfUseDTO, UnitOfUse> {}
