package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.CheckerList;
import com.mycompany.myapp.repository.CheckerListRepository;
import com.mycompany.myapp.service.CheckerListService;
import com.mycompany.myapp.service.dto.CheckerListDTO;
import com.mycompany.myapp.service.mapper.CheckerListMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.CheckerList}.
 */
@Service
@Transactional
public class CheckerListServiceImpl implements CheckerListService {

    private final Logger log = LoggerFactory.getLogger(CheckerListServiceImpl.class);

    private final CheckerListRepository checkerListRepository;

    private final CheckerListMapper checkerListMapper;

    public CheckerListServiceImpl(CheckerListRepository checkerListRepository, CheckerListMapper checkerListMapper) {
        this.checkerListRepository = checkerListRepository;
        this.checkerListMapper = checkerListMapper;
    }

    @Override
    public CheckerListDTO save(CheckerListDTO checkerListDTO) {
        log.debug("Request to save CheckerList : {}", checkerListDTO);
        CheckerList checkerList = checkerListMapper.toEntity(checkerListDTO);
        checkerList = checkerListRepository.save(checkerList);
        return checkerListMapper.toDto(checkerList);
    }

    @Override
    public CheckerListDTO update(CheckerListDTO checkerListDTO) {
        log.debug("Request to update CheckerList : {}", checkerListDTO);
        CheckerList checkerList = checkerListMapper.toEntity(checkerListDTO);
        checkerList = checkerListRepository.save(checkerList);
        return checkerListMapper.toDto(checkerList);
    }

    @Override
    public Optional<CheckerListDTO> partialUpdate(CheckerListDTO checkerListDTO) {
        log.debug("Request to partially update CheckerList : {}", checkerListDTO);

        return checkerListRepository
            .findById(checkerListDTO.getId())
            .map(existingCheckerList -> {
                checkerListMapper.partialUpdate(existingCheckerList, checkerListDTO);

                return existingCheckerList;
            })
            .map(checkerListRepository::save)
            .map(checkerListMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CheckerListDTO> findAll(Pageable pageable) {
        log.debug("Request to get all CheckerLists");
        return checkerListRepository.findAll(pageable).map(checkerListMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CheckerListDTO> findOne(Long id) {
        log.debug("Request to get CheckerList : {}", id);
        return checkerListRepository.findById(id).map(checkerListMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CheckerList : {}", id);
        checkerListRepository.deleteById(id);
    }
}
