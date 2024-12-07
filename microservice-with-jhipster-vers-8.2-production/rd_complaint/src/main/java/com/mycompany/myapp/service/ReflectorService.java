package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ReflectorDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Reflector}.
 */
public interface ReflectorService {
    /**
     * Save a reflector.
     *
     * @param reflectorDTO the entity to save.
     * @return the persisted entity.
     */
    ReflectorDTO save(ReflectorDTO reflectorDTO);

    /**
     * Updates a reflector.
     *
     * @param reflectorDTO the entity to update.
     * @return the persisted entity.
     */
    ReflectorDTO update(ReflectorDTO reflectorDTO);

    /**
     * Partially updates a reflector.
     *
     * @param reflectorDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ReflectorDTO> partialUpdate(ReflectorDTO reflectorDTO);

    /**
     * Get all the reflectors.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ReflectorDTO> findAll(Pageable pageable);

    /**
     * Get the "id" reflector.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ReflectorDTO> findOne(Long id);

    /**
     * Delete the "id" reflector.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
