package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.UnitOfUseDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.UnitOfUse}.
 */
public interface UnitOfUseService {
    /**
     * Save a unitOfUse.
     *
     * @param unitOfUseDTO the entity to save.
     * @return the persisted entity.
     */
    UnitOfUseDTO save(UnitOfUseDTO unitOfUseDTO);

    /**
     * Updates a unitOfUse.
     *
     * @param unitOfUseDTO the entity to update.
     * @return the persisted entity.
     */
    UnitOfUseDTO update(UnitOfUseDTO unitOfUseDTO);

    /**
     * Partially updates a unitOfUse.
     *
     * @param unitOfUseDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<UnitOfUseDTO> partialUpdate(UnitOfUseDTO unitOfUseDTO);

    /**
     * Get all the unitOfUses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UnitOfUseDTO> findAll(Pageable pageable);

    /**
     * Get the "id" unitOfUse.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UnitOfUseDTO> findOne(Long id);

    /**
     * Delete the "id" unitOfUse.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
