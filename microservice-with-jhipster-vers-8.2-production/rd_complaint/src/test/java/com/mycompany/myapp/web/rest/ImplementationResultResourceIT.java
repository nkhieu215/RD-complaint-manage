package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ImplementationResultAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ImplementationResult;
import com.mycompany.myapp.repository.ImplementationResultRepository;
import com.mycompany.myapp.service.dto.ImplementationResultDTO;
import com.mycompany.myapp.service.mapper.ImplementationResultMapper;
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
 * Integration tests for the {@link ImplementationResultResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ImplementationResultResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/implementation-results";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ImplementationResultRepository implementationResultRepository;

    @Autowired
    private ImplementationResultMapper implementationResultMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restImplementationResultMockMvc;

    private ImplementationResult implementationResult;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ImplementationResult createEntity(EntityManager em) {
        ImplementationResult implementationResult = new ImplementationResult()
            .name(DEFAULT_NAME)
            .create_by(DEFAULT_CREATE_BY)
            .created_at(DEFAULT_CREATED_AT)
            .status(DEFAULT_STATUS);
        return implementationResult;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ImplementationResult createUpdatedEntity(EntityManager em) {
        ImplementationResult implementationResult = new ImplementationResult()
            .name(UPDATED_NAME)
            .create_by(UPDATED_CREATE_BY)
            .created_at(UPDATED_CREATED_AT)
            .status(UPDATED_STATUS);
        return implementationResult;
    }

    @BeforeEach
    public void initTest() {
        implementationResult = createEntity(em);
    }

    @Test
    @Transactional
    void createImplementationResult() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ImplementationResult
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);
        var returnedImplementationResultDTO = om.readValue(
            restImplementationResultMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(implementationResultDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ImplementationResultDTO.class
        );

        // Validate the ImplementationResult in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedImplementationResult = implementationResultMapper.toEntity(returnedImplementationResultDTO);
        assertImplementationResultUpdatableFieldsEquals(
            returnedImplementationResult,
            getPersistedImplementationResult(returnedImplementationResult)
        );
    }

    @Test
    @Transactional
    void createImplementationResultWithExistingId() throws Exception {
        // Create the ImplementationResult with an existing ID
        implementationResult.setId(1L);
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restImplementationResultMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllImplementationResults() throws Exception {
        // Initialize the database
        implementationResultRepository.saveAndFlush(implementationResult);

        // Get all the implementationResultList
        restImplementationResultMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(implementationResult.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getImplementationResult() throws Exception {
        // Initialize the database
        implementationResultRepository.saveAndFlush(implementationResult);

        // Get the implementationResult
        restImplementationResultMockMvc
            .perform(get(ENTITY_API_URL_ID, implementationResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(implementationResult.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingImplementationResult() throws Exception {
        // Get the implementationResult
        restImplementationResultMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingImplementationResult() throws Exception {
        // Initialize the database
        implementationResultRepository.saveAndFlush(implementationResult);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the implementationResult
        ImplementationResult updatedImplementationResult = implementationResultRepository
            .findById(implementationResult.getId())
            .orElseThrow();
        // Disconnect from session so that the updates on updatedImplementationResult are not directly saved in db
        em.detach(updatedImplementationResult);
        updatedImplementationResult.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT).status(UPDATED_STATUS);
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(updatedImplementationResult);

        restImplementationResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, implementationResultDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isOk());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedImplementationResultToMatchAllProperties(updatedImplementationResult);
    }

    @Test
    @Transactional
    void putNonExistingImplementationResult() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        implementationResult.setId(longCount.incrementAndGet());

        // Create the ImplementationResult
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImplementationResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, implementationResultDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchImplementationResult() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        implementationResult.setId(longCount.incrementAndGet());

        // Create the ImplementationResult
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImplementationResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamImplementationResult() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        implementationResult.setId(longCount.incrementAndGet());

        // Create the ImplementationResult
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImplementationResultMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateImplementationResultWithPatch() throws Exception {
        // Initialize the database
        implementationResultRepository.saveAndFlush(implementationResult);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the implementationResult using partial update
        ImplementationResult partialUpdatedImplementationResult = new ImplementationResult();
        partialUpdatedImplementationResult.setId(implementationResult.getId());

        partialUpdatedImplementationResult.name(UPDATED_NAME).created_at(UPDATED_CREATED_AT);

        restImplementationResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImplementationResult.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImplementationResult))
            )
            .andExpect(status().isOk());

        // Validate the ImplementationResult in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImplementationResultUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedImplementationResult, implementationResult),
            getPersistedImplementationResult(implementationResult)
        );
    }

    @Test
    @Transactional
    void fullUpdateImplementationResultWithPatch() throws Exception {
        // Initialize the database
        implementationResultRepository.saveAndFlush(implementationResult);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the implementationResult using partial update
        ImplementationResult partialUpdatedImplementationResult = new ImplementationResult();
        partialUpdatedImplementationResult.setId(implementationResult.getId());

        partialUpdatedImplementationResult
            .name(UPDATED_NAME)
            .create_by(UPDATED_CREATE_BY)
            .created_at(UPDATED_CREATED_AT)
            .status(UPDATED_STATUS);

        restImplementationResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImplementationResult.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImplementationResult))
            )
            .andExpect(status().isOk());

        // Validate the ImplementationResult in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImplementationResultUpdatableFieldsEquals(
            partialUpdatedImplementationResult,
            getPersistedImplementationResult(partialUpdatedImplementationResult)
        );
    }

    @Test
    @Transactional
    void patchNonExistingImplementationResult() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        implementationResult.setId(longCount.incrementAndGet());

        // Create the ImplementationResult
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImplementationResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, implementationResultDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchImplementationResult() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        implementationResult.setId(longCount.incrementAndGet());

        // Create the ImplementationResult
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImplementationResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamImplementationResult() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        implementationResult.setId(longCount.incrementAndGet());

        // Create the ImplementationResult
        ImplementationResultDTO implementationResultDTO = implementationResultMapper.toDto(implementationResult);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImplementationResultMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(implementationResultDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ImplementationResult in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteImplementationResult() throws Exception {
        // Initialize the database
        implementationResultRepository.saveAndFlush(implementationResult);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the implementationResult
        restImplementationResultMockMvc
            .perform(delete(ENTITY_API_URL_ID, implementationResult.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return implementationResultRepository.count();
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

    protected ImplementationResult getPersistedImplementationResult(ImplementationResult implementationResult) {
        return implementationResultRepository.findById(implementationResult.getId()).orElseThrow();
    }

    protected void assertPersistedImplementationResultToMatchAllProperties(ImplementationResult expectedImplementationResult) {
        assertImplementationResultAllPropertiesEquals(
            expectedImplementationResult,
            getPersistedImplementationResult(expectedImplementationResult)
        );
    }

    protected void assertPersistedImplementationResultToMatchUpdatableProperties(ImplementationResult expectedImplementationResult) {
        assertImplementationResultAllUpdatablePropertiesEquals(
            expectedImplementationResult,
            getPersistedImplementationResult(expectedImplementationResult)
        );
    }
}
