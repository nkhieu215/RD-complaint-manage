package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class UnitOfUseAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertUnitOfUseAllPropertiesEquals(UnitOfUse expected, UnitOfUse actual) {
        assertUnitOfUseAutoGeneratedPropertiesEquals(expected, actual);
        assertUnitOfUseAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertUnitOfUseAllUpdatablePropertiesEquals(UnitOfUse expected, UnitOfUse actual) {
        assertUnitOfUseUpdatableFieldsEquals(expected, actual);
        assertUnitOfUseUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertUnitOfUseAutoGeneratedPropertiesEquals(UnitOfUse expected, UnitOfUse actual) {
        assertThat(expected)
            .as("Verify UnitOfUse auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertUnitOfUseUpdatableFieldsEquals(UnitOfUse expected, UnitOfUse actual) {
        assertThat(expected)
            .as("Verify UnitOfUse relevant properties")
            .satisfies(e -> assertThat(e.getName()).as("check name").isEqualTo(actual.getName()))
            .satisfies(e -> assertThat(e.getCreate_by()).as("check create_by").isEqualTo(actual.getCreate_by()))
            .satisfies(
                e ->
                    assertThat(e.getCreated_at())
                        .as("check created_at")
                        .usingComparator(zonedDataTimeSameInstant)
                        .isEqualTo(actual.getCreated_at())
            );
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertUnitOfUseUpdatableRelationshipsEquals(UnitOfUse expected, UnitOfUse actual) {}
}
