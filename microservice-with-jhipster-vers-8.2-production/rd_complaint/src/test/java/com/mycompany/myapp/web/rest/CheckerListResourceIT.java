package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.CheckerListAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CheckerList;
import com.mycompany.myapp.repository.CheckerListRepository;
import com.mycompany.myapp.service.dto.CheckerListDTO;
import com.mycompany.myapp.service.mapper.CheckerListMapper;
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
 * Integration tests for the {@link CheckerListResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CheckerListResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/checker-lists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CheckerListRepository checkerListRepository;

    @Autowired
    private CheckerListMapper checkerListMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCheckerListMockMvc;

    private CheckerList checkerList;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckerList createEntity(EntityManager em) {
        CheckerList checkerList = new CheckerList().name(DEFAULT_NAME).create_by(DEFAULT_CREATE_BY).created_at(DEFAULT_CREATED_AT);
        return checkerList;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CheckerList createUpdatedEntity(EntityManager em) {
        CheckerList checkerList = new CheckerList().name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);
        return checkerList;
    }

    @BeforeEach
    public void initTest() {
        checkerList = createEntity(em);
    }

    @Test
    @Transactional
    void createCheckerList() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the CheckerList
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);
        var returnedCheckerListDTO = om.readValue(
            restCheckerListMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkerListDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            CheckerListDTO.class
        );

        // Validate the CheckerList in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedCheckerList = checkerListMapper.toEntity(returnedCheckerListDTO);
        assertCheckerListUpdatableFieldsEquals(returnedCheckerList, getPersistedCheckerList(returnedCheckerList));
    }

    @Test
    @Transactional
    void createCheckerListWithExistingId() throws Exception {
        // Create the CheckerList with an existing ID
        checkerList.setId(1L);
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCheckerListMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkerListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCheckerLists() throws Exception {
        // Initialize the database
        checkerListRepository.saveAndFlush(checkerList);

        // Get all the checkerListList
        restCheckerListMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(checkerList.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))));
    }

    @Test
    @Transactional
    void getCheckerList() throws Exception {
        // Initialize the database
        checkerListRepository.saveAndFlush(checkerList);

        // Get the checkerList
        restCheckerListMockMvc
            .perform(get(ENTITY_API_URL_ID, checkerList.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(checkerList.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)));
    }

    @Test
    @Transactional
    void getNonExistingCheckerList() throws Exception {
        // Get the checkerList
        restCheckerListMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCheckerList() throws Exception {
        // Initialize the database
        checkerListRepository.saveAndFlush(checkerList);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkerList
        CheckerList updatedCheckerList = checkerListRepository.findById(checkerList.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCheckerList are not directly saved in db
        em.detach(updatedCheckerList);
        updatedCheckerList.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(updatedCheckerList);

        restCheckerListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, checkerListDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkerListDTO))
            )
            .andExpect(status().isOk());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCheckerListToMatchAllProperties(updatedCheckerList);
    }

    @Test
    @Transactional
    void putNonExistingCheckerList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerList.setId(longCount.incrementAndGet());

        // Create the CheckerList
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckerListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, checkerListDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkerListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCheckerList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerList.setId(longCount.incrementAndGet());

        // Create the CheckerList
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerListMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(checkerListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCheckerList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerList.setId(longCount.incrementAndGet());

        // Create the CheckerList
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerListMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(checkerListDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCheckerListWithPatch() throws Exception {
        // Initialize the database
        checkerListRepository.saveAndFlush(checkerList);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkerList using partial update
        CheckerList partialUpdatedCheckerList = new CheckerList();
        partialUpdatedCheckerList.setId(checkerList.getId());

        partialUpdatedCheckerList.created_at(UPDATED_CREATED_AT);

        restCheckerListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckerList.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckerList))
            )
            .andExpect(status().isOk());

        // Validate the CheckerList in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckerListUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedCheckerList, checkerList),
            getPersistedCheckerList(checkerList)
        );
    }

    @Test
    @Transactional
    void fullUpdateCheckerListWithPatch() throws Exception {
        // Initialize the database
        checkerListRepository.saveAndFlush(checkerList);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the checkerList using partial update
        CheckerList partialUpdatedCheckerList = new CheckerList();
        partialUpdatedCheckerList.setId(checkerList.getId());

        partialUpdatedCheckerList.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT);

        restCheckerListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCheckerList.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCheckerList))
            )
            .andExpect(status().isOk());

        // Validate the CheckerList in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCheckerListUpdatableFieldsEquals(partialUpdatedCheckerList, getPersistedCheckerList(partialUpdatedCheckerList));
    }

    @Test
    @Transactional
    void patchNonExistingCheckerList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerList.setId(longCount.incrementAndGet());

        // Create the CheckerList
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCheckerListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, checkerListDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkerListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCheckerList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerList.setId(longCount.incrementAndGet());

        // Create the CheckerList
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerListMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(checkerListDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCheckerList() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        checkerList.setId(longCount.incrementAndGet());

        // Create the CheckerList
        CheckerListDTO checkerListDTO = checkerListMapper.toDto(checkerList);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCheckerListMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(checkerListDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CheckerList in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCheckerList() throws Exception {
        // Initialize the database
        checkerListRepository.saveAndFlush(checkerList);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the checkerList
        restCheckerListMockMvc
            .perform(delete(ENTITY_API_URL_ID, checkerList.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return checkerListRepository.count();
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

    protected CheckerList getPersistedCheckerList(CheckerList checkerList) {
        return checkerListRepository.findById(checkerList.getId()).orElseThrow();
    }

    protected void assertPersistedCheckerListToMatchAllProperties(CheckerList expectedCheckerList) {
        assertCheckerListAllPropertiesEquals(expectedCheckerList, getPersistedCheckerList(expectedCheckerList));
    }

    protected void assertPersistedCheckerListToMatchUpdatableProperties(CheckerList expectedCheckerList) {
        assertCheckerListAllUpdatablePropertiesEquals(expectedCheckerList, getPersistedCheckerList(expectedCheckerList));
    }
}
