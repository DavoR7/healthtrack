CREATE TABLE physical_assessments (
    id BIGSERIAL PRIMARY KEY,

    member_id BIGINT NOT NULL,

    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,

    weight_kg NUMERIC(6, 2),
    height_cm NUMERIC(6, 2),
    bmi NUMERIC(6, 2),

    body_fat_percentage NUMERIC(5, 2),
    muscle_mass_kg NUMERIC(6, 2),
    waist_circumference_cm NUMERIC(6, 2),

    resting_heart_rate INTEGER,
    systolic_pressure INTEGER,
    diastolic_pressure INTEGER,
    oxygen_saturation NUMERIC(5, 2),

    observations TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_physical_assessments_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_weight_positive
        CHECK (weight_kg IS NULL OR weight_kg > 0),

    CONSTRAINT chk_height_positive
        CHECK (height_cm IS NULL OR height_cm > 0),

    CONSTRAINT chk_body_fat_range
        CHECK (
            body_fat_percentage IS NULL
            OR body_fat_percentage BETWEEN 0 AND 100
        ),

    CONSTRAINT chk_oxygen_saturation_range
        CHECK (
            oxygen_saturation IS NULL
            OR oxygen_saturation BETWEEN 0 AND 100
        ),

    CONSTRAINT chk_resting_heart_rate_positive
        CHECK (
            resting_heart_rate IS NULL
            OR resting_heart_rate > 0
        )
);

CREATE INDEX idx_physical_assessments_member
    ON physical_assessments(member_id);

CREATE INDEX idx_physical_assessments_date
    ON physical_assessments(assessment_date);

CREATE INDEX idx_physical_assessments_active
    ON physical_assessments(active);
