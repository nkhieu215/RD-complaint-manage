package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.CheckerList;
import com.mycompany.myapp.service.dto.CheckerListDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CheckerList} and its DTO {@link CheckerListDTO}.
 */
@Mapper(componentModel = "spring")
public interface CheckerListMapper extends EntityMapper<CheckerListDTO, CheckerList> {}
