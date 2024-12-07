package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.ImplementationResult;
import com.mycompany.myapp.service.dto.ImplementationResultDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ImplementationResult} and its DTO {@link ImplementationResultDTO}.
 */
@Mapper(componentModel = "spring")
public interface ImplementationResultMapper extends EntityMapper<ImplementationResultDTO, ImplementationResult> {}
