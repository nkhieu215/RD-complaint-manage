package com.mycompany.myapp.service;

import com.mycompany.myapp.service.dto.ComplaintStatusDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.ComplaintStatus}.
 */
public interface ComplaintStatusService {
    /**
     * Save a complaintStatus.
     *
     * @param complaintStatusDTO the entity to save.
     * @return the persisted entity.
     */
    ComplaintStatusDTO save(ComplaintStatusDTO complaintStatusDTO);

    /**
     * Updates a complaintStatus.
     *
     * @param complaintStatusDTO the entity to update.
     * @return the persisted entity.
     */
    ComplaintStatusDTO update(ComplaintStatusDTO complaintStatusDTO);

    /**
     * Partially updates a complaintStatus.
     *
     * @param complaintStatusDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ComplaintStatusDTO> partialUpdate(ComplaintStatusDTO complaintStatusDTO);

    /**
     * Get all the complaintStatuses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ComplaintStatusDTO> findAll(Pageable pageable);

    /**
     * Get the "id" complaintStatus.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ComplaintStatusDTO> findOne(Long id);

    /**
     * Delete the "id" complaintStatus.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
