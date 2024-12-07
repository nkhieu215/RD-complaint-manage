package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.ComplaintStatus;
import com.mycompany.myapp.repository.ComplaintStatusRepository;
import com.mycompany.myapp.service.ComplaintStatusService;
import com.mycompany.myapp.service.dto.ComplaintStatusDTO;
import com.mycompany.myapp.service.mapper.ComplaintStatusMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.ComplaintStatus}.
 */
@Service
@Transactional
public class ComplaintStatusServiceImpl implements ComplaintStatusService {

    private final Logger log = LoggerFactory.getLogger(ComplaintStatusServiceImpl.class);

    private final ComplaintStatusRepository complaintStatusRepository;

    private final ComplaintStatusMapper complaintStatusMapper;

    public ComplaintStatusServiceImpl(ComplaintStatusRepository complaintStatusRepository, ComplaintStatusMapper complaintStatusMapper) {
        this.complaintStatusRepository = complaintStatusRepository;
        this.complaintStatusMapper = complaintStatusMapper;
    }

    @Override
    public ComplaintStatusDTO save(ComplaintStatusDTO complaintStatusDTO) {
        log.debug("Request to save ComplaintStatus : {}", complaintStatusDTO);
        ComplaintStatus complaintStatus = complaintStatusMapper.toEntity(complaintStatusDTO);
        complaintStatus = complaintStatusRepository.save(complaintStatus);
        return complaintStatusMapper.toDto(complaintStatus);
    }

    @Override
    public ComplaintStatusDTO update(ComplaintStatusDTO complaintStatusDTO) {
        log.debug("Request to update ComplaintStatus : {}", complaintStatusDTO);
        ComplaintStatus complaintStatus = complaintStatusMapper.toEntity(complaintStatusDTO);
        complaintStatus = complaintStatusRepository.save(complaintStatus);
        return complaintStatusMapper.toDto(complaintStatus);
    }

    @Override
    public Optional<ComplaintStatusDTO> partialUpdate(ComplaintStatusDTO complaintStatusDTO) {
        log.debug("Request to partially update ComplaintStatus : {}", complaintStatusDTO);

        return complaintStatusRepository
            .findById(complaintStatusDTO.getId())
            .map(existingComplaintStatus -> {
                complaintStatusMapper.partialUpdate(existingComplaintStatus, complaintStatusDTO);

                return existingComplaintStatus;
            })
            .map(complaintStatusRepository::save)
            .map(complaintStatusMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintStatusDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ComplaintStatuses");
        return complaintStatusRepository.findAll(pageable).map(complaintStatusMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ComplaintStatusDTO> findOne(Long id) {
        log.debug("Request to get ComplaintStatus : {}", id);
        return complaintStatusRepository.findById(id).map(complaintStatusMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ComplaintStatus : {}", id);
        complaintStatusRepository.deleteById(id);
    }
}
