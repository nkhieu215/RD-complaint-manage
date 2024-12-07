package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.UnitOfUse;
import com.mycompany.myapp.repository.UnitOfUseRepository;
import com.mycompany.myapp.service.UnitOfUseService;
import com.mycompany.myapp.service.dto.UnitOfUseDTO;
import com.mycompany.myapp.service.mapper.UnitOfUseMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.UnitOfUse}.
 */
@Service
@Transactional
public class UnitOfUseServiceImpl implements UnitOfUseService {

    private final Logger log = LoggerFactory.getLogger(UnitOfUseServiceImpl.class);

    private final UnitOfUseRepository unitOfUseRepository;

    private final UnitOfUseMapper unitOfUseMapper;

    public UnitOfUseServiceImpl(UnitOfUseRepository unitOfUseRepository, UnitOfUseMapper unitOfUseMapper) {
        this.unitOfUseRepository = unitOfUseRepository;
        this.unitOfUseMapper = unitOfUseMapper;
    }

    @Override
    public UnitOfUseDTO save(UnitOfUseDTO unitOfUseDTO) {
        log.debug("Request to save UnitOfUse : {}", unitOfUseDTO);
        UnitOfUse unitOfUse = unitOfUseMapper.toEntity(unitOfUseDTO);
        unitOfUse = unitOfUseRepository.save(unitOfUse);
        return unitOfUseMapper.toDto(unitOfUse);
    }

    @Override
    public UnitOfUseDTO update(UnitOfUseDTO unitOfUseDTO) {
        log.debug("Request to update UnitOfUse : {}", unitOfUseDTO);
        UnitOfUse unitOfUse = unitOfUseMapper.toEntity(unitOfUseDTO);
        unitOfUse = unitOfUseRepository.save(unitOfUse);
        return unitOfUseMapper.toDto(unitOfUse);
    }

    @Override
    public Optional<UnitOfUseDTO> partialUpdate(UnitOfUseDTO unitOfUseDTO) {
        log.debug("Request to partially update UnitOfUse : {}", unitOfUseDTO);

        return unitOfUseRepository
            .findById(unitOfUseDTO.getId())
            .map(existingUnitOfUse -> {
                unitOfUseMapper.partialUpdate(existingUnitOfUse, unitOfUseDTO);

                return existingUnitOfUse;
            })
            .map(unitOfUseRepository::save)
            .map(unitOfUseMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UnitOfUseDTO> findAll(Pageable pageable) {
        log.debug("Request to get all UnitOfUses");
        return unitOfUseRepository.findAll(pageable).map(unitOfUseMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UnitOfUseDTO> findOne(Long id) {
        log.debug("Request to get UnitOfUse : {}", id);
        return unitOfUseRepository.findById(id).map(unitOfUseMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete UnitOfUse : {}", id);
        unitOfUseRepository.deleteById(id);
    }
}
