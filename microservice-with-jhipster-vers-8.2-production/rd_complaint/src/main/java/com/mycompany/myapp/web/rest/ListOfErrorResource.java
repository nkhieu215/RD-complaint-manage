package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ListOfError;
import com.mycompany.myapp.domain.Reason;
import com.mycompany.myapp.repository.ListOfErrorRepository;
import com.mycompany.myapp.repository.ReasonRepository;
import com.mycompany.myapp.service.ListOfErrorService;
import com.mycompany.myapp.service.dto.ListOfErrorDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.ListOfError}.
 */
@RestController
@RequestMapping("/api/list-of-errors")
public class ListOfErrorResource {

    private final Logger log = LoggerFactory.getLogger(ListOfErrorResource.class);

    private static final String ENTITY_NAME = "rdComplaintListOfError";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ListOfErrorService listOfErrorService;

    private final ListOfErrorRepository listOfErrorRepository;
    private final ReasonRepository reasonRepository;

    public ListOfErrorResource(ListOfErrorService listOfErrorService, ListOfErrorRepository listOfErrorRepository, ReasonRepository reasonRepository) {
        this.listOfErrorService = listOfErrorService;
        this.listOfErrorRepository = listOfErrorRepository;
        this.reasonRepository = reasonRepository;
    }

    /**
     * {@code POST  /list-of-errors} : Create a new listOfError.
     *
     * @param listOfErrorDTO the listOfErrorDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new listOfErrorDTO, or with status {@code 400 (Bad Request)} if the listOfError has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ListOfErrorDTO> createListOfError(@RequestBody ListOfErrorDTO listOfErrorDTO) throws URISyntaxException {
        log.debug("REST request to save ListOfError : {}", listOfErrorDTO);
        if (listOfErrorDTO.getId() != null) {
            throw new BadRequestAlertException("A new listOfError cannot already have an ID", ENTITY_NAME, "idexists");
        }
        listOfErrorDTO = listOfErrorService.save(listOfErrorDTO);
        return ResponseEntity.created(new URI("/api/list-of-errors/" + listOfErrorDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, listOfErrorDTO.getId().toString()))
            .body(listOfErrorDTO);
    }

    /**
     * {@code PUT  /list-of-errors/:id} : Updates an existing listOfError.
     *
     * @param id the id of the listOfErrorDTO to save.
     * @param listOfErrorDTO the listOfErrorDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listOfErrorDTO,
     * or with status {@code 400 (Bad Request)} if the listOfErrorDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the listOfErrorDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ListOfErrorDTO> updateListOfError(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ListOfErrorDTO listOfErrorDTO
    ) throws URISyntaxException {
        log.debug("REST request to update ListOfError : {}, {}", id, listOfErrorDTO);
        if (listOfErrorDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listOfErrorDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listOfErrorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        listOfErrorDTO = listOfErrorService.update(listOfErrorDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, listOfErrorDTO.getId().toString()))
            .body(listOfErrorDTO);
    }

    /**
     * {@code PATCH  /list-of-errors/:id} : Partial updates given fields of an existing listOfError, field will ignore if it is null
     *
     * @param id the id of the listOfErrorDTO to save.
     * @param listOfErrorDTO the listOfErrorDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated listOfErrorDTO,
     * or with status {@code 400 (Bad Request)} if the listOfErrorDTO is not valid,
     * or with status {@code 404 (Not Found)} if the listOfErrorDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the listOfErrorDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ListOfErrorDTO> partialUpdateListOfError(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ListOfErrorDTO listOfErrorDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update ListOfError partially : {}, {}", id, listOfErrorDTO);
        if (listOfErrorDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, listOfErrorDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!listOfErrorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ListOfErrorDTO> result = listOfErrorService.partialUpdate(listOfErrorDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, listOfErrorDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /list-of-errors} : get all the listOfErrors.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of listOfErrors in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ListOfErrorDTO>> getAllListOfErrors(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ListOfErrors");
        Page<ListOfErrorDTO> page = listOfErrorService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /list-of-errors/:id} : get the "id" listOfError.
     *
     * @param id the id of the listOfErrorDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the listOfErrorDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListOfErrorDTO> getListOfError(@PathVariable("id") Long id) {
        log.debug("REST request to get ListOfError : {}", id);
        Optional<ListOfErrorDTO> listOfErrorDTO = listOfErrorService.findOne(id);
        return ResponseUtil.wrapOrNotFound(listOfErrorDTO);
    }

    /**
     * {@code DELETE  /list-of-errors/:id} : delete the "id" listOfError.
     *
     * @param id the id of the listOfErrorDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteListOfError(@PathVariable("id") Long id) {
        log.debug("REST request to delete ListOfError : {}", id);
        listOfErrorService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
    @PostMapping("insert-update")
    public void updateListOfError(@RequestBody List<ListOfErrorDTO> requests){
        for (ListOfErrorDTO request:requests){
            ListOfError error = new ListOfError();
            error.setId(request.getId());
            error.setError_code(request.getError_code());
            error.setError_name(request.getError_name());
            error.setError_source(request.getError_source());
            error.setQuantity(request.getQuantity());
            error.setMethod(request.getMethod());
            error.setCheck_by_id(request.getCheck_by_id());
            error.setCreate_by(request.getCreate_by());
            error.setImage(request.getImage());
            error.setCreated_at(request.getCreated_at());
            error.setUpdated_at(request.getUpdated_at());
            error.setCheck_time(request.getCheck_time());
            error.setComplaint_id(request.getComplaint_id());
            error.setLot_number(request.getLot_number());
            error.setSerial(request.getSerial());
            error.setMac_address(request.getMac_address());
            if(request.getReason_id() == null){
                Reason reason = new Reason();
                reason.setCreate_by(request.getCheck_by());
                reason.setCreated_at(request.getCreated_at());
                reason.setName(request.getReason());
                this.reasonRepository.save(reason);
                error.setReason_id(reason.getId());
                this.listOfErrorRepository.save(error);
            }else{
                error.setReason_id(request.getId());
                this.listOfErrorRepository.save(error);
            }
        }
    }
}
