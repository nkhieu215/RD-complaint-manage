package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class ReflectorAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReflectorAllPropertiesEquals(Reflector expected, Reflector actual) {
        assertReflectorAutoGeneratedPropertiesEquals(expected, actual);
        assertReflectorAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReflectorAllUpdatablePropertiesEquals(Reflector expected, Reflector actual) {
        assertReflectorUpdatableFieldsEquals(expected, actual);
        assertReflectorUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReflectorAutoGeneratedPropertiesEquals(Reflector expected, Reflector actual) {
        assertThat(expected)
            .as("Verify Reflector auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReflectorUpdatableFieldsEquals(Reflector expected, Reflector actual) {
        assertThat(expected)
            .as("Verify Reflector relevant properties")
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
    public static void assertReflectorUpdatableRelationshipsEquals(Reflector expected, Reflector actual) {}
}
