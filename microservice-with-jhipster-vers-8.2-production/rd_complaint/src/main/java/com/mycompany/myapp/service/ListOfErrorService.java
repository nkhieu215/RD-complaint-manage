package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ListOfErrorDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.ListOfError}.
 */
public interface ListOfErrorService {
    /**
     * Save a listOfError.
     *
     * @param listOfErrorDTO the entity to save.
     * @return the persisted entity.
     */
    ListOfErrorDTO save(ListOfErrorDTO listOfErrorDTO);

    /**
     * Updates a listOfError.
     *
     * @param listOfErrorDTO the entity to update.
     * @return the persisted entity.
     */
    ListOfErrorDTO update(ListOfErrorDTO listOfErrorDTO);

    /**
     * Partially updates a listOfError.
     *
     * @param listOfErrorDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ListOfErrorDTO> partialUpdate(ListOfErrorDTO listOfErrorDTO);

    /**
     * Get all the listOfErrors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ListOfErrorDTO> findAll(Pageable pageable);

    /**
     * Get the "id" listOfError.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ListOfErrorDTO> findOne(Long id);

    /**
     * Delete the "id" listOfError.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
