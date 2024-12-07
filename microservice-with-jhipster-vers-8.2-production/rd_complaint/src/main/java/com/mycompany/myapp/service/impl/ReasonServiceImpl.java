package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Reason;
import com.mycompany.myapp.repository.ReasonRepository;
import com.mycompany.myapp.service.ReasonService;
import com.mycompany.myapp.service.dto.ReasonDTO;
import com.mycompany.myapp.service.mapper.ReasonMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Reason}.
 */
@Service
@Transactional
public class ReasonServiceImpl implements ReasonService {

    private final Logger log = LoggerFactory.getLogger(ReasonServiceImpl.class);

    private final ReasonRepository reasonRepository;

    private final ReasonMapper reasonMapper;

    public ReasonServiceImpl(ReasonRepository reasonRepository, ReasonMapper reasonMapper) {
        this.reasonRepository = reasonRepository;
        this.reasonMapper = reasonMapper;
    }

    @Override
    public ReasonDTO save(ReasonDTO reasonDTO) {
        log.debug("Request to save Reason : {}", reasonDTO);
        Reason reason = reasonMapper.toEntity(reasonDTO);
        reason = reasonRepository.save(reason);
        return reasonMapper.toDto(reason);
    }

    @Override
    public ReasonDTO update(ReasonDTO reasonDTO) {
        log.debug("Request to update Reason : {}", reasonDTO);
        Reason reason = reasonMapper.toEntity(reasonDTO);
        reason = reasonRepository.save(reason);
        return reasonMapper.toDto(reason);
    }

    @Override
    public Optional<ReasonDTO> partialUpdate(ReasonDTO reasonDTO) {
        log.debug("Request to partially update Reason : {}", reasonDTO);

        return reasonRepository
            .findById(reasonDTO.getId())
            .map(existingReason -> {
                reasonMapper.partialUpdate(existingReason, reasonDTO);

                return existingReason;
            })
            .map(reasonRepository::save)
            .map(reasonMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReasonDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Reasons");
        return reasonRepository.findAll(pageable).map(reasonMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReasonDTO> findOne(Long id) {
        log.debug("Request to get Reason : {}", id);
        return reasonRepository.findById(id).map(reasonMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Reason : {}", id);
        reasonRepository.deleteById(id);
    }
}
