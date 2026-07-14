CREATE TABLE identity_roles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO identity_roles (
    code,
    name,
    description
)
VALUES
(
    'ROLE_ADMIN',
    'Administrador',
    'Acceso completo a la configuración y gestión del sistema'
),
(
    'ROLE_ATHLETE',
    'Deportista',
    'Usuario que recibe planes deportivos, clínicos y nutricionales'
),
(
    'ROLE_DOCTOR',
    'Médico',
    'Profesional encargado del seguimiento y validación médica'
),
(
    'ROLE_PHYSIOTHERAPIST',
    'Fisioterapeuta',
    'Profesional encargado de rehabilitación y prevención de lesiones'
),
(
    'ROLE_NUTRITIONIST',
    'Nutricionista',
    'Profesional encargado de planes nutricionales'
),
(
    'ROLE_COACH',
    'Entrenador',
    'Profesional encargado de planes y sesiones de entrenamiento'
),
(
    'ROLE_RECEPTIONIST',
    'Recepcionista',
    'Usuario encargado de asistencia, reservas y atención'
);
