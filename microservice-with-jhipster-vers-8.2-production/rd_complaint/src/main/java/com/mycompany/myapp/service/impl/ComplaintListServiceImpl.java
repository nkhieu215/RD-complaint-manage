package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.ComplaintList;
import com.mycompany.myapp.repository.ComplaintListRepository;
import com.mycompany.myapp.service.ComplaintListService;
import com.mycompany.myapp.service.dto.ComplaintListDTO;
import com.mycompany.myapp.service.mapper.ComplaintListMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.ComplaintList}.
 */
@Service
@Transactional
public class ComplaintListServiceImpl implements ComplaintListService {

    private final Logger log = LoggerFactory.getLogger(ComplaintListServiceImpl.class);

    private final ComplaintListRepository complaintListRepository;

    private final ComplaintListMapper complaintListMapper;

    public ComplaintListServiceImpl(ComplaintListRepository complaintListRepository, ComplaintListMapper complaintListMapper) {
        this.complaintListRepository = complaintListRepository;
        this.complaintListMapper = complaintListMapper;
    }

    @Override
    public ComplaintListDTO save(ComplaintListDTO complaintListDTO) {
        log.debug("Request to save ComplaintList : {}", complaintListDTO);
        ComplaintList complaintList = complaintListMapper.toEntity(complaintListDTO);
        complaintList = complaintListRepository.save(complaintList);
        return complaintListMapper.toDto(complaintList);
    }

    @Override
    public ComplaintListDTO update(ComplaintListDTO complaintListDTO) {
        log.debug("Request to update ComplaintList : {}", complaintListDTO);
        ComplaintList complaintList = complaintListMapper.toEntity(complaintListDTO);
        complaintList = complaintListRepository.save(complaintList);
        return complaintListMapper.toDto(complaintList);
    }

    @Override
    public Optional<ComplaintListDTO> partialUpdate(ComplaintListDTO complaintListDTO) {
        log.debug("Request to partially update ComplaintList : {}", complaintListDTO);

        return complaintListRepository
            .findById(complaintListDTO.getId())
            .map(existingComplaintList -> {
                complaintListMapper.partialUpdate(existingComplaintList, complaintListDTO);

                return existingComplaintList;
            })
            .map(complaintListRepository::save)
            .map(complaintListMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ComplaintListDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ComplaintLists");
        return complaintListRepository.findAll(pageable).map(complaintListMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ComplaintListDTO> findOne(Long id) {
        log.debug("Request to get ComplaintList : {}", id);
        return complaintListRepository.findById(id).map(complaintListMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ComplaintList : {}", id);
        complaintListRepository.deleteById(id);
    }
}
