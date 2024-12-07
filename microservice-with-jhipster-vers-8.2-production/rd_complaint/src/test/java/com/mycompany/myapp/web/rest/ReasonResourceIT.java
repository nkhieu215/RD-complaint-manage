package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ReasonAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Reason;
import com.mycompany.myapp.repository.ReasonRepository;
import com.mycompany.myapp.service.dto.ReasonDTO;
import com.mycompany.myapp.service.mapper.ReasonMapper;
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
 * Integration tests for the {@link ReasonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReasonResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/reasons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReasonRepository reasonRepository;

    @Autowired
    private ReasonMapper reasonMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReasonMockMvc;

    private Reason reason;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reason createEntity(EntityManager em) {
        Reason reason = new Reason().name(DEFAULT_NAME).create_by(DEFAULT_CREATE_BY).created_at(DEFAULT_CREATED_AT).status(DEFAULT_STATUS);
        return reason;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reason createUpdatedEntity(EntityManager em) {
        Reason reason = new Reason().name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT).status(UPDATED_STATUS);
        return reason;
    }

    @BeforeEach
    public void initTest() {
        reason = createEntity(em);
    }

    @Test
    @Transactional
    void createReason() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Reason
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);
        var returnedReasonDTO = om.readValue(
            restReasonMockMvc
                .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reasonDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ReasonDTO.class
        );

        // Validate the Reason in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedReason = reasonMapper.toEntity(returnedReasonDTO);
        assertReasonUpdatableFieldsEquals(returnedReason, getPersistedReason(returnedReason));
    }

    @Test
    @Transactional
    void createReasonWithExistingId() throws Exception {
        // Create the Reason with an existing ID
        reason.setId(1L);
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReasonMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reasonDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReasons() throws Exception {
        // Initialize the database
        reasonRepository.saveAndFlush(reason);

        // Get all the reasonList
        restReasonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reason.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getReason() throws Exception {
        // Initialize the database
        reasonRepository.saveAndFlush(reason);

        // Get the reason
        restReasonMockMvc
            .perform(get(ENTITY_API_URL_ID, reason.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reason.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingReason() throws Exception {
        // Get the reason
        restReasonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReason() throws Exception {
        // Initialize the database
        reasonRepository.saveAndFlush(reason);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reason
        Reason updatedReason = reasonRepository.findById(reason.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReason are not directly saved in db
        em.detach(updatedReason);
        updatedReason.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT).status(UPDATED_STATUS);
        ReasonDTO reasonDTO = reasonMapper.toDto(updatedReason);

        restReasonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reasonDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reasonDTO))
            )
            .andExpect(status().isOk());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReasonToMatchAllProperties(updatedReason);
    }

    @Test
    @Transactional
    void putNonExistingReason() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reason.setId(longCount.incrementAndGet());

        // Create the Reason
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReasonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reasonDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reasonDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReason() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reason.setId(longCount.incrementAndGet());

        // Create the Reason
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReasonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reasonDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReason() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reason.setId(longCount.incrementAndGet());

        // Create the Reason
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReasonMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reasonDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReasonWithPatch() throws Exception {
        // Initialize the database
        reasonRepository.saveAndFlush(reason);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reason using partial update
        Reason partialUpdatedReason = new Reason();
        partialUpdatedReason.setId(reason.getId());

        partialUpdatedReason.create_by(UPDATED_CREATE_BY).status(UPDATED_STATUS);

        restReasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReason.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReason))
            )
            .andExpect(status().isOk());

        // Validate the Reason in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReasonUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedReason, reason), getPersistedReason(reason));
    }

    @Test
    @Transactional
    void fullUpdateReasonWithPatch() throws Exception {
        // Initialize the database
        reasonRepository.saveAndFlush(reason);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reason using partial update
        Reason partialUpdatedReason = new Reason();
        partialUpdatedReason.setId(reason.getId());

        partialUpdatedReason.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT).status(UPDATED_STATUS);

        restReasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReason.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReason))
            )
            .andExpect(status().isOk());

        // Validate the Reason in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReasonUpdatableFieldsEquals(partialUpdatedReason, getPersistedReason(partialUpdatedReason));
    }

    @Test
    @Transactional
    void patchNonExistingReason() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reason.setId(longCount.incrementAndGet());

        // Create the Reason
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reasonDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reasonDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReason() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reason.setId(longCount.incrementAndGet());

        // Create the Reason
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reasonDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReason() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reason.setId(longCount.incrementAndGet());

        // Create the Reason
        ReasonDTO reasonDTO = reasonMapper.toDto(reason);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReasonMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reasonDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reason in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReason() throws Exception {
        // Initialize the database
        reasonRepository.saveAndFlush(reason);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reason
        restReasonMockMvc
            .perform(delete(ENTITY_API_URL_ID, reason.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reasonRepository.count();
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

    protected Reason getPersistedReason(Reason reason) {
        return reasonRepository.findById(reason.getId()).orElseThrow();
    }

    protected void assertPersistedReasonToMatchAllProperties(Reason expectedReason) {
        assertReasonAllPropertiesEquals(expectedReason, getPersistedReason(expectedReason));
    }

    protected void assertPersistedReasonToMatchUpdatableProperties(Reason expectedReason) {
        assertReasonAllUpdatablePropertiesEquals(expectedReason, getPersistedReason(expectedReason));
    }
}
