CREATE TABLE training_sessions (
    id BIGSERIAL PRIMARY KEY,

    member_id BIGINT NOT NULL,
    routine_id BIGINT,

    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    start_time TIME,
    end_time TIME,

    activity_type VARCHAR(40) NOT NULL DEFAULT 'FUERZA',

    duration_minutes INTEGER,
    steps INTEGER,
    distance_km NUMERIC(8, 2),
    cardio_minutes INTEGER,
    calories_burned INTEGER,
    floors_climbed INTEGER,

    average_heart_rate INTEGER,
    maximum_heart_rate INTEGER,

    effort_level INTEGER,
    pain_level INTEGER,

    completed BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    observations TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_training_sessions_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_training_sessions_routine
        FOREIGN KEY (routine_id)
        REFERENCES training_routines(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_training_session_activity_type
        CHECK (
            activity_type IN (
                'FUERZA',
                'CARDIO',
                'CAMINATA',
                'CARRERA',
                'BICICLETA',
                'ESCALERAS',
                'NATACION',
                'MOVILIDAD',
                'REHABILITACION',
                'OTRA'
            )
        ),

    CONSTRAINT chk_training_session_duration
        CHECK (
            duration_minutes IS NULL
            OR duration_minutes >= 0
        ),

    CONSTRAINT chk_training_session_steps
        CHECK (
            steps IS NULL
            OR steps >= 0
        ),

    CONSTRAINT chk_training_session_distance
        CHECK (
            distance_km IS NULL
            OR distance_km >= 0
        ),

    CONSTRAINT chk_training_session_cardio
        CHECK (
            cardio_minutes IS NULL
            OR cardio_minutes >= 0
        ),

    CONSTRAINT chk_training_session_calories
        CHECK (
            calories_burned IS NULL
            OR calories_burned >= 0
        ),

    CONSTRAINT chk_training_session_floors
        CHECK (
            floors_climbed IS NULL
            OR floors_climbed >= 0
        ),

    CONSTRAINT chk_training_session_average_hr
        CHECK (
            average_heart_rate IS NULL
            OR average_heart_rate > 0
        ),

    CONSTRAINT chk_training_session_max_hr
        CHECK (
            maximum_heart_rate IS NULL
            OR maximum_heart_rate > 0
        ),

    CONSTRAINT chk_training_session_effort
        CHECK (
            effort_level IS NULL
            OR effort_level BETWEEN 1 AND 10
        ),

    CONSTRAINT chk_training_session_pain
        CHECK (
            pain_level IS NULL
            OR pain_level BETWEEN 0 AND 10
        )
);

CREATE TABLE performed_exercises (
    id BIGSERIAL PRIMARY KEY,

    training_session_id BIGINT NOT NULL,
    routine_exercise_id BIGINT,

    exercise_name VARCHAR(150) NOT NULL,
    exercise_type VARCHAR(40),

    sets_completed INTEGER,
    repetitions_completed VARCHAR(50),
    weight_kg NUMERIC(8, 2),

    duration_minutes INTEGER,
    distance_km NUMERIC(8, 2),
    calories_burned INTEGER,

    average_heart_rate INTEGER,
    effort_level INTEGER,
    pain_level INTEGER,

    completed BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,

    observations TEXT,
    exercise_order INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_performed_exercises_session
        FOREIGN KEY (training_session_id)
        REFERENCES training_sessions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_performed_exercises_routine_exercise
        FOREIGN KEY (routine_exercise_id)
        REFERENCES routine_exercises(id)
        ON DELETE SET NULL,

    CONSTRAINT chk_performed_exercise_sets
        CHECK (
            sets_completed IS NULL
            OR sets_completed >= 0
        ),

    CONSTRAINT chk_performed_exercise_weight
        CHECK (
            weight_kg IS NULL
            OR weight_kg >= 0
        ),

    CONSTRAINT chk_performed_exercise_duration
        CHECK (
            duration_minutes IS NULL
            OR duration_minutes >= 0
        ),

    CONSTRAINT chk_performed_exercise_distance
        CHECK (
            distance_km IS NULL
            OR distance_km >= 0
        ),

    CONSTRAINT chk_performed_exercise_calories
        CHECK (
            calories_burned IS NULL
            OR calories_burned >= 0
        ),

    CONSTRAINT chk_performed_exercise_average_hr
        CHECK (
            average_heart_rate IS NULL
            OR average_heart_rate > 0
        ),

    CONSTRAINT chk_performed_exercise_effort
        CHECK (
            effort_level IS NULL
            OR effort_level BETWEEN 1 AND 10
        ),

    CONSTRAINT chk_performed_exercise_pain
        CHECK (
            pain_level IS NULL
            OR pain_level BETWEEN 0 AND 10
        ),

    CONSTRAINT chk_performed_exercise_order
        CHECK (exercise_order > 0)
);

CREATE INDEX idx_training_sessions_member
    ON training_sessions(member_id);

CREATE INDEX idx_training_sessions_routine
    ON training_sessions(routine_id);

CREATE INDEX idx_training_sessions_date
    ON training_sessions(session_date);

CREATE INDEX idx_training_sessions_active
    ON training_sessions(active);

CREATE INDEX idx_performed_exercises_session
    ON performed_exercises(training_session_id);

CREATE INDEX idx_performed_exercises_routine_exercise
    ON performed_exercises(routine_exercise_id);

CREATE INDEX idx_performed_exercises_order
    ON performed_exercises(
        training_session_id,
        exercise_order
    );
