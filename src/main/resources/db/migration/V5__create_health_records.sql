CREATE TABLE health_records (
    id BIGSERIAL PRIMARY KEY,

    member_id BIGINT NOT NULL UNIQUE,

    medical_history TEXT,
    allergies TEXT,
    injuries TEXT,
    medications TEXT,
    physical_restrictions TEXT,
    clinical_observations TEXT,

    opened_at DATE NOT NULL DEFAULT CURRENT_DATE,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_health_records_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_health_records_member_id
    ON health_records(member_id);

CREATE INDEX idx_health_records_active
    ON health_records(active);