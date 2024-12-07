package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ReflectorAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Reflector;
import com.mycompany.myapp.repository.ReflectorRepository;
import com.mycompany.myapp.service.dto.ReflectorDTO;
import com.mycompany.myapp.service.mapper.ReflectorMapper;
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
 * Integration tests for the {@link ReflectorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReflectorResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/reflectors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReflectorRepository reflectorRepository;

    @Autowired
    private ReflectorMapper reflectorMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReflectorMockMvc;

    private Reflector reflector;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reflector createEntity(EntityManager em) {
        Reflector reflector = new Reflector().name(DEFAULT_NAME).create_by(DEFAULT_CREATE_BY).created_at(DEFAULT_CREATED_AT);
        return reflector;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reflector createUpdatedEntity(EntityManager em) {
        Reflector reflector = new Reflector().name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);
        return reflector;
    }

    @BeforeEach
    public void initTest() {
        reflector = createEntity(em);
    }

    @Test
    @Transactional
    void createReflector() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Reflector
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);
        var returnedReflectorDTO = om.readValue(
            restReflectorMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reflectorDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ReflectorDTO.class
        );

        // Validate the Reflector in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedReflector = reflectorMapper.toEntity(returnedReflectorDTO);
        assertReflectorUpdatableFieldsEquals(returnedReflector, getPersistedReflector(returnedReflector));
    }

    @Test
    @Transactional
    void createReflectorWithExistingId() throws Exception {
        // Create the Reflector with an existing ID
        reflector.setId(1L);
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReflectorMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reflectorDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllReflectors() throws Exception {
        // Initialize the database
        reflectorRepository.saveAndFlush(reflector);

        // Get all the reflectorList
        restReflectorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reflector.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }

    @Test
    @Transactional
    void getReflector() throws Exception {
        // Initialize the database
        reflectorRepository.saveAndFlush(reflector);

        // Get the reflector
        restReflectorMockMvc
            .perform(get(ENTITY_API_URL_ID, reflector.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reflector.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingReflector() throws Exception {
        // Get the reflector
        restReflectorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReflector() throws Exception {
        // Initialize the database
        reflectorRepository.saveAndFlush(reflector);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reflector
        Reflector updatedReflector = reflectorRepository.findById(reflector.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReflector are not directly saved in db
        em.detach(updatedReflector);
        updatedReflector.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(updatedReflector);

        restReflectorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reflectorDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reflectorDTO))
            )
            .andExpect(status().isOk());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReflectorToMatchAllProperties(updatedReflector);
    }

    @Test
    @Transactional
    void putNonExistingReflector() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reflector.setId(longCount.incrementAndGet());

        // Create the Reflector
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReflectorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reflectorDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reflectorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReflector() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reflector.setId(longCount.incrementAndGet());

        // Create the Reflector
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReflectorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reflectorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReflector() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reflector.setId(longCount.incrementAndGet());

        // Create the Reflector
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReflectorMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reflectorDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReflectorWithPatch() throws Exception {
        // Initialize the database
        reflectorRepository.saveAndFlush(reflector);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reflector using partial update
        Reflector partialUpdatedReflector = new Reflector();
        partialUpdatedReflector.setId(reflector.getId());

        partialUpdatedReflector.name(UPDATED_NAME);

        restReflectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReflector.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReflector))
            )
            .andExpect(status().isOk());

        // Validate the Reflector in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReflectorUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedReflector, reflector),
            getPersistedReflector(reflector)
        );
    }

    @Test
    @Transactional
    void fullUpdateReflectorWithPatch() throws Exception {
        // Initialize the database
        reflectorRepository.saveAndFlush(reflector);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reflector using partial update
        Reflector partialUpdatedReflector = new Reflector();
        partialUpdatedReflector.setId(reflector.getId());

        partialUpdatedReflector.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);

        restReflectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReflector.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReflector))
            )
            .andExpect(status().isOk());

        // Validate the Reflector in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReflectorUpdatableFieldsEquals(partialUpdatedReflector, getPersistedReflector(partialUpdatedReflector));
    }

    @Test
    @Transactional
    void patchNonExistingReflector() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reflector.setId(longCount.incrementAndGet());

        // Create the Reflector
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReflectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reflectorDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reflectorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReflector() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reflector.setId(longCount.incrementAndGet());

        // Create the Reflector
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReflectorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reflectorDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReflector() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reflector.setId(longCount.incrementAndGet());

        // Create the Reflector
        ReflectorDTO reflectorDTO = reflectorMapper.toDto(reflector);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReflectorMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reflectorDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reflector in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReflector() throws Exception {
        // Initialize the database
        reflectorRepository.saveAndFlush(reflector);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reflector
        restReflectorMockMvc
            .perform(delete(ENTITY_API_URL_ID, reflector.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reflectorRepository.count();
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

    protected Reflector getPersistedReflector(Reflector reflector) {
        return reflectorRepository.findById(reflector.getId()).orElseThrow();
    }

    protected void assertPersistedReflectorToMatchAllProperties(Reflector expectedReflector) {
        assertReflectorAllPropertiesEquals(expectedReflector, getPersistedReflector(expectedReflector));
    }

    protected void assertPersistedReflectorToMatchUpdatableProperties(Reflector expectedReflector) {
        assertReflectorAllUpdatablePropertiesEquals(expectedReflector, getPersistedReflector(expectedReflector));
    }
}
