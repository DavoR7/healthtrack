CREATE TABLE identity_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE identity_user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    CONSTRAINT pk_identity_user_roles
        PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_identity_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES identity_users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_identity_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES identity_roles(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_identity_users_username
    ON identity_users(username);

CREATE INDEX idx_identity_users_email
    ON identity_users(email);

CREATE INDEX idx_identity_user_roles_role
    ON identity_user_roles(role_id);