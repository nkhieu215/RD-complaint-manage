package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.ImplementationResult;
import com.mycompany.myapp.repository.ImplementationResultRepository;
import com.mycompany.myapp.service.ImplementationResultService;
import com.mycompany.myapp.service.dto.ImplementationResultDTO;
import com.mycompany.myapp.service.mapper.ImplementationResultMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.ImplementationResult}.
 */
@Service
@Transactional
public class ImplementationResultServiceImpl implements ImplementationResultService {

    private final Logger log = LoggerFactory.getLogger(ImplementationResultServiceImpl.class);

    private final ImplementationResultRepository implementationResultRepository;

    private final ImplementationResultMapper implementationResultMapper;

    public ImplementationResultServiceImpl(
        ImplementationResultRepository implementationResultRepository,
        ImplementationResultMapper implementationResultMapper
    ) {
        this.implementationResultRepository = implementationResultRepository;
        this.implementationResultMapper = implementationResultMapper;
    }

    @Override
    public ImplementationResultDTO save(ImplementationResultDTO implementationResultDTO) {
        log.debug("Request to save ImplementationResult : {}", implementationResultDTO);
        ImplementationResult implementationResult = implementationResultMapper.toEntity(implementationResultDTO);
        implementationResult = implementationResultRepository.save(implementationResult);
        return implementationResultMapper.toDto(implementationResult);
    }

    @Override
    public ImplementationResultDTO update(ImplementationResultDTO implementationResultDTO) {
        log.debug("Request to update ImplementationResult : {}", implementationResultDTO);
        ImplementationResult implementationResult = implementationResultMapper.toEntity(implementationResultDTO);
        implementationResult = implementationResultRepository.save(implementationResult);
        return implementationResultMapper.toDto(implementationResult);
    }

    @Override
    public Optional<ImplementationResultDTO> partialUpdate(ImplementationResultDTO implementationResultDTO) {
        log.debug("Request to partially update ImplementationResult : {}", implementationResultDTO);

        return implementationResultRepository
            .findById(implementationResultDTO.getId())
            .map(existingImplementationResult -> {
                implementationResultMapper.partialUpdate(existingImplementationResult, implementationResultDTO);

                return existingImplementationResult;
            })
            .map(implementationResultRepository::save)
            .map(implementationResultMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ImplementationResultDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ImplementationResults");
        return implementationResultRepository.findAll(pageable).map(implementationResultMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ImplementationResultDTO> findOne(Long id) {
        log.debug("Request to get ImplementationResult : {}", id);
        return implementationResultRepository.findById(id).map(implementationResultMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ImplementationResult : {}", id);
        implementationResultRepository.deleteById(id);
    }
}
