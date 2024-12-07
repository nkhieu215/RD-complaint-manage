package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ReasonDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Reason}.
 */
public interface ReasonService {
    /**
     * Save a reason.
     *
     * @param reasonDTO the entity to save.
     * @return the persisted entity.
     */
    ReasonDTO save(ReasonDTO reasonDTO);

    /**
     * Updates a reason.
     *
     * @param reasonDTO the entity to update.
     * @return the persisted entity.
     */
    ReasonDTO update(ReasonDTO reasonDTO);

    /**
     * Partially updates a reason.
     *
     * @param reasonDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ReasonDTO> partialUpdate(ReasonDTO reasonDTO);

    /**
     * Get all the reasons.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ReasonDTO> findAll(Pageable pageable);

    /**
     * Get the "id" reason.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ReasonDTO> findOne(Long id);

    /**
     * Delete the "id" reason.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
