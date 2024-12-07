package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ComplaintListDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.ComplaintList}.
 */
public interface ComplaintListService {
    /**
     * Save a complaintList.
     *
     * @param complaintListDTO the entity to save.
     * @return the persisted entity.
     */
    ComplaintListDTO save(ComplaintListDTO complaintListDTO);

    /**
     * Updates a complaintList.
     *
     * @param complaintListDTO the entity to update.
     * @return the persisted entity.
     */
    ComplaintListDTO update(ComplaintListDTO complaintListDTO);

    /**
     * Partially updates a complaintList.
     *
     * @param complaintListDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ComplaintListDTO> partialUpdate(ComplaintListDTO complaintListDTO);

    /**
     * Get all the complaintLists.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ComplaintListDTO> findAll(Pageable pageable);

    /**
     * Get the "id" complaintList.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ComplaintListDTO> findOne(Long id);

    /**
     * Delete the "id" complaintList.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
