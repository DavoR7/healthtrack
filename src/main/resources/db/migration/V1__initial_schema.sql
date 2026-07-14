CREATE TABLE system_configuration (
    id BIGSERIAL PRIMARY KEY,
    application_name VARCHAR(120) NOT NULL,
    application_version VARCHAR(30) NOT NULL,
    environment VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_configuration (
    application_name,
    application_version,
    environment
)
VALUES (
    'SMARTGYM Health Track',
    '1.0.0',
    'development'
);