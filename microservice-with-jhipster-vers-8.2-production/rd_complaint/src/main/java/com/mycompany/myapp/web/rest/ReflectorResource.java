package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ReflectorRepository;
import com.mycompany.myapp.service.ReflectorService;
import com.mycompany.myapp.service.dto.ReflectorDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Reflector}.
 */
@RestController
@RequestMapping("/api/reflectors")
public class ReflectorResource {

    private final Logger log = LoggerFactory.getLogger(ReflectorResource.class);

    private static final String ENTITY_NAME = "rdComplaintReflector";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReflectorService reflectorService;

    private final ReflectorRepository reflectorRepository;

    public ReflectorResource(ReflectorService reflectorService, ReflectorRepository reflectorRepository) {
        this.reflectorService = reflectorService;
        this.reflectorRepository = reflectorRepository;
    }

    /**
     * {@code POST  /reflectors} : Create a new reflector.
     *
     * @param reflectorDTO the reflectorDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reflectorDTO, or with status {@code 400 (Bad Request)} if the reflector has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReflectorDTO> createReflector(@RequestBody ReflectorDTO reflectorDTO) throws URISyntaxException {
        log.debug("REST request to save Reflector : {}", reflectorDTO);
        if (reflectorDTO.getId() != null) {
            throw new BadRequestAlertException("A new reflector cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reflectorDTO = reflectorService.save(reflectorDTO);
        return ResponseEntity.created(new URI("/api/reflectors/" + reflectorDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, reflectorDTO.getId().toString()))
            .body(reflectorDTO);
    }

    /**
     * {@code PUT  /reflectors/:id} : Updates an existing reflector.
     *
     * @param id the id of the reflectorDTO to save.
     * @param reflectorDTO the reflectorDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reflectorDTO,
     * or with status {@code 400 (Bad Request)} if the reflectorDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reflectorDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReflectorDTO> updateReflector(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReflectorDTO reflectorDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Reflector : {}, {}", id, reflectorDTO);
        if (reflectorDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reflectorDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reflectorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        reflectorDTO = reflectorService.update(reflectorDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reflectorDTO.getId().toString()))
            .body(reflectorDTO);
    }

    /**
     * {@code PATCH  /reflectors/:id} : Partial updates given fields of an existing reflector, field will ignore if it is null
     *
     * @param id the id of the reflectorDTO to save.
     * @param reflectorDTO the reflectorDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reflectorDTO,
     * or with status {@code 400 (Bad Request)} if the reflectorDTO is not valid,
     * or with status {@code 404 (Not Found)} if the reflectorDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the reflectorDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReflectorDTO> partialUpdateReflector(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReflectorDTO reflectorDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Reflector partially : {}, {}", id, reflectorDTO);
        if (reflectorDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reflectorDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reflectorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReflectorDTO> result = reflectorService.partialUpdate(reflectorDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reflectorDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /reflectors} : get all the reflectors.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reflectors in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ReflectorDTO>> getAllReflectors(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Reflectors");
        Page<ReflectorDTO> page = reflectorService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reflectors/:id} : get the "id" reflector.
     *
     * @param id the id of the reflectorDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reflectorDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReflectorDTO> getReflector(@PathVariable("id") Long id) {
        log.debug("REST request to get Reflector : {}", id);
        Optional<ReflectorDTO> reflectorDTO = reflectorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reflectorDTO);
    }

    /**
     * {@code DELETE  /reflectors/:id} : delete the "id" reflector.
     *
     * @param id the id of the reflectorDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReflector(@PathVariable("id") Long id) {
        log.debug("REST request to delete Reflector : {}", id);
        reflectorService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
