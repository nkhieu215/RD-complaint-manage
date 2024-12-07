package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.CheckerListDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.CheckerList}.
 */
public interface CheckerListService {
    /**
     * Save a checkerList.
     *
     * @param checkerListDTO the entity to save.
     * @return the persisted entity.
     */
    CheckerListDTO save(CheckerListDTO checkerListDTO);

    /**
     * Updates a checkerList.
     *
     * @param checkerListDTO the entity to update.
     * @return the persisted entity.
     */
    CheckerListDTO update(CheckerListDTO checkerListDTO);

    /**
     * Partially updates a checkerList.
     *
     * @param checkerListDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CheckerListDTO> partialUpdate(CheckerListDTO checkerListDTO);

    /**
     * Get all the checkerLists.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CheckerListDTO> findAll(Pageable pageable);

    /**
     * Get the "id" checkerList.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CheckerListDTO> findOne(Long id);

    /**
     * Delete the "id" checkerList.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
