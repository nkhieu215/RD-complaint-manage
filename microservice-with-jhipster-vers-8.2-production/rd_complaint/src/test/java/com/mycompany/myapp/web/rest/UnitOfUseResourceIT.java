package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.UnitOfUseAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.UnitOfUse;
import com.mycompany.myapp.repository.UnitOfUseRepository;
import com.mycompany.myapp.service.dto.UnitOfUseDTO;
import com.mycompany.myapp.service.mapper.UnitOfUseMapper;
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
 * Integration tests for the {@link UnitOfUseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UnitOfUseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/unit-of-uses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UnitOfUseRepository unitOfUseRepository;

    @Autowired
    private UnitOfUseMapper unitOfUseMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUnitOfUseMockMvc;

    private UnitOfUse unitOfUse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnitOfUse createEntity(EntityManager em) {
        UnitOfUse unitOfUse = new UnitOfUse().name(DEFAULT_NAME).create_by(DEFAULT_CREATE_BY).created_at(DEFAULT_CREATED_AT);
        return unitOfUse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnitOfUse createUpdatedEntity(EntityManager em) {
        UnitOfUse unitOfUse = new UnitOfUse().name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);
        return unitOfUse;
    }

    @BeforeEach
    public void initTest() {
        unitOfUse = createEntity(em);
    }

    @Test
    @Transactional
    void createUnitOfUse() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the UnitOfUse
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);
        var returnedUnitOfUseDTO = om.readValue(
            restUnitOfUseMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitOfUseDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            UnitOfUseDTO.class
        );

        // Validate the UnitOfUse in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedUnitOfUse = unitOfUseMapper.toEntity(returnedUnitOfUseDTO);
        assertUnitOfUseUpdatableFieldsEquals(returnedUnitOfUse, getPersistedUnitOfUse(returnedUnitOfUse));
    }

    @Test
    @Transactional
    void createUnitOfUseWithExistingId() throws Exception {
        // Create the UnitOfUse with an existing ID
        unitOfUse.setId(1L);
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUnitOfUseMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitOfUseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUnitOfUses() throws Exception {
        // Initialize the database
        unitOfUseRepository.saveAndFlush(unitOfUse);

        // Get all the unitOfUseList
        restUnitOfUseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(unitOfUse.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }

    @Test
    @Transactional
    void getUnitOfUse() throws Exception {
        // Initialize the database
        unitOfUseRepository.saveAndFlush(unitOfUse);

        // Get the unitOfUse
        restUnitOfUseMockMvc
            .perform(get(ENTITY_API_URL_ID, unitOfUse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(unitOfUse.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingUnitOfUse() throws Exception {
        // Get the unitOfUse
        restUnitOfUseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUnitOfUse() throws Exception {
        // Initialize the database
        unitOfUseRepository.saveAndFlush(unitOfUse);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unitOfUse
        UnitOfUse updatedUnitOfUse = unitOfUseRepository.findById(unitOfUse.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedUnitOfUse are not directly saved in db
        em.detach(updatedUnitOfUse);
        updatedUnitOfUse.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(updatedUnitOfUse);

        restUnitOfUseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, unitOfUseDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(unitOfUseDTO))
            )
            .andExpect(status().isOk());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUnitOfUseToMatchAllProperties(updatedUnitOfUse);
    }

    @Test
    @Transactional
    void putNonExistingUnitOfUse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unitOfUse.setId(longCount.incrementAndGet());

        // Create the UnitOfUse
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnitOfUseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, unitOfUseDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(unitOfUseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUnitOfUse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unitOfUse.setId(longCount.incrementAndGet());

        // Create the UnitOfUse
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitOfUseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(unitOfUseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUnitOfUse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unitOfUse.setId(longCount.incrementAndGet());

        // Create the UnitOfUse
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitOfUseMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(unitOfUseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUnitOfUseWithPatch() throws Exception {
        // Initialize the database
        unitOfUseRepository.saveAndFlush(unitOfUse);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unitOfUse using partial update
        UnitOfUse partialUpdatedUnitOfUse = new UnitOfUse();
        partialUpdatedUnitOfUse.setId(unitOfUse.getId());

        partialUpdatedUnitOfUse.create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);

        restUnitOfUseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnitOfUse.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUnitOfUse))
            )
            .andExpect(status().isOk());

        // Validate the UnitOfUse in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUnitOfUseUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedUnitOfUse, unitOfUse),
            getPersistedUnitOfUse(unitOfUse)
        );
    }

    @Test
    @Transactional
    void fullUpdateUnitOfUseWithPatch() throws Exception {
        // Initialize the database
        unitOfUseRepository.saveAndFlush(unitOfUse);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the unitOfUse using partial update
        UnitOfUse partialUpdatedUnitOfUse = new UnitOfUse();
        partialUpdatedUnitOfUse.setId(unitOfUse.getId());

        partialUpdatedUnitOfUse.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);

        restUnitOfUseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnitOfUse.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUnitOfUse))
            )
            .andExpect(status().isOk());

        // Validate the UnitOfUse in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUnitOfUseUpdatableFieldsEquals(partialUpdatedUnitOfUse, getPersistedUnitOfUse(partialUpdatedUnitOfUse));
    }

    @Test
    @Transactional
    void patchNonExistingUnitOfUse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unitOfUse.setId(longCount.incrementAndGet());

        // Create the UnitOfUse
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnitOfUseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, unitOfUseDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(unitOfUseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUnitOfUse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unitOfUse.setId(longCount.incrementAndGet());

        // Create the UnitOfUse
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitOfUseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(unitOfUseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUnitOfUse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        unitOfUse.setId(longCount.incrementAndGet());

        // Create the UnitOfUse
        UnitOfUseDTO unitOfUseDTO = unitOfUseMapper.toDto(unitOfUse);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnitOfUseMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(unitOfUseDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UnitOfUse in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUnitOfUse() throws Exception {
        // Initialize the database
        unitOfUseRepository.saveAndFlush(unitOfUse);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the unitOfUse
        restUnitOfUseMockMvc
            .perform(delete(ENTITY_API_URL_ID, unitOfUse.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return unitOfUseRepository.count();
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

    protected UnitOfUse getPersistedUnitOfUse(UnitOfUse unitOfUse) {
        return unitOfUseRepository.findById(unitOfUse.getId()).orElseThrow();
    }

    protected void assertPersistedUnitOfUseToMatchAllProperties(UnitOfUse expectedUnitOfUse) {
        assertUnitOfUseAllPropertiesEquals(expectedUnitOfUse, getPersistedUnitOfUse(expectedUnitOfUse));
    }

    protected void assertPersistedUnitOfUseToMatchUpdatableProperties(UnitOfUse expectedUnitOfUse) {
        assertUnitOfUseAllUpdatablePropertiesEquals(expectedUnitOfUse, getPersistedUnitOfUse(expectedUnitOfUse));
    }
}
