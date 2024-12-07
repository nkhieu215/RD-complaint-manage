package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.repository.ReasonRepository;
import com.mycompany.myapp.service.ReasonService;
import com.mycompany.myapp.service.dto.ReasonDTO;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Reason}.
 */
@RestController
@RequestMapping("/api/reasons")
public class ReasonResource {

    private final Logger log = LoggerFactory.getLogger(ReasonResource.class);

    private static final String ENTITY_NAME = "rdComplaintReason";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ReasonService reasonService;

    private final ReasonRepository reasonRepository;

    public ReasonResource(ReasonService reasonService, ReasonRepository reasonRepository) {
        this.reasonService = reasonService;
        this.reasonRepository = reasonRepository;
    }

    /**
     * {@code POST  /reasons} : Create a new reason.
     *
     * @param reasonDTO the reasonDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new reasonDTO, or with status {@code 400 (Bad Request)} if the reason has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ReasonDTO> createReason(@RequestBody ReasonDTO reasonDTO) throws URISyntaxException {
        log.debug("REST request to save Reason : {}", reasonDTO);
        if (reasonDTO.getId() != null) {
            throw new BadRequestAlertException("A new reason cannot already have an ID", ENTITY_NAME, "idexists");
        }
        reasonDTO = reasonService.save(reasonDTO);
        return ResponseEntity.created(new URI("/api/reasons/" + reasonDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, reasonDTO.getId().toString()))
            .body(reasonDTO);
    }

    /**
     * {@code PUT  /reasons/:id} : Updates an existing reason.
     *
     * @param id the id of the reasonDTO to save.
     * @param reasonDTO the reasonDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reasonDTO,
     * or with status {@code 400 (Bad Request)} if the reasonDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the reasonDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReasonDTO> updateReason(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReasonDTO reasonDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Reason : {}, {}", id, reasonDTO);
        if (reasonDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reasonDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reasonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        reasonDTO = reasonService.update(reasonDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reasonDTO.getId().toString()))
            .body(reasonDTO);
    }

    /**
     * {@code PATCH  /reasons/:id} : Partial updates given fields of an existing reason, field will ignore if it is null
     *
     * @param id the id of the reasonDTO to save.
     * @param reasonDTO the reasonDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated reasonDTO,
     * or with status {@code 400 (Bad Request)} if the reasonDTO is not valid,
     * or with status {@code 404 (Not Found)} if the reasonDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the reasonDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ReasonDTO> partialUpdateReason(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ReasonDTO reasonDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Reason partially : {}, {}", id, reasonDTO);
        if (reasonDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, reasonDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!reasonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ReasonDTO> result = reasonService.partialUpdate(reasonDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, reasonDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /reasons} : get all the reasons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of reasons in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ReasonDTO>> getAllReasons(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Reasons");
        Page<ReasonDTO> page = reasonService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /reasons/:id} : get the "id" reason.
     *
     * @param id the id of the reasonDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the reasonDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReasonDTO> getReason(@PathVariable("id") Long id) {
        log.debug("REST request to get Reason : {}", id);
        Optional<ReasonDTO> reasonDTO = reasonService.findOne(id);
        return ResponseUtil.wrapOrNotFound(reasonDTO);
    }

    /**
     * {@code DELETE  /reasons/:id} : delete the "id" reason.
     *
     * @param id the id of the reasonDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReason(@PathVariable("id") Long id) {
        log.debug("REST request to delete Reason : {}", id);
        reasonService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
