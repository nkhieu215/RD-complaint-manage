package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ListOfErrorAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ListOfError;
import com.mycompany.myapp.repository.ListOfErrorRepository;
import com.mycompany.myapp.service.dto.ListOfErrorDTO;
import com.mycompany.myapp.service.mapper.ListOfErrorMapper;
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
 * Integration tests for the {@link ListOfErrorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ListOfErrorResourceIT {

    private static final String DEFAULT_ERROR_CODE = "AAAAAAAAAA";
    private static final String UPDATED_ERROR_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_ERROR_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ERROR_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String DEFAULT_ERROR_SOURCE = "AAAAAAAAAA";
    private static final String UPDATED_ERROR_SOURCE = "BBBBBBBBBB";

    private static final Long DEFAULT_REASON_ID = 1L;
    private static final Long UPDATED_REASON_ID = 2L;

    private static final String DEFAULT_METHOD = "AAAAAAAAAA";
    private static final String UPDATED_METHOD = "BBBBBBBBBB";

    private static final Long DEFAULT_CHECK_BY_ID = 1L;
    private static final Long UPDATED_CHECK_BY_ID = 2L;

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CHECK_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CHECK_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Long DEFAULT_COMPLAINT_ID = 1L;
    private static final Long UPDATED_COMPLAINT_ID = 2L;

    private static final String ENTITY_API_URL = "/api/list-of-errors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ListOfErrorRepository listOfErrorRepository;

    @Autowired
    private ListOfErrorMapper listOfErrorMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restListOfErrorMockMvc;

    private ListOfError listOfError;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ListOfError createEntity(EntityManager em) {
        ListOfError listOfError = new ListOfError()
            .error_code(DEFAULT_ERROR_CODE)
            .error_name(DEFAULT_ERROR_NAME)
            .quantity(DEFAULT_QUANTITY)
            .error_source(DEFAULT_ERROR_SOURCE)
            .reason_id(DEFAULT_REASON_ID)
            .method(DEFAULT_METHOD)
            .check_by_id(DEFAULT_CHECK_BY_ID)
            .create_by(DEFAULT_CREATE_BY)
            .image(DEFAULT_IMAGE)
            .created_at(DEFAULT_CREATED_AT)
            .updated_at(DEFAULT_UPDATED_AT)
            .check_time(DEFAULT_CHECK_TIME)
            .complaint_id(DEFAULT_COMPLAINT_ID);
        return listOfError;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ListOfError createUpdatedEntity(EntityManager em) {
        ListOfError listOfError = new ListOfError()
            .error_code(UPDATED_ERROR_CODE)
            .error_name(UPDATED_ERROR_NAME)
            .quantity(UPDATED_QUANTITY)
            .error_source(UPDATED_ERROR_SOURCE)
            .reason_id(UPDATED_REASON_ID)
            .method(UPDATED_METHOD)
            .check_by_id(UPDATED_CHECK_BY_ID)
            .create_by(UPDATED_CREATE_BY)
            .image(UPDATED_IMAGE)
            .created_at(UPDATED_CREATED_AT)
            .updated_at(UPDATED_UPDATED_AT)
            .check_time(UPDATED_CHECK_TIME)
            .complaint_id(UPDATED_COMPLAINT_ID);
        return listOfError;
    }

    @BeforeEach
    public void initTest() {
        listOfError = createEntity(em);
    }

    @Test
    @Transactional
    void createListOfError() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ListOfError
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);
        var returnedListOfErrorDTO = om.readValue(
            restListOfErrorMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listOfErrorDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ListOfErrorDTO.class
        );

        // Validate the ListOfError in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedListOfError = listOfErrorMapper.toEntity(returnedListOfErrorDTO);
        assertListOfErrorUpdatableFieldsEquals(returnedListOfError, getPersistedListOfError(returnedListOfError));
    }

    @Test
    @Transactional
    void createListOfErrorWithExistingId() throws Exception {
        // Create the ListOfError with an existing ID
        listOfError.setId(1L);
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restListOfErrorMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listOfErrorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllListOfErrors() throws Exception {
        // Initialize the database
        listOfErrorRepository.saveAndFlush(listOfError);

        // Get all the listOfErrorList
        restListOfErrorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(listOfError.getId().intValue())))
            .andExpect(jsonPath("$.[*].error_code").value(hasItem(DEFAULT_ERROR_CODE)))
            .andExpect(jsonPath("$.[*].error_name").value(hasItem(DEFAULT_ERROR_NAME)))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].error_source").value(hasItem(DEFAULT_ERROR_SOURCE)))
            .andExpect(jsonPath("$.[*].reason_id").value(hasItem(DEFAULT_REASON_ID.intValue())))
            .andExpect(jsonPath("$.[*].method").value(hasItem(DEFAULT_METHOD)))
            .andExpect(jsonPath("$.[*].check_by_id").value(hasItem(DEFAULT_CHECK_BY_ID.intValue())))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updated_at").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))))
            .andExpect(jsonPath("$.[*].check_time").value(hasItem(sameInstant(DEFAULT_CHECK_TIME))))
            .andExpect(jsonPath("$.[*].complaint_id").value(hasItem(DEFAULT_COMPLAINT_ID.intValue())));
    }

    @Test
    @Transactional
    void getListOfError() throws Exception {
        // Initialize the database
        listOfErrorRepository.saveAndFlush(listOfError);

        // Get the listOfError
        restListOfErrorMockMvc
            .perform(get(ENTITY_API_URL_ID, listOfError.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(listOfError.getId().intValue()))
            .andExpect(jsonPath("$.error_code").value(DEFAULT_ERROR_CODE))
            .andExpect(jsonPath("$.error_name").value(DEFAULT_ERROR_NAME))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.error_source").value(DEFAULT_ERROR_SOURCE))
            .andExpect(jsonPath("$.reason_id").value(DEFAULT_REASON_ID.intValue()))
            .andExpect(jsonPath("$.method").value(DEFAULT_METHOD))
            .andExpect(jsonPath("$.check_by_id").value(DEFAULT_CHECK_BY_ID.intValue()))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.image").value(DEFAULT_IMAGE))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updated_at").value(sameInstant(DEFAULT_UPDATED_AT)))
            .andExpect(jsonPath("$.check_time").value(sameInstant(DEFAULT_CHECK_TIME)))
            .andExpect(jsonPath("$.complaint_id").value(DEFAULT_COMPLAINT_ID.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingListOfError() throws Exception {
        // Get the listOfError
        restListOfErrorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingListOfError() throws Exception {
        // Initialize the database
        listOfErrorRepository.saveAndFlush(listOfError);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listOfError
        ListOfError updatedListOfError = listOfErrorRepository.findById(listOfError.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedListOfError are not directly saved in db
        em.detach(updatedListOfError);
        updatedListOfError
            .error_code(UPDATED_ERROR_CODE)
            .error_name(UPDATED_ERROR_NAME)
            .quantity(UPDATED_QUANTITY)
            .error_source(UPDATED_ERROR_SOURCE)
            .reason_id(UPDATED_REASON_ID)
            .method(UPDATED_METHOD)
            .check_by_id(UPDATED_CHECK_BY_ID)
            .create_by(UPDATED_CREATE_BY)
            .image(UPDATED_IMAGE)
            .created_at(UPDATED_CREATED_AT)
            .updated_at(UPDATED_UPDATED_AT)
            .check_time(UPDATED_CHECK_TIME)
            .complaint_id(UPDATED_COMPLAINT_ID);
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(updatedListOfError);

        restListOfErrorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, listOfErrorDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listOfErrorDTO))
            )
            .andExpect(status().isOk());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedListOfErrorToMatchAllProperties(updatedListOfError);
    }

    @Test
    @Transactional
    void putNonExistingListOfError() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listOfError.setId(longCount.incrementAndGet());

        // Create the ListOfError
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListOfErrorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, listOfErrorDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listOfErrorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchListOfError() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listOfError.setId(longCount.incrementAndGet());

        // Create the ListOfError
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListOfErrorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(listOfErrorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamListOfError() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listOfError.setId(longCount.incrementAndGet());

        // Create the ListOfError
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListOfErrorMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(listOfErrorDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateListOfErrorWithPatch() throws Exception {
        // Initialize the database
        listOfErrorRepository.saveAndFlush(listOfError);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listOfError using partial update
        ListOfError partialUpdatedListOfError = new ListOfError();
        partialUpdatedListOfError.setId(listOfError.getId());

        partialUpdatedListOfError.error_name(UPDATED_ERROR_NAME).reason_id(UPDATED_REASON_ID).method(UPDATED_METHOD).image(UPDATED_IMAGE);

        restListOfErrorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedListOfError.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedListOfError))
            )
            .andExpect(status().isOk());

        // Validate the ListOfError in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertListOfErrorUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedListOfError, listOfError),
            getPersistedListOfError(listOfError)
        );
    }

    @Test
    @Transactional
    void fullUpdateListOfErrorWithPatch() throws Exception {
        // Initialize the database
        listOfErrorRepository.saveAndFlush(listOfError);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the listOfError using partial update
        ListOfError partialUpdatedListOfError = new ListOfError();
        partialUpdatedListOfError.setId(listOfError.getId());

        partialUpdatedListOfError
            .error_code(UPDATED_ERROR_CODE)
            .error_name(UPDATED_ERROR_NAME)
            .quantity(UPDATED_QUANTITY)
            .error_source(UPDATED_ERROR_SOURCE)
            .reason_id(UPDATED_REASON_ID)
            .method(UPDATED_METHOD)
            .check_by_id(UPDATED_CHECK_BY_ID)
            .create_by(UPDATED_CREATE_BY)
            .image(UPDATED_IMAGE)
            .created_at(UPDATED_CREATED_AT)
            .updated_at(UPDATED_UPDATED_AT)
            .check_time(UPDATED_CHECK_TIME)
            .complaint_id(UPDATED_COMPLAINT_ID);

        restListOfErrorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedListOfError.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedListOfError))
            )
            .andExpect(status().isOk());

        // Validate the ListOfError in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertListOfErrorUpdatableFieldsEquals(partialUpdatedListOfError, getPersistedListOfError(partialUpdatedListOfError));
    }

    @Test
    @Transactional
    void patchNonExistingListOfError() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listOfError.setId(longCount.incrementAndGet());

        // Create the ListOfError
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restListOfErrorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, listOfErrorDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(listOfErrorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchListOfError() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listOfError.setId(longCount.incrementAndGet());

        // Create the ListOfError
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListOfErrorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(listOfErrorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamListOfError() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        listOfError.setId(longCount.incrementAndGet());

        // Create the ListOfError
        ListOfErrorDTO listOfErrorDTO = listOfErrorMapper.toDto(listOfError);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restListOfErrorMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(listOfErrorDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ListOfError in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteListOfError() throws Exception {
        // Initialize the database
        listOfErrorRepository.saveAndFlush(listOfError);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the listOfError
        restListOfErrorMockMvc
            .perform(delete(ENTITY_API_URL_ID, listOfError.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return listOfErrorRepository.count();
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

    protected ListOfError getPersistedListOfError(ListOfError listOfError) {
        return listOfErrorRepository.findById(listOfError.getId()).orElseThrow();
    }

    protected void assertPersistedListOfErrorToMatchAllProperties(ListOfError expectedListOfError) {
        assertListOfErrorAllPropertiesEquals(expectedListOfError, getPersistedListOfError(expectedListOfError));
    }

    protected void assertPersistedListOfErrorToMatchUpdatableProperties(ListOfError expectedListOfError) {
        assertListOfErrorAllUpdatablePropertiesEquals(expectedListOfError, getPersistedListOfError(expectedListOfError));
    }
}
