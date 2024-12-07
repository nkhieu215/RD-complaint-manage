package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Reflector;
import com.mycompany.myapp.repository.ReflectorRepository;
import com.mycompany.myapp.service.ReflectorService;
import com.mycompany.myapp.service.dto.ReflectorDTO;
import com.mycompany.myapp.service.mapper.ReflectorMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Reflector}.
 */
@Service
@Transactional
public class ReflectorServiceImpl implements ReflectorService {

    private final Logger log = LoggerFactory.getLogger(ReflectorServiceImpl.class);

    private final ReflectorRepository reflectorRepository;

    private final ReflectorMapper reflectorMapper;

    public ReflectorServiceImpl(ReflectorRepository reflectorRepository, ReflectorMapper reflectorMapper) {
        this.reflectorRepository = reflectorRepository;
        this.reflectorMapper = reflectorMapper;
    }

    @Override
    public ReflectorDTO save(ReflectorDTO reflectorDTO) {
        log.debug("Request to save Reflector : {}", reflectorDTO);
        Reflector reflector = reflectorMapper.toEntity(reflectorDTO);
        reflector = reflectorRepository.save(reflector);
        return reflectorMapper.toDto(reflector);
    }

    @Override
    public ReflectorDTO update(ReflectorDTO reflectorDTO) {
        log.debug("Request to update Reflector : {}", reflectorDTO);
        Reflector reflector = reflectorMapper.toEntity(reflectorDTO);
        reflector = reflectorRepository.save(reflector);
        return reflectorMapper.toDto(reflector);
    }

    @Override
    public Optional<ReflectorDTO> partialUpdate(ReflectorDTO reflectorDTO) {
        log.debug("Request to partially update Reflector : {}", reflectorDTO);

        return reflectorRepository
            .findById(reflectorDTO.getId())
            .map(existingReflector -> {
                reflectorMapper.partialUpdate(existingReflector, reflectorDTO);

                return existingReflector;
            })
            .map(reflectorRepository::save)
            .map(reflectorMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReflectorDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Reflectors");
        return reflectorRepository.findAll(pageable).map(reflectorMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReflectorDTO> findOne(Long id) {
        log.debug("Request to get Reflector : {}", id);
        return reflectorRepository.findById(id).map(reflectorMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Reflector : {}", id);
        reflectorRepository.deleteById(id);
    }
}
