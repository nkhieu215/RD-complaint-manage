package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ComplaintAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Complaint;
import com.mycompany.myapp.repository.ComplaintRepository;
import com.mycompany.myapp.service.dto.ComplaintDTO;
import com.mycompany.myapp.service.mapper.ComplaintMapper;
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
 * Integration tests for the {@link ComplaintResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ComplaintResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATE_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATE_BY = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/complaints";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintMapper complaintMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restComplaintMockMvc;

    private Complaint complaint;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Complaint createEntity(EntityManager em) {
        Complaint complaint = new Complaint()
            .name(DEFAULT_NAME)
            .create_by(DEFAULT_CREATE_BY)
            .created_at(DEFAULT_CREATED_AT)
            .status(DEFAULT_STATUS);
        return complaint;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Complaint createUpdatedEntity(EntityManager em) {
        Complaint complaint = new Complaint()
            .name(UPDATED_NAME)
            .create_by(UPDATED_CREATE_BY)
            .created_at(UPDATED_CREATED_AT)
            .status(UPDATED_STATUS);
        return complaint;
    }

    @BeforeEach
    public void initTest() {
        complaint = createEntity(em);
    }

    @Test
    @Transactional
    void createComplaint() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Complaint
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);
        var returnedComplaintDTO = om.readValue(
            restComplaintMockMvc
                .perform(
                    post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(complaintDTO))
                )
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ComplaintDTO.class
        );

        // Validate the Complaint in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedComplaint = complaintMapper.toEntity(returnedComplaintDTO);
        assertComplaintUpdatableFieldsEquals(returnedComplaint, getPersistedComplaint(returnedComplaint));
    }

    @Test
    @Transactional
    void createComplaintWithExistingId() throws Exception {
        // Create the Complaint with an existing ID
        complaint.setId(1L);
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restComplaintMockMvc
            .perform(post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(complaintDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllComplaints() throws Exception {
        // Initialize the database
        complaintRepository.saveAndFlush(complaint);

        // Get all the complaintList
        restComplaintMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(complaint.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].create_by").value(hasItem(DEFAULT_CREATE_BY)))
            .andExpect(jsonPath("$.[*].created_at").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getComplaint() throws Exception {
        // Initialize the database
        complaintRepository.saveAndFlush(complaint);

        // Get the complaint
        restComplaintMockMvc
            .perform(get(ENTITY_API_URL_ID, complaint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(complaint.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.create_by").value(DEFAULT_CREATE_BY))
            .andExpect(jsonPath("$.created_at").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingComplaint() throws Exception {
        // Get the complaint
        restComplaintMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingComplaint() throws Exception {
        // Initialize the database
        complaintRepository.saveAndFlush(complaint);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaint
        Complaint updatedComplaint = complaintRepository.findById(complaint.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedComplaint are not directly saved in db
        em.detach(updatedComplaint);
        updatedComplaint.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT).status(UPDATED_STATUS);
        ComplaintDTO complaintDTO = complaintMapper.toDto(updatedComplaint);

        restComplaintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, complaintDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintDTO))
            )
            .andExpect(status().isOk());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedComplaintToMatchAllProperties(updatedComplaint);
    }

    @Test
    @Transactional
    void putNonExistingComplaint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaint.setId(longCount.incrementAndGet());

        // Create the Complaint
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComplaintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, complaintDTO.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchComplaint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaint.setId(longCount.incrementAndGet());

        // Create the Complaint
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(complaintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamComplaint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaint.setId(longCount.incrementAndGet());

        // Create the Complaint
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintMockMvc
            .perform(put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(complaintDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateComplaintWithPatch() throws Exception {
        // Initialize the database
        complaintRepository.saveAndFlush(complaint);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaint using partial update
        Complaint partialUpdatedComplaint = new Complaint();
        partialUpdatedComplaint.setId(complaint.getId());

        partialUpdatedComplaint.name(UPDATED_NAME).created_at(UPDATED_CREATED_AT).status(UPDATED_STATUS);

        restComplaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComplaint.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedComplaint))
            )
            .andExpect(status().isOk());

        // Validate the Complaint in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertComplaintUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedComplaint, complaint),
            getPersistedComplaint(complaint)
        );
    }

    @Test
    @Transactional
    void fullUpdateComplaintWithPatch() throws Exception {
        // Initialize the database
        complaintRepository.saveAndFlush(complaint);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the complaint using partial update
        Complaint partialUpdatedComplaint = new Complaint();
        partialUpdatedComplaint.setId(complaint.getId());

        partialUpdatedComplaint.name(UPDATED_NAME).create_by(UPDATED_CREATE_BY).created_at(UPDATED_CREATED_AT).status(UPDATED_STATUS);

        restComplaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComplaint.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedComplaint))
            )
            .andExpect(status().isOk());

        // Validate the Complaint in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertComplaintUpdatableFieldsEquals(partialUpdatedComplaint, getPersistedComplaint(partialUpdatedComplaint));
    }

    @Test
    @Transactional
    void patchNonExistingComplaint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaint.setId(longCount.incrementAndGet());

        // Create the Complaint
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComplaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, complaintDTO.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchComplaint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaint.setId(longCount.incrementAndGet());

        // Create the Complaint
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(complaintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamComplaint() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        complaint.setId(longCount.incrementAndGet());

        // Create the Complaint
        ComplaintDTO complaintDTO = complaintMapper.toDto(complaint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComplaintMockMvc
            .perform(
                patch(ENTITY_API_URL).with(csrf()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(complaintDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Complaint in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteComplaint() throws Exception {
        // Initialize the database
        complaintRepository.saveAndFlush(complaint);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the complaint
        restComplaintMockMvc
            .perform(delete(ENTITY_API_URL_ID, complaint.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return complaintRepository.count();
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

    protected Complaint getPersistedComplaint(Complaint complaint) {
        return complaintRepository.findById(complaint.getId()).orElseThrow();
    }

    protected void assertPersistedComplaintToMatchAllProperties(Complaint expectedComplaint) {
        assertComplaintAllPropertiesEquals(expectedComplaint, getPersistedComplaint(expectedComplaint));
    }

    protected void assertPersistedComplaintToMatchUpdatableProperties(Complaint expectedComplaint) {
        assertComplaintAllUpdatablePropertiesEquals(expectedComplaint, getPersistedComplaint(expectedComplaint));
    }
}
