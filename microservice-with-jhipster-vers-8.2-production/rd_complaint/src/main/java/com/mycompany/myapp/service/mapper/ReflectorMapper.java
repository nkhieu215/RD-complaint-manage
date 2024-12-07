package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Reflector;
import com.mycompany.myapp.service.dto.ReflectorDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Reflector} and its DTO {@link ReflectorDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReflectorMapper extends EntityMapper<ReflectorDTO, Reflector> {}
