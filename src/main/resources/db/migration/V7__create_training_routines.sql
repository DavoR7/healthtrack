CREATE TABLE training_routines (
    id BIGSERIAL PRIMARY KEY,

    member_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    objective VARCHAR(250),
    level VARCHAR(30),

    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,

    days_per_week INTEGER,
    estimated_duration_minutes INTEGER,

    observations TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_training_routines_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_training_routine_dates
        CHECK (
            end_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT chk_training_days_per_week
        CHECK (
            days_per_week IS NULL
            OR days_per_week BETWEEN 1 AND 7
        ),

    CONSTRAINT chk_training_duration
        CHECK (
            estimated_duration_minutes IS NULL
            OR estimated_duration_minutes > 0
        )
);

CREATE TABLE routine_exercises (
    id BIGSERIAL PRIMARY KEY,

    routine_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    muscle_group VARCHAR(100),

    sets_count INTEGER,
    repetitions VARCHAR(50),
    load_kg NUMERIC(7, 2),
    rest_seconds INTEGER,

    exercise_order INTEGER NOT NULL DEFAULT 1,
    instructions TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_routine_exercises_routine
        FOREIGN KEY (routine_id)
        REFERENCES training_routines(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_exercise_sets
        CHECK (
            sets_count IS NULL
            OR sets_count > 0
        ),

    CONSTRAINT chk_exercise_load
        CHECK (
            load_kg IS NULL
            OR load_kg >= 0
        ),

    CONSTRAINT chk_exercise_rest
        CHECK (
            rest_seconds IS NULL
            OR rest_seconds >= 0
        ),

    CONSTRAINT chk_exercise_order
        CHECK (exercise_order > 0)
);

CREATE INDEX idx_training_routines_member
    ON training_routines(member_id);

CREATE INDEX idx_training_routines_active
    ON training_routines(active);

CREATE INDEX idx_training_routines_start_date
    ON training_routines(start_date);

CREATE INDEX idx_routine_exercises_routine
    ON routine_exercises(routine_id);

CREATE INDEX idx_routine_exercises_order
    ON routine_exercises(routine_id, exercise_order);
