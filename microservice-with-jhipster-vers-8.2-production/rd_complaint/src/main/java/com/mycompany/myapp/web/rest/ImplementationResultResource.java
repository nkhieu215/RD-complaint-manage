package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ImplementationResultRepository;
import com.mycompany.myapp.service.ImplementationResultService;
import com.mycompany.myapp.service.dto.ImplementationResultDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ImplementationResult}.
 */
@RestController
@RequestMapping("/api/implementation-results")
public class ImplementationResultResource {

    private final Logger log = LoggerFactory.getLogger(ImplementationResultResource.class);

    private static final String ENTITY_NAME = "rdComplaintImplementationResult";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImplementationResultService implementationResultService;

    private final ImplementationResultRepository implementationResultRepository;

    public ImplementationResultResource(
        ImplementationResultService implementationResultService,
        ImplementationResultRepository implementationResultRepository
    ) {
        this.implementationResultService = implementationResultService;
        this.implementationResultRepository = implementationResultRepository;
    }

    /**
     * {@code POST  /implementation-results} : Create a new implementationResult.
     *
     * @param implementationResultDTO the implementationResultDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new implementationResultDTO, or with status {@code 400 (Bad Request)} if the implementationResult has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ImplementationResultDTO> createImplementationResult(@RequestBody ImplementationResultDTO implementationResultDTO)
        throws URISyntaxException {
        log.debug("REST request to save ImplementationResult : {}", implementationResultDTO);
        if (implementationResultDTO.getId() != null) {
            throw new BadRequestAlertException("A new implementationResult cannot already have an ID", ENTITY_NAME, "idexists");
        }
        implementationResultDTO = implementationResultService.save(implementationResultDTO);
        return ResponseEntity.created(new URI("/api/implementation-results/" + implementationResultDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, implementationResultDTO.getId().toString()))
            .body(implementationResultDTO);
    }

    /**
     * {@code PUT  /implementation-results/:id} : Updates an existing implementationResult.
     *
     * @param id the id of the implementationResultDTO to save.
     * @param implementationResultDTO the implementationResultDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated implementationResultDTO,
     * or with status {@code 400 (Bad Request)} if the implementationResultDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the implementationResultDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ImplementationResultDTO> updateImplementationResult(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ImplementationResultDTO implementationResultDTO
    ) throws URISyntaxException {
        log.debug("REST request to update ImplementationResult : {}, {}", id, implementationResultDTO);
        if (implementationResultDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, implementationResultDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!implementationResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        implementationResultDTO = implementationResultService.update(implementationResultDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, implementationResultDTO.getId().toString()))
            .body(implementationResultDTO);
    }

    /**
     * {@code PATCH  /implementation-results/:id} : Partial updates given fields of an existing implementationResult, field will ignore if it is null
     *
     * @param id the id of the implementationResultDTO to save.
     * @param implementationResultDTO the implementationResultDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated implementationResultDTO,
     * or with status {@code 400 (Bad Request)} if the implementationResultDTO is not valid,
     * or with status {@code 404 (Not Found)} if the implementationResultDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the implementationResultDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ImplementationResultDTO> partialUpdateImplementationResult(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ImplementationResultDTO implementationResultDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update ImplementationResult partially : {}, {}", id, implementationResultDTO);
        if (implementationResultDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, implementationResultDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!implementationResultRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ImplementationResultDTO> result = implementationResultService.partialUpdate(implementationResultDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, implementationResultDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /implementation-results} : get all the implementationResults.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of implementationResults in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ImplementationResultDTO>> getAllImplementationResults(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of ImplementationResults");
        Page<ImplementationResultDTO> page = implementationResultService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /implementation-results/:id} : get the "id" implementationResult.
     *
     * @param id the id of the implementationResultDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the implementationResultDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ImplementationResultDTO> getImplementationResult(@PathVariable("id") Long id) {
        log.debug("REST request to get ImplementationResult : {}", id);
        Optional<ImplementationResultDTO> implementationResultDTO = implementationResultService.findOne(id);
        return ResponseUtil.wrapOrNotFound(implementationResultDTO);
    }

    /**
     * {@code DELETE  /implementation-results/:id} : delete the "id" implementationResult.
     *
     * @param id the id of the implementationResultDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImplementationResult(@PathVariable("id") Long id) {
        log.debug("REST request to delete ImplementationResult : {}", id);
        implementationResultService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
