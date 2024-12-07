package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.UnitOfUseRepository;
import com.mycompany.myapp.service.UnitOfUseService;
import com.mycompany.myapp.service.dto.UnitOfUseDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.UnitOfUse}.
 */
@RestController
@RequestMapping("/api/unit-of-uses")
public class UnitOfUseResource {

    private final Logger log = LoggerFactory.getLogger(UnitOfUseResource.class);

    private static final String ENTITY_NAME = "rdComplaintUnitOfUse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UnitOfUseService unitOfUseService;

    private final UnitOfUseRepository unitOfUseRepository;

    public UnitOfUseResource(UnitOfUseService unitOfUseService, UnitOfUseRepository unitOfUseRepository) {
        this.unitOfUseService = unitOfUseService;
        this.unitOfUseRepository = unitOfUseRepository;
    }

    /**
     * {@code POST  /unit-of-uses} : Create a new unitOfUse.
     *
     * @param unitOfUseDTO the unitOfUseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new unitOfUseDTO, or with status {@code 400 (Bad Request)} if the unitOfUse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<UnitOfUseDTO> createUnitOfUse(@RequestBody UnitOfUseDTO unitOfUseDTO) throws URISyntaxException {
        log.debug("REST request to save UnitOfUse : {}", unitOfUseDTO);
        if (unitOfUseDTO.getId() != null) {
            throw new BadRequestAlertException("A new unitOfUse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        unitOfUseDTO = unitOfUseService.save(unitOfUseDTO);
        return ResponseEntity.created(new URI("/api/unit-of-uses/" + unitOfUseDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, unitOfUseDTO.getId().toString()))
            .body(unitOfUseDTO);
    }

    /**
     * {@code PUT  /unit-of-uses/:id} : Updates an existing unitOfUse.
     *
     * @param id the id of the unitOfUseDTO to save.
     * @param unitOfUseDTO the unitOfUseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unitOfUseDTO,
     * or with status {@code 400 (Bad Request)} if the unitOfUseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the unitOfUseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UnitOfUseDTO> updateUnitOfUse(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UnitOfUseDTO unitOfUseDTO
    ) throws URISyntaxException {
        log.debug("REST request to update UnitOfUse : {}, {}", id, unitOfUseDTO);
        if (unitOfUseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unitOfUseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unitOfUseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        unitOfUseDTO = unitOfUseService.update(unitOfUseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, unitOfUseDTO.getId().toString()))
            .body(unitOfUseDTO);
    }

    /**
     * {@code PATCH  /unit-of-uses/:id} : Partial updates given fields of an existing unitOfUse, field will ignore if it is null
     *
     * @param id the id of the unitOfUseDTO to save.
     * @param unitOfUseDTO the unitOfUseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unitOfUseDTO,
     * or with status {@code 400 (Bad Request)} if the unitOfUseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the unitOfUseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the unitOfUseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UnitOfUseDTO> partialUpdateUnitOfUse(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UnitOfUseDTO unitOfUseDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update UnitOfUse partially : {}, {}", id, unitOfUseDTO);
        if (unitOfUseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unitOfUseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unitOfUseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UnitOfUseDTO> result = unitOfUseService.partialUpdate(unitOfUseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, unitOfUseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /unit-of-uses} : get all the unitOfUses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of unitOfUses in body.
     */
    @GetMapping("")
    public ResponseEntity<List<UnitOfUseDTO>> getAllUnitOfUses(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of UnitOfUses");
        Page<UnitOfUseDTO> page = unitOfUseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /unit-of-uses/:id} : get the "id" unitOfUse.
     *
     * @param id the id of the unitOfUseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the unitOfUseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UnitOfUseDTO> getUnitOfUse(@PathVariable("id") Long id) {
        log.debug("REST request to get UnitOfUse : {}", id);
        Optional<UnitOfUseDTO> unitOfUseDTO = unitOfUseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(unitOfUseDTO);
    }

    /**
     * {@code DELETE  /unit-of-uses/:id} : delete the "id" unitOfUse.
     *
     * @param id the id of the unitOfUseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUnitOfUse(@PathVariable("id") Long id) {
        log.debug("REST request to delete UnitOfUse : {}", id);
        unitOfUseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
