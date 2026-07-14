CREATE TABLE nutrition_plans (
    id BIGSERIAL PRIMARY KEY,

    member_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    objective VARCHAR(250),

    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,

    daily_calories INTEGER,

    protein_grams NUMERIC(7, 2),
    carbohydrate_grams NUMERIC(7, 2),
    fat_grams NUMERIC(7, 2),
    daily_water_liters NUMERIC(5, 2),

    observations TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_nutrition_plans_member
        FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_nutrition_plan_dates
        CHECK (
            end_date IS NULL
            OR end_date >= start_date
        ),

    CONSTRAINT chk_daily_calories
        CHECK (
            daily_calories IS NULL
            OR daily_calories > 0
        ),

    CONSTRAINT chk_protein_grams
        CHECK (
            protein_grams IS NULL
            OR protein_grams >= 0
        ),

    CONSTRAINT chk_carbohydrate_grams
        CHECK (
            carbohydrate_grams IS NULL
            OR carbohydrate_grams >= 0
        ),

    CONSTRAINT chk_fat_grams
        CHECK (
            fat_grams IS NULL
            OR fat_grams >= 0
        ),

    CONSTRAINT chk_daily_water_liters
        CHECK (
            daily_water_liters IS NULL
            OR daily_water_liters >= 0
        )
);

CREATE TABLE nutrition_meals (
    id BIGSERIAL PRIMARY KEY,

    nutrition_plan_id BIGINT NOT NULL,

    name VARCHAR(120) NOT NULL,
    suggested_time TIME,

    description TEXT,

    calories INTEGER,

    protein_grams NUMERIC(7, 2),
    carbohydrate_grams NUMERIC(7, 2),
    fat_grams NUMERIC(7, 2),

    meal_order INTEGER NOT NULL DEFAULT 1,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,

    CONSTRAINT fk_nutrition_meals_plan
        FOREIGN KEY (nutrition_plan_id)
        REFERENCES nutrition_plans(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_meal_calories
        CHECK (
            calories IS NULL
            OR calories >= 0
        ),

    CONSTRAINT chk_meal_protein
        CHECK (
            protein_grams IS NULL
            OR protein_grams >= 0
        ),

    CONSTRAINT chk_meal_carbohydrate
        CHECK (
            carbohydrate_grams IS NULL
            OR carbohydrate_grams >= 0
        ),

    CONSTRAINT chk_meal_fat
        CHECK (
            fat_grams IS NULL
            OR fat_grams >= 0
        ),

    CONSTRAINT chk_meal_order
        CHECK (meal_order > 0)
);

CREATE INDEX idx_nutrition_plans_member
    ON nutrition_plans(member_id);

CREATE INDEX idx_nutrition_plans_active
    ON nutrition_plans(active);

CREATE INDEX idx_nutrition_plans_start_date
    ON nutrition_plans(start_date);

CREATE INDEX idx_nutrition_meals_plan
    ON nutrition_meals(nutrition_plan_id);

CREATE INDEX idx_nutrition_meals_order
    ON nutrition_meals(
        nutrition_plan_id,
        meal_order
    );
