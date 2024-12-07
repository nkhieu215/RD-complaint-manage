package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ComplaintListAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ComplaintList;
import com.mycompany.myapp.repository.ComplaintListRepository;
import com.mycompany.myapp.service.dto.ComplaintListDTO;
import com.mycompany.myapp.service.mapper.ComplaintListMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ComplaintListResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ComplaintListResourceIT {

    private static final String DEFAULT_PRODUCT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LOT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_LOT_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_BRANCH = "AAAAAAAAAA";
    private static final String UPDATED_BRANCH = "BBBBBBBBBB";

    private static final Long DEFAULT_REFLECTOR_ID = 1L;
    private static final Long UPDATED_REFLECTOR_ID = 2L;

    private static final Integer DEFAULT_TOTAL_ERRORS = 1;
    private static final Integer UPDATED_TOTAL_ERRORS = 2;

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final ZonedDateTime DEFAULT_PRODUCTION_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_PRODUCTION_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_DAPARTMENT_ID = 1L;
    private static final Long UPDATED_DAPARTMENT_ID = 2L;

    private static final Long DEFAULT_CHECK_BY_ID = 1L;
    private static final Long UPDATED_CHECK_BY_ID = 2L;

    private static final ZonedDateTime DEFAULT_RECTIFICATION_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_RECTIFICATION_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_COMPLAINT_DETAIL = "AAAAAAAAAA";
    private static final String UPDATED_COMPLAINT_DETAIL = "BBBBBBBBBB";

    private static final Long DEFAULT_UNIT_OF_USE_ID = 1L;
    private static final Long UPDATED_UNIT_OF_USE_ID = 2L;

    private static final Long DEFAULT_IMPLEMENTATION_RESULT_ID = 1L;
    private static final Long UPDATED_IMPLEMENTATION_RESULT_ID = 2L;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final String DEFAULT_FOLLOW_UP_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_FOLLOW_UP_COMMENT = "BBBBBBBBBB";

    private static final Long DEFAULT_COMPLAINT_ID = 1L;
    private static final Long UPDATED_COMPLAINT_ID = 2L;

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_SERIAL = "AAAAAAAAAA";
    private static final String UPDATED_SERIAL = "BBBBBBBBBB";

    private static final String DEFAULT_MAC_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_MAC_ADDRESS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/complaint-lists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ComplaintListRepository complaintListRepository;

    @Autowired
    private ComplaintListMapper complaintListMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restComplaintListMockMvc;

    private ComplaintList complaintList;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ComplaintList createEntity(EntityManager em) {
        ComplaintList complaintList = new ComplaintList()
            .product_code(DEFAULT_PRODUCT_CODE)
            .product_name(DEFAULT_PRODUCT_NAME)
            .lot_number(DEFAULT_LOT_NUMBER)
            .branch(DEFAULT_BRANCH)
            .reflector_id(DEFAULT_REFLECTOR_ID)
            .total_errors(DEFAULT_TOTAL_ERRORS)
            .quantity(DEFAULT_QUANTITY)
            .production_time(DEFAULT_PRODUCTION_TIME)
            .dapartment_id(DEFAULT_DAPARTMENT_ID)
            .check_by_id(DEFAULT_CHECK_BY_ID)
            .rectification_time(DEFAULT_RECTIFICATION_TIME)
            .create_by(DEFAULT_CREATE_BY)
            .status(DEFAULT_STATUS)
            .complaint_detail(DEFAULT_COMPLAINT_DETAIL)
            .unit_of_use_id(DEFAULT_UNIT_OF_USE_ID)
            .implementation_result_id(DEFAULT_IMPLEMENTATION_RESULT_ID)
            .comment(DEFAULT_COMMENT)
            .follow_up_comment(DEFAULT_FOLLOW_UP_COMMENT)
            .complaint_id(DEFAULT_COMPLAINT_ID)
            .created_at(DEFAULT_CREATED_AT)
            .updated_at(DEFAULT_UPDATED_AT)
            .serial(DEFAULT_SERIAL)
            .mac_address(DEFAULT_MAC_ADDRESS);
        return complaintList;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ComplaintList createUpdatedEntity(EntityManager em) {
        ComplaintList complaintList = new ComplaintList()
            .product_code(UPDATED_PRODUCT_CODE)
            .product_name(UPDATED_PRODUCT_NAME)
            .lot_number(UPDATED_LOT_NUMBER)
            .branch(UPDATED_BRANCH)
            .reflector_id(UPDATED_REFLECTOR_ID)
            .total_errors(UPDATED_TOTAL_ERRORS)
            .quantity(UPDATED_QUANTITY)
            .production_time(UPDATED_PRODUCTION_TIME)
            .dapartment_id(UPDATED_DAPARTMENT_ID)
            .check_by_id(UPDATED_CHECK_BY_ID)
            .rectification_time(UPDATED_RECTIFICATION_TIME)
            .create_by(UPDATED_CREATE_BY)
            .status(UPDATED_STATUS)
            .complaint_detail(UPDATED_COMPLAINT_DETAIL)
            .unit_of_use_id(UPDATED_UNIT_OF_USE_ID)
            .implementation_result_id(UPDATED_IMPLEMENTATION_RESULT_ID)
            .comment(UPDATED_COMMENT)
            .follow_up_comment(UPDATED_FOLLOW_UP_COMMENT)
            .complaint_id(UPDATED_COMPLAINT_ID)
            .created_at(UPDATED_CREATED_AT)
            .updated_at(UPDATED_UPDATED_AT)
            .serial(UPDATED_SERIAL)
            .mac_address(UPDATED_MAC_ADDRESS);
        return complaintList;
    }

    @BeforeEach
    public void initTest() {
        complaintList = createEntity(em);
    }

    @Test
    @Transactional
    void createComplaintList() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ComplaintList
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);
        var returnedComplaintListDTO = om.readValue(
            restComplaintListMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(complaintListDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ComplaintListDTO.class
        );

        // Validate the ComplaintList in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedComplaintList = complaintListMapper.toEntity(returnedComplaintListDTO);
        assertComplaintListUpdatableFieldsEquals(returnedComplaintList, getPersistedComplaintList(returnedComplaintList));
    }

    @Test
    @Transactional
    void createComplaintListWithExistingId() throws Exception {
        // Create the ComplaintList with an existing ID
        complaintList.setId(1L);
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restComplaintListMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllComplaintLists() throws Exception {
        // Initialize the database
        complaintListRepository.saveAndFlush(complaintList);

        // Get all the complaintListList
        restComplaintListMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(complaintList.getId().intValue())))
            .andExpect(jsonPath("$.[*].product_code").value(hasItem(DEFAULT_PRODUCT_CODE)))
            .andExpect(jsonPath("$.[*].product_name").value(hasItem(DEFAULT_PRODUCT_NAME)))
            .andExpect(jsonPath("$.[*].lot_number").value(hasItem(DEFAULT_LOT_NUMBER)))
            .andExpect(jsonPath("$.[*].branch").value(hasItem(DEFAULT_BRANCH)))
            .andExpect(jsonPath("$.[*].reflector_id").value(hasItem(DEFAULT_REFLECTOR_ID.intValue())))
            .andExpect(jsonPath("$.[*].total_errors").value(hasItem(DEFAULT_TOTAL_ERRORS)))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].production_time").value(hasItem(sameInstant(DEFAULT_PRODUCTION_TIME))))
            .andExpect(jsonPath("$.[*].dapartment_id").value(hasItem(DEFAULT_DAPARTMENT_ID.intValue())))
            .andExpect(jsonPath("$.[*].check_by_id").value(hasItem(DEFAULT_CHECK_BY_ID.intValue())))
            .andExpect(jsonPath("$.[*].rectification_time").value(hasItem(sameInstant(DEFAULT_RECTIFICATION_TIME))))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].complaint_detail").value(hasItem(DEFAULT_COMPLAINT_DETAIL)))
            .andExpect(jsonPath("$.[*].unit_of_use_id").value(hasItem(DEFAULT_UNIT_OF_USE_ID.intValue())))
            .andExpect(jsonPath("$.[*].implementation_result_id").value(hasItem(DEFAULT_IMPLEMENTATION_RESULT_ID.intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].follow_up_comment").value(hasItem(DEFAULT_FOLLOW_UP_COMMENT)))
            .andExpect(jsonPath("$.[*].complaint_id").value(hasItem(DEFAULT_COMPLAINT_ID.intValue())))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updated_at").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].serial").value(hasItem(DEFAULT_SERIAL)))
            .andExpect(jsonPath("$.[*].mac_address").value(hasItem(DEFAULT_MAC_ADDRESS)));
    }

    @Test
    @Transactional
    void getComplaintList() throws Exception {
        // Initialize the database
        complaintListRepository.saveAndFlush(complaintList);

        // Get the complaintList
        restComplaintListMockMvc
            .perform(get(ENTITY_API_URL_ID, complaintList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(complaintList.getId().intValue()))
            .andExpect(jsonPath("$.product_code").value(DEFAULT_PRODUCT_CODE))
            .andExpect(jsonPath("$.product_name").value(DEFAULT_PRODUCT_NAME))
            .andExpect(jsonPath("$.lot_number").value(DEFAULT_LOT_NUMBER))
            .andExpect(jsonPath("$.branch").value(DEFAULT_BRANCH))
            .andExpect(jsonPath("$.reflector_id").value(DEFAULT_REFLECTOR_ID.intValue()))
            .andExpect(jsonPath("$.total_errors").value(DEFAULT_TOTAL_ERRORS))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.production_time").value(sameInstant(DEFAULT_PRODUCTION_TIME)))
            .andExpect(jsonPath("$.dapartment_id").value(DEFAULT_DAPARTMENT_ID.intValue()))
            .andExpect(jsonPath("$.check_by_id").value(DEFAULT_CHECK_BY_ID.intValue()))
            .andExpect(jsonPath("$.rectification_time").value(sameInstant(DEFAULT_RECTIFICATION_TIME)))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.complaint_detail").value(DEFAULT_COMPLAINT_DETAIL))
            .andExpect(jsonPath("$.unit_of_use_id").value(DEFAULT_UNIT_OF_USE_ID.intValue()))
            .andExpect(jsonPath("$.implementation_result_id").value(DEFAULT_IMPLEMENTATION_RESULT_ID.intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.follow_up_comment").value(DEFAULT_FOLLOW_UP_COMMENT))
            .andExpect(jsonPath("$.complaint_id").value(DEFAULT_COMPLAINT_ID.intValue()))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updated_at").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.serial").value(DEFAULT_SERIAL))
            .andExpect(jsonPath("$.mac_address").value(DEFAULT_MAC_ADDRESS));
    }

    @Test
    @Transactional
    void getNonExistingComplaintList() throws Exception {
        // Get the complaintList
        restComplaintListMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingComplaintList() throws Exception {
        // Initialize the database
        complaintListRepository.saveAndFlush(complaintList);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaintList
        ComplaintList updatedComplaintList = complaintListRepository.findById(complaintList.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedComplaintList are not directly saved in db
        em.detach(updatedComplaintList);
        updatedComplaintList
            .product_code(UPDATED_PRODUCT_CODE)
            .product_name(UPDATED_PRODUCT_NAME)
            .lot_number(UPDATED_LOT_NUMBER)
            .branch(UPDATED_BRANCH)
            .reflector_id(UPDATED_REFLECTOR_ID)
            .total_errors(UPDATED_TOTAL_ERRORS)
            .quantity(UPDATED_QUANTITY)
            .production_time(UPDATED_PRODUCTION_TIME)
            .dapartment_id(UPDATED_DAPARTMENT_ID)
            .check_by_id(UPDATED_CHECK_BY_ID)
            .rectification_time(UPDATED_RECTIFICATION_TIME)
            .create_by(UPDATED_CREATE_BY)
            .status(UPDATED_STATUS)
            .complaint_detail(UPDATED_COMPLAINT_DETAIL)
            .unit_of_use_id(UPDATED_UNIT_OF_USE_ID)
            .implementation_result_id(UPDATED_IMPLEMENTATION_RESULT_ID)
            .comment(UPDATED_COMMENT)
            .follow_up_comment(UPDATED_FOLLOW_UP_COMMENT)
            .complaint_id(UPDATED_COMPLAINT_ID)
            .created_at(UPDATED_CREATED_AT)
            .updated_at(UPDATED_UPDATED_AT)
            .serial(UPDATED_SERIAL)
            .mac_address(UPDATED_MAC_ADDRESS);
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(updatedComplaintList);

        restComplaintListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, complaintListDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isOk());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedComplaintListToMatchAllProperties(updatedComplaintList);
    }

    @Test
    @Transactional
    void putNonExistingComplaintList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintList.setId(longCount.incrementAndGet());

        // Create the ComplaintList
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComplaintListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, complaintListDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchComplaintList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintList.setId(longCount.incrementAndGet());

        // Create the ComplaintList
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamComplaintList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintList.setId(longCount.incrementAndGet());

        // Create the ComplaintList
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintListMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateComplaintListWithPatch() throws Exception {
        // Initialize the database
        complaintListRepository.saveAndFlush(complaintList);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaintList using partial update
        ComplaintList partialUpdatedComplaintList = new ComplaintList();
        partialUpdatedComplaintList.setId(complaintList.getId());

        partialUpdatedComplaintList
            .lot_number(UPDATED_LOT_NUMBER)
            .dapartment_id(UPDATED_DAPARTMENT_ID)
            .check_by_id(UPDATED_CHECK_BY_ID)
            .create_by(UPDATED_CREATE_BY)
            .complaint_detail(UPDATED_COMPLAINT_DETAIL)
            .implementation_result_id(UPDATED_IMPLEMENTATION_RESULT_ID)
            .follow_up_comment(UPDATED_FOLLOW_UP_COMMENT)
            .complaint_id(UPDATED_COMPLAINT_ID)
            .created_at(UPDATED_CREATED_AT)
            .updated_at(UPDATED_UPDATED_AT)
            .serial(UPDATED_SERIAL);

        restComplaintListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComplaintList.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedComplaintList))
            )
            .andExpect(status().isOk());

        // Validate the ComplaintList in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertComplaintListUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedComplaintList, complaintList),
            getPersistedComplaintList(complaintList)
        );
    }

    @Test
    @Transactional
    void fullUpdateComplaintListWithPatch() throws Exception {
        // Initialize the database
        complaintListRepository.saveAndFlush(complaintList);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaintList using partial update
        ComplaintList partialUpdatedComplaintList = new ComplaintList();
        partialUpdatedComplaintList.setId(complaintList.getId());

        partialUpdatedComplaintList
            .product_code(UPDATED_PRODUCT_CODE)
            .product_name(UPDATED_PRODUCT_NAME)
            .lot_number(UPDATED_LOT_NUMBER)
            .branch(UPDATED_BRANCH)
            .reflector_id(UPDATED_REFLECTOR_ID)
            .total_errors(UPDATED_TOTAL_ERRORS)
            .quantity(UPDATED_QUANTITY)
            .production_time(UPDATED_PRODUCTION_TIME)
            .dapartment_id(UPDATED_DAPARTMENT_ID)
            .check_by_id(UPDATED_CHECK_BY_ID)
            .rectification_time(UPDATED_RECTIFICATION_TIME)
            .create_by(UPDATED_CREATE_BY)
            .status(UPDATED_STATUS)
            .complaint_detail(UPDATED_COMPLAINT_DETAIL)
            .unit_of_use_id(UPDATED_UNIT_OF_USE_ID)
            .implementation_result_id(UPDATED_IMPLEMENTATION_RESULT_ID)
            .comment(UPDATED_COMMENT)
            .follow_up_comment(UPDATED_FOLLOW_UP_COMMENT)
            .complaint_id(UPDATED_COMPLAINT_ID)
            .created_at(UPDATED_CREATED_AT)
            .updated_at(UPDATED_UPDATED_AT)
            .serial(UPDATED_SERIAL)
            .mac_address(UPDATED_MAC_ADDRESS);

        restComplaintListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComplaintList.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedComplaintList))
            )
            .andExpect(status().isOk());

        // Validate the ComplaintList in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertComplaintListUpdatableFieldsEquals(partialUpdatedComplaintList, getPersistedComplaintList(partialUpdatedComplaintList));
    }

    @Test
    @Transactional
    void patchNonExistingComplaintList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintList.setId(longCount.incrementAndGet());

        // Create the ComplaintList
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComplaintListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, complaintListDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchComplaintList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintList.setId(longCount.incrementAndGet());

        // Create the ComplaintList
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamComplaintList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintList.setId(longCount.incrementAndGet());

        // Create the ComplaintList
        ComplaintListDTO complaintListDTO = complaintListMapper.toDto(complaintList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintListMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintListDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ComplaintList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteComplaintList() throws Exception {
        // Initialize the database
        complaintListRepository.saveAndFlush(complaintList);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the complaintList
        restComplaintListMockMvc
            .perform(delete(ENTITY_API_URL_ID, complaintList.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return complaintListRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ComplaintList getPersistedComplaintList(ComplaintList complaintList) {
        return complaintListRepository.findById(complaintList.getId()).orElseThrow();
    }

    protected void assertPersistedComplaintListToMatchAllProperties(ComplaintList expectedComplaintList) {
        assertComplaintListAllPropertiesEquals(expectedComplaintList, getPersistedComplaintList(expectedComplaintList));
    }

    protected void assertPersistedComplaintListToMatchUpdatableProperties(ComplaintList expectedComplaintList) {
        assertComplaintListAllUpdatablePropertiesEquals(expectedComplaintList, getPersistedComplaintList(expectedComplaintList));
    }
}
