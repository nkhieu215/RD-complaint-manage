package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ComplaintList;
import com.mycompany.myapp.repository.*;
import com.mycompany.myapp.service.ComplaintListService;
import com.mycompany.myapp.service.dto.BodyDTO;
import com.mycompany.myapp.service.dto.ComplaintListDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import java.io.*;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ComplaintList}.
 */
@RestController
@RequestMapping("/api/complaint-lists")
public class ComplaintListResource {
    private final String FOLDER_PATH ="D:/RangDongProject/RD-complaint/RD-complaint-manage/microservice-with-jhipster-vers-8.2-production/rd_complaint_gateway/src/main/webapp/content/images/ErrorImage/";
    @Autowired
    ResourceLoader resourceLoader;
    private final Logger log = LoggerFactory.getLogger(ComplaintListResource.class);

    private static final String ENTITY_NAME = "rdComplaintComplaintList";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ComplaintListService complaintListService;

    private final ComplaintListRepository complaintListRepository;
    private final CheckerListRepository checkerListRepository;
    private final ReflectorRepository reflectorRepository;
    private final DepartmentRepository departmentRepository;
    private final UnitOfUseRepository unitOfUseRepository;
    private final ImplementationResultRepository implementationResultRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintStatusRepository complaintStatusRepository;
    private final ListOfErrorRepository listOfErrorRepository;
    private final ReasonRepository reasonRepository;
    private final ErrorListRepository errorListRepository;
    private final ItemRepository itemRepository;


    public ComplaintListResource(ComplaintListService complaintListService,
                                 ComplaintListRepository complaintListRepository,
                                 CheckerListRepository checkerListRepository,
                                 ReflectorRepository reflectorRepository,
                                 DepartmentRepository departmentRepository,
                                 UnitOfUseRepository unitOfUseRepository,
                                 ImplementationResultRepository implementationResultRepository,
                                 ComplaintRepository complaintRepository,
                                 ComplaintStatusRepository complaintStatusRepository,
                                 ListOfErrorRepository listOfErrorRepository,
                                 ReasonRepository reasonRepository, ErrorListRepository errorListRepository, ItemRepository itemRepository) {
        this.complaintListService = complaintListService;
        this.complaintListRepository = complaintListRepository;
        this.checkerListRepository = checkerListRepository;
        this.reflectorRepository = reflectorRepository;
        this.departmentRepository = departmentRepository;
        this.unitOfUseRepository = unitOfUseRepository;
        this.implementationResultRepository = implementationResultRepository;
        this.complaintRepository = complaintRepository;
        this.complaintStatusRepository = complaintStatusRepository;
        this.listOfErrorRepository = listOfErrorRepository;
        this.reasonRepository = reasonRepository;
        this.errorListRepository = errorListRepository;
        this.itemRepository = itemRepository;
    }

