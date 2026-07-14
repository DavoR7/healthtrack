CREATE TABLE members (
    id BIGSERIAL PRIMARY KEY,

    identification VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    gender VARCHAR(20),
    birth_date DATE,

    email VARCHAR(150),
    phone VARCHAR(30),
    address VARCHAR(255),

    blood_type VARCHAR(5),

    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(30),

    photo_url VARCHAR(500),

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_members_identification
    ON members(identification);

CREATE INDEX idx_members_last_name
    ON members(last_name);

CREATE INDEX idx_members_active
    ON members(active);