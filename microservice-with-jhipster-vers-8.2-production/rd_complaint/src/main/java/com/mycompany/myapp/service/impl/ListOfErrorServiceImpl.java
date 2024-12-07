package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.ListOfError;
import com.mycompany.myapp.repository.ListOfErrorRepository;
import com.mycompany.myapp.service.ListOfErrorService;
import com.mycompany.myapp.service.dto.ListOfErrorDTO;
import com.mycompany.myapp.service.mapper.ListOfErrorMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.ListOfError}.
 */
@Service
@Transactional
public class ListOfErrorServiceImpl implements ListOfErrorService {

    private final Logger log = LoggerFactory.getLogger(ListOfErrorServiceImpl.class);

    private final ListOfErrorRepository listOfErrorRepository;

    private final ListOfErrorMapper listOfErrorMapper;

    public ListOfErrorServiceImpl(ListOfErrorRepository listOfErrorRepository, ListOfErrorMapper listOfErrorMapper) {
        this.listOfErrorRepository = listOfErrorRepository;
        this.listOfErrorMapper = listOfErrorMapper;
    }

    @Override
    public ListOfErrorDTO save(ListOfErrorDTO listOfErrorDTO) {
        log.debug("Request to save ListOfError : {}", listOfErrorDTO);
        ListOfError listOfError = listOfErrorMapper.toEntity(listOfErrorDTO);
        listOfError = listOfErrorRepository.save(listOfError);
        return listOfErrorMapper.toDto(listOfError);
    }

    @Override
    public ListOfErrorDTO update(ListOfErrorDTO listOfErrorDTO) {
        log.debug("Request to update ListOfError : {}", listOfErrorDTO);
        ListOfError listOfError = listOfErrorMapper.toEntity(listOfErrorDTO);
        listOfError = listOfErrorRepository.save(listOfError);
        return listOfErrorMapper.toDto(listOfError);
    }

    @Override
    public Optional<ListOfErrorDTO> partialUpdate(ListOfErrorDTO listOfErrorDTO) {
        log.debug("Request to partially update ListOfError : {}", listOfErrorDTO);

        return listOfErrorRepository
            .findById(listOfErrorDTO.getId())
            .map(existingListOfError -> {
                listOfErrorMapper.partialUpdate(existingListOfError, listOfErrorDTO);

                return existingListOfError;
            })
            .map(listOfErrorRepository::save)
            .map(listOfErrorMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ListOfErrorDTO> findAll(Pageable pageable) {
        log.debug("Request to get all ListOfErrors");
        return listOfErrorRepository.findAll(pageable).map(listOfErrorMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ListOfErrorDTO> findOne(Long id) {
        log.debug("Request to get ListOfError : {}", id);
        return listOfErrorRepository.findById(id).map(listOfErrorMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ListOfError : {}", id);
        listOfErrorRepository.deleteById(id);
    }
}