    /**
     * {@code POST  /complaint-lists} : Create a new complaintList.
     *
     * @param complaintListDTO the complaintListDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new complaintListDTO, or with status {@code 400 (Bad Request)} if the complaintList has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ComplaintListDTO> createComplaintList(@RequestBody ComplaintListDTO complaintListDTO) throws URISyntaxException {
        log.debug("REST request to save ComplaintList : {}", complaintListDTO);
        if (complaintListDTO.getId() != null) {
            throw new BadRequestAlertException("A new complaintList cannot already have an ID", ENTITY_NAME, "idexists");
        }
        complaintListDTO = complaintListService.save(complaintListDTO);
        return ResponseEntity.created(new URI("/api/complaint-lists/" + complaintListDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, complaintListDTO.getId().toString()))
            .body(complaintListDTO);
    }

    /**
     * {@code PUT  /complaint-lists/:id} : Updates an existing complaintList.
     *
     * @param id the id of the complaintListDTO to save.
     * @param complaintListDTO the complaintListDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated complaintListDTO,
     * or with status {@code 400 (Bad Request)} if the complaintListDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the complaintListDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ComplaintListDTO> updateComplaintList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ComplaintListDTO complaintListDTO
    ) throws URISyntaxException {
        log.debug("REST request to update ComplaintList : {}, {}", id, complaintListDTO);
        if (complaintListDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, complaintListDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!complaintListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        complaintListDTO = complaintListService.update(complaintListDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, complaintListDTO.getId().toString()))
            .body(complaintListDTO);
    }

    /**
     * {@code PATCH  /complaint-lists/:id} : Partial updates given fields of an existing complaintList, field will ignore if it is null
     *
     * @param id the id of the complaintListDTO to save.
     * @param complaintListDTO the complaintListDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated complaintListDTO,
     * or with status {@code 400 (Bad Request)} if the complaintListDTO is not valid,
     * or with status {@code 404 (Not Found)} if the complaintListDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the complaintListDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ComplaintListDTO> partialUpdateComplaintList(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ComplaintListDTO complaintListDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update ComplaintList partially : {}, {}", id, complaintListDTO);
        if (complaintListDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, complaintListDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!complaintListRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ComplaintListDTO> result = complaintListService.partialUpdate(complaintListDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, complaintListDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /complaint-lists} : get all the complaintLists.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of complaintLists in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ComplaintListDTO>> getAllComplaintLists(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ComplaintLists");
        Page<ComplaintListDTO> page = complaintListService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /complaint-lists/:id} : get the "id" complaintList.
     *
     * @param id the id of the complaintListDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the complaintListDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ComplaintListDTO> getComplaintList(@PathVariable("id") Long id) {
        log.debug("REST request to get ComplaintList : {}", id);
        Optional<ComplaintListDTO> complaintListDTO = complaintListService.findOne(id);
        return ResponseUtil.wrapOrNotFound(complaintListDTO);
    }
//    @GetMapping("/{id}")
//    public ComplaintListDTO getComplaintList(@PathVariable("id") Long id) {
//        log.debug("REST request to get ComplaintList : {}", id);
////        Optional<ComplaintListDTO> complaintListDTO = complaintListService.findOne(id);
//        return null;
//    }
    /**
     * {@code DELETE  /complaint-lists/:id} : delete the "id" complaintList.
     *
     * @param id the id of the complaintListDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplaintList(@PathVariable("id") Long id) {
        log.debug("REST request to delete ComplaintList : {}", id);
        complaintListService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
    @GetMapping("/get-all")
    public BodyDTO getAllListComplaint(){
        BodyDTO bodyDTO = new BodyDTO();
        bodyDTO.setComplaintListResponseList(this.complaintListRepository.getAll());
        bodyDTO.setCheckerLists(this.checkerListRepository.findAll());
        bodyDTO.setReflectorList(this.reflectorRepository.findAll());
        bodyDTO.setDepartmentList(this.departmentRepository.findAll());
        bodyDTO.setUnitOfUseList(this.unitOfUseRepository.findAll());
        bodyDTO.setImplementationResultList(this.implementationResultRepository.findAll());
        bodyDTO.setComplaintList(this.complaintRepository.findAll());
        return bodyDTO;
    }
    @PostMapping("insert")
    public void saveDataComplaint(@RequestBody List<ComplaintList> complaintListDTOS){
        for (ComplaintList complaintListDTO:complaintListDTOS){
            this.complaintListRepository.save(complaintListDTO);
        }
    }
    @GetMapping("get-guide-list-insert")
    public BodyDTO getGuideListInsert(){
        BodyDTO bodyDTO = new BodyDTO();
        bodyDTO.setReflectorList(this.reflectorRepository.findAll());
        bodyDTO.setComplaintList(this.complaintRepository.findAll());
        bodyDTO.setUnitOfUseList(this.unitOfUseRepository.findAll());
        bodyDTO.setItemList(this.itemRepository.findAll());
        return bodyDTO;
    }
    @GetMapping("/report")
    public void download(HttpServletResponse response) {

        try {
          Resource resouce = resourceLoader.getResource("classpath:test.xlsx");
            InputStream is = resouce.getInputStream();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(is));
            StringBuilder stringBuilder = new StringBuilder();
    String line;
            while ((line = bufferedReader.readLine()) != null){
                stringBuilder.append(line);
            }
            is.close();
        } catch (Exception e) {
            System.out.println("errror");
        }
    }
    @GetMapping("/error-detail/{id}")
    public BodyDTO getErrorDetail(@PathVariable Long id){
        BodyDTO bodyDTO = new BodyDTO();
        ComplaintList response =this.complaintListRepository.findById(id).orElse(null);
        bodyDTO.setComplaintListDTOById(response);
        bodyDTO.setCheckerLists(this.checkerListRepository.findAll());
        bodyDTO.setComplaintStatusList(this.complaintStatusRepository.findAll());
        bodyDTO.setReflectorList(this.reflectorRepository.findAll());
        bodyDTO.setDepartmentList(this.departmentRepository.findAll());
        bodyDTO.setUnitOfUseList(this.unitOfUseRepository.findAll());
        bodyDTO.setImplementationResultList(this.implementationResultRepository.findAll());
        bodyDTO.setComplaintList(this.complaintRepository.findAll());
        bodyDTO.setReasonList(this.reasonRepository.findAll());
        bodyDTO.setListOfErrorList(this.listOfErrorRepository.getByComplaintId(id));
        bodyDTO.setErrorLists(this.errorListRepository.findAll());
        return bodyDTO;
    }
    @PostMapping("update")
    public void updateDataComplaint(@RequestBody ComplaintList complaintListDTOS){
        this.complaintListRepository.save(complaintListDTOS);
    }
    @PostMapping("/uploadImage")
    public String uploadImage(@RequestParam("file") MultipartFile imageFile)throws IOException{
        String returnValue ="";
        String filePath = FOLDER_PATH+imageFile.getOriginalFilename();
        imageFile.transferTo(new File(filePath));
        System.out.println("upload image: "+ imageFile.getOriginalFilename() + "-----"+ imageFile.getName());
        return returnValue;
    }
}
