package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ComplaintStatusRepository;
import com.mycompany.myapp.service.ComplaintStatusService;
import com.mycompany.myapp.service.dto.ComplaintStatusDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ComplaintStatus}.
 */
@RestController
@RequestMapping("/api/complaint-statuses")
public class ComplaintStatusResource {

    private final Logger log = LoggerFactory.getLogger(ComplaintStatusResource.class);

    private static final String ENTITY_NAME = "rdComplaintComplaintStatus";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ComplaintStatusService complaintStatusService;

    private final ComplaintStatusRepository complaintStatusRepository;

    public ComplaintStatusResource(ComplaintStatusService complaintStatusService, ComplaintStatusRepository complaintStatusRepository) {
        this.complaintStatusService = complaintStatusService;
        this.complaintStatusRepository = complaintStatusRepository;
    }

    /**
     * {@code POST  /complaint-statuses} : Create a new complaintStatus.
     *
     * @param complaintStatusDTO the complaintStatusDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new complaintStatusDTO, or with status {@code 400 (Bad Request)} if the complaintStatus has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ComplaintStatusDTO> createComplaintStatus(@RequestBody ComplaintStatusDTO complaintStatusDTO)
        throws URISyntaxException {
        log.debug("REST request to save ComplaintStatus : {}", complaintStatusDTO);
        if (complaintStatusDTO.getId() != null) {
            throw new BadRequestAlertException("A new complaintStatus cannot already have an ID", ENTITY_NAME, "idexists");
        }
        complaintStatusDTO = complaintStatusService.save(complaintStatusDTO);
        return ResponseEntity.created(new URI("/api/complaint-statuses/" + complaintStatusDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, complaintStatusDTO.getId().toString()))
            .body(complaintStatusDTO);
    }

    /**
     * {@code PUT  /complaint-statuses/:id} : Updates an existing complaintStatus.
     *
     * @param id the id of the complaintStatusDTO to save.
     * @param complaintStatusDTO the complaintStatusDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated complaintStatusDTO,
     * or with status {@code 400 (Bad Request)} if the complaintStatusDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the complaintStatusDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ComplaintStatusDTO> updateComplaintStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ComplaintStatusDTO complaintStatusDTO
    ) throws URISyntaxException {
        log.debug("REST request to update ComplaintStatus : {}, {}", id, complaintStatusDTO);
        if (complaintStatusDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, complaintStatusDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!complaintStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        complaintStatusDTO = complaintStatusService.update(complaintStatusDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, complaintStatusDTO.getId().toString()))
            .body(complaintStatusDTO);
    }

    /**
     * {@code PATCH  /complaint-statuses/:id} : Partial updates given fields of an existing complaintStatus, field will ignore if it is null
     *
     * @param id the id of the complaintStatusDTO to save.
     * @param complaintStatusDTO the complaintStatusDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated complaintStatusDTO,
     * or with status {@code 400 (Bad Request)} if the complaintStatusDTO is not valid,
     * or with status {@code 404 (Not Found)} if the complaintStatusDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the complaintStatusDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ComplaintStatusDTO> partialUpdateComplaintStatus(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ComplaintStatusDTO complaintStatusDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update ComplaintStatus partially : {}, {}", id, complaintStatusDTO);
        if (complaintStatusDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, complaintStatusDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!complaintStatusRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ComplaintStatusDTO> result = complaintStatusService.partialUpdate(complaintStatusDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, complaintStatusDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /complaint-statuses} : get all the complaintStatuses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of complaintStatuses in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ComplaintStatusDTO>> getAllComplaintStatuses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of ComplaintStatuses");
        Page<ComplaintStatusDTO> page = complaintStatusService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /complaint-statuses/:id} : get the "id" complaintStatus.
     *
     * @param id the id of the complaintStatusDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the complaintStatusDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintStatusDTO> getComplaintStatus(@PathVariable("id") Long id) {
        log.debug("REST request to get ComplaintStatus : {}", id);
        Optional<ComplaintStatusDTO> complaintStatusDTO = complaintStatusService.findOne(id);
        return ResponseUtil.wrapOrNotFound(complaintStatusDTO);
    }

    /**
     * {@code DELETE  /complaint-statuses/:id} : delete the "id" complaintStatus.
     *
     * @param id the id of the complaintStatusDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaintStatus(@PathVariable("id") Long id) {
        log.debug("REST request to delete ComplaintStatus : {}", id);
        complaintStatusService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
