package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ComplaintStatusAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ComplaintStatus;
import com.mycompany.myapp.repository.ComplaintStatusRepository;
import com.mycompany.myapp.service.dto.ComplaintStatusDTO;
import com.mycompany.myapp.service.mapper.ComplaintStatusMapper;
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
 * Integration tests for the {@link ComplaintStatusResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ComplaintStatusResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/complaint-statuses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ComplaintStatusRepository complaintStatusRepository;

    @Autowired
    private ComplaintStatusMapper complaintStatusMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restComplaintStatusMockMvc;

    private ComplaintStatus complaintStatus;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ComplaintStatus createEntity(EntityManager em) {
        ComplaintStatus complaintStatus = new ComplaintStatus()
            .name(DEFAULT_NAME)
            .create_by(DEFAULT_CREATE_BY)
            .created_at(DEFAULT_CREATED_AT);
        return complaintStatus;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ComplaintStatus createUpdatedEntity(EntityManager em) {
        ComplaintStatus complaintStatus = new ComplaintStatus()
            .name(UPDATED_NAME)
            .create_by(UPDATED_CREATE_BY)
            .created_at(UPDATED_CREATED_AT);
        return complaintStatus;
    }

    @BeforeEach
    public void initTest() {
        complaintStatus = createEntity(em);
    }

    @Test
    @Transactional
    void createComplaintStatus() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ComplaintStatus
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);
        var returnedComplaintStatusDTO = om.readValue(
            restComplaintStatusMockMvc
                .perform(
                    post(ENTITY_API_URL)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(om.writeValueAsBytes(complaintStatusDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ComplaintStatusDTO.class
        );

        // Validate the ComplaintStatus in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedComplaintStatus = complaintStatusMapper.toEntity(returnedComplaintStatusDTO);
        assertComplaintStatusUpdatableFieldsEquals(returnedComplaintStatus, getPersistedComplaintStatus(returnedComplaintStatus));
    }

    @Test
    @Transactional
    void createComplaintStatusWithExistingId() throws Exception {
        // Create the ComplaintStatus with an existing ID
        complaintStatus.setId(1L);
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restComplaintStatusMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllComplaintStatuses() throws Exception {
        // Initialize the database
        complaintStatusRepository.saveAndFlush(complaintStatus);

        // Get all the complaintStatusList
        restComplaintStatusMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(complaintStatus.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }

    @Test
    @Transactional
    void getComplaintStatus() throws Exception {
        // Initialize the database
        complaintStatusRepository.saveAndFlush(complaintStatus);

        // Get the complaintStatus
        restComplaintStatusMockMvc
            .perform(get(ENTITY_API_URL_ID, complaintStatus.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(complaintStatus.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingComplaintStatus() throws Exception {
        // Get the complaintStatus
        restComplaintStatusMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingComplaintStatus() throws Exception {
        // Initialize the database
        complaintStatusRepository.saveAndFlush(complaintStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaintStatus
        ComplaintStatus updatedComplaintStatus = complaintStatusRepository.findById(complaintStatus.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedComplaintStatus are not directly saved in db
        em.detach(updatedComplaintStatus);
        updatedComplaintStatus.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(updatedComplaintStatus);

        restComplaintStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, complaintStatusDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isOk());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedComplaintStatusToMatchAllProperties(updatedComplaintStatus);
    }

    @Test
    @Transactional
    void putNonExistingComplaintStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintStatus.setId(longCount.incrementAndGet());

        // Create the ComplaintStatus
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComplaintStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, complaintStatusDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchComplaintStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintStatus.setId(longCount.incrementAndGet());

        // Create the ComplaintStatus
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintStatusMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamComplaintStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintStatus.setId(longCount.incrementAndGet());

        // Create the ComplaintStatus
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintStatusMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateComplaintStatusWithPatch() throws Exception {
        // Initialize the database
        complaintStatusRepository.saveAndFlush(complaintStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaintStatus using partial update
        ComplaintStatus partialUpdatedComplaintStatus = new ComplaintStatus();
        partialUpdatedComplaintStatus.setId(complaintStatus.getId());

        partialUpdatedComplaintStatus.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY);

        restComplaintStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComplaintStatus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedComplaintStatus))
            )
            .andExpect(status().isOk());

        // Validate the ComplaintStatus in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertComplaintStatusUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedComplaintStatus, complaintStatus),
            getPersistedComplaintStatus(complaintStatus)
        );
    }

    @Test
    @Transactional
    void fullUpdateComplaintStatusWithPatch() throws Exception {
        // Initialize the database
        complaintStatusRepository.saveAndFlush(complaintStatus);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaintStatus using partial update
        ComplaintStatus partialUpdatedComplaintStatus = new ComplaintStatus();
        partialUpdatedComplaintStatus.setId(complaintStatus.getId());

        partialUpdatedComplaintStatus.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);

        restComplaintStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComplaintStatus.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedComplaintStatus))
            )
            .andExpect(status().isOk());

        // Validate the ComplaintStatus in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertComplaintStatusUpdatableFieldsEquals(
            partialUpdatedComplaintStatus,
            getPersistedComplaintStatus(partialUpdatedComplaintStatus)
        );
    }

    @Test
    @Transactional
    void patchNonExistingComplaintStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintStatus.setId(longCount.incrementAndGet());

        // Create the ComplaintStatus
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComplaintStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, complaintStatusDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchComplaintStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintStatus.setId(longCount.incrementAndGet());

        // Create the ComplaintStatus
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintStatusMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamComplaintStatus() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaintStatus.setId(longCount.incrementAndGet());

        // Create the ComplaintStatus
        ComplaintStatusDTO complaintStatusDTO = complaintStatusMapper.toDto(complaintStatus);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintStatusMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintStatusDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ComplaintStatus in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteComplaintStatus() throws Exception {
        // Initialize the database
        complaintStatusRepository.saveAndFlush(complaintStatus);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the complaintStatus
        restComplaintStatusMockMvc
            .perform(delete(ENTITY_API_URL_ID, complaintStatus.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return complaintStatusRepository.count();
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

    protected ComplaintStatus getPersistedComplaintStatus(ComplaintStatus complaintStatus) {
        return complaintStatusRepository.findById(complaintStatus.getId()).orElseThrow();
    }

    protected void assertPersistedComplaintStatusToMatchAllProperties(ComplaintStatus expectedComplaintStatus) {
        assertComplaintStatusAllPropertiesEquals(expectedComplaintStatus, getPersistedComplaintStatus(expectedComplaintStatus));
    }

    protected void assertPersistedComplaintStatusToMatchUpdatableProperties(ComplaintStatus expectedComplaintStatus) {
        assertComplaintStatusAllUpdatablePropertiesEquals(expectedComplaintStatus, getPersistedComplaintStatus(expectedComplaintStatus));
    }
}
