package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ImplementationResultDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.ImplementationResult}.
 */
public interface ImplementationResultService {
    /**
     * Save a implementationResult.
     *
     * @param implementationResultDTO the entity to save.
     * @return the persisted entity.
     */
    ImplementationResultDTO save(ImplementationResultDTO implementationResultDTO);

    /**
     * Updates a implementationResult.
     *
     * @param implementationResultDTO the entity to update.
     * @return the persisted entity.
     */
    ImplementationResultDTO update(ImplementationResultDTO implementationResultDTO);

    /**
     * Partially updates a implementationResult.
     *
     * @param implementationResultDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ImplementationResultDTO> partialUpdate(ImplementationResultDTO implementationResultDTO);

    /**
     * Get all the implementationResults.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ImplementationResultDTO> findAll(Pageable pageable);

    /**
     * Get the "id" implementationResult.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ImplementationResultDTO> findOne(Long id);

    /**
     * Delete the "id" implementationResult.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
