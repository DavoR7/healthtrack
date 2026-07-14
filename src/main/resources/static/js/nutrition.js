console.log("nutrition.js cargado correctamente");

const NUTRITION_API = "/api/v1/nutrition-plans";
const MEMBERS_API = "/api/v1/members";

let nutritionPlans = [];
let members = [];
let selectedPlan = null;
let mealDrafts = [];

const elements = {
    heroPlanCount: document.getElementById("heroPlanCount"),
    totalPlansCount: document.getElementById("totalPlansCount"),
    activePlansCount: document.getElementById("activePlansCount"),
    averageCaloriesValue: document.getElementById("averageCaloriesValue"),
    averageWaterValue: document.getElementById("averageWaterValue"),

    newButton: document.getElementById("newNutritionPlanButton"),
    searchInput: document.getElementById("nutritionSearchInput"),
    memberFilter: document.getElementById("nutritionMemberFilter"),
    statusFilter: document.getElementById("nutritionStatusFilter"),
    refreshButton: document.getElementById("refreshNutritionPlansButton"),

    loading: document.getElementById("nutritionLoading"),
    error: document.getElementById("nutritionError"),
    empty: document.getElementById("nutritionPlansEmpty"),
    grid: document.getElementById("nutritionPlansGrid"),

    detailSection: document.getElementById("nutritionDetailSection"),
    profileAvatar: document.getElementById("nutritionProfileAvatar"),
    detailName: document.getElementById("nutritionDetailName"),
    detailMember: document.getElementById("nutritionDetailMember"),
    detailCaloriesBadge: document.getElementById("nutritionDetailCaloriesBadge"),
    detailStatus: document.getElementById("nutritionDetailStatus"),
    detailObjective: document.getElementById("nutritionDetailObjective"),
    detailDates: document.getElementById("nutritionDetailDates"),
    detailMealCount: document.getElementById("nutritionDetailMealCount"),
    detailMealCalories: document.getElementById("nutritionDetailMealCalories"),

    dailyCalories: document.getElementById("detailDailyCalories"),
    protein: document.getElementById("detailProtein"),
    carbohydrates: document.getElementById("detailCarbohydrates"),
    fat: document.getElementById("detailFat"),
    water: document.getElementById("detailWater"),

    mealBadge: document.getElementById("nutritionMealBadge"),
    mealsList: document.getElementById("nutritionMealsList"),
    mealsEmpty: document.getElementById("nutritionMealsEmpty"),
    detailObservations: document.getElementById("nutritionDetailObservations"),

    editButton: document.getElementById("editNutritionPlanButton"),
    duplicateButton: document.getElementById("duplicateNutritionPlanButton"),
    deactivateButton: document.getElementById("deactivateNutritionPlanButton"),
    printButton: document.getElementById("printNutritionPlanButton"),

    modal: document.getElementById("nutritionModal"),
    modalOverlay: document.getElementById("nutritionModalOverlay"),
    modalTitle: document.getElementById("nutritionModalTitle"),
    closeModalButton: document.getElementById("closeNutritionModalButton"),
    cancelButton: document.getElementById("cancelNutritionButton"),
    form: document.getElementById("nutritionForm"),

    planId: document.getElementById("nutritionPlanId"),
    memberId: document.getElementById("nutritionMemberId"),
    name: document.getElementById("nutritionPlanName"),
    objective: document.getElementById("nutritionObjective"),
    startDate: document.getElementById("nutritionStartDate"),
    endDate: document.getElementById("nutritionEndDate"),
    calories: document.getElementById("nutritionDailyCalories"),
    proteinInput: document.getElementById("nutritionProtein"),
    carbohydrateInput: document.getElementById("nutritionCarbohydrates"),
    fatInput: document.getElementById("nutritionFat"),
    waterInput: document.getElementById("nutritionWater"),
    observations: document.getElementById("nutritionObservations"),
    active: document.getElementById("nutritionActive"),

    memberValidation: document.getElementById("nutritionMemberValidation"),
    nameValidation: document.getElementById("nutritionNameValidation"),
    caloriesValidation: document.getElementById("nutritionCaloriesValidation"),
    dateValidation: document.getElementById("nutritionDateValidation"),

    calculatedMacroCalories:
        document.getElementById("calculatedMacroCalories"),

    addMealButton: document.getElementById("addMealButton"),
    mealBuilderList: document.getElementById("mealBuilderList"),
    mealBuilderEmpty: document.getElementById("mealBuilderEmpty"),

    formMessage: document.getElementById("nutritionFormMessage"),
    saveButton: document.getElementById("saveNutritionButton")
};

async function initializeNutritionDashboard() {
    bindEvents();
    setDefaultDates();

    await Promise.all([
        loadMembers(),
        loadNutritionPlans()
    ]);
}

function bindEvents() {
    elements.newButton.addEventListener("click", openCreateModal);
    elements.refreshButton.addEventListener("click", loadNutritionPlans);

    elements.searchInput.addEventListener("input", applyFilters);
    elements.memberFilter.addEventListener("change", applyFilters);
    elements.statusFilter.addEventListener("change", applyFilters);

    elements.grid.addEventListener("click", handlePlanSelection);

    elements.editButton.addEventListener("click", openEditModal);
    elements.duplicateButton.addEventListener("click", duplicateSelectedPlan);
    elements.deactivateButton.addEventListener(
        "click",
        deactivateSelectedPlan
    );

    elements.printButton.addEventListener(
        "click",
        () => window.print()
    );

    elements.closeModalButton.addEventListener("click", closeModal);
    elements.cancelButton.addEventListener("click", closeModal);
    elements.modalOverlay.addEventListener("click", closeModal);

    elements.form.addEventListener("submit", saveNutritionPlan);

    elements.memberId.addEventListener("change", validateMember);
    elements.name.addEventListener("input", validateName);
    elements.calories.addEventListener("input", validateCalories);
    elements.startDate.addEventListener("change", validateDates);
    elements.endDate.addEventListener("change", validateDates);

    [
        elements.proteinInput,
        elements.carbohydrateInput,
        elements.fatInput
    ].forEach(input => {
        input.addEventListener("input", calculateMacroCalories);
    });

    elements.addMealButton.addEventListener("click", addMealDraft);

    elements.mealBuilderList.addEventListener(
        "input",
        handleMealInput
    );

    elements.mealBuilderList.addEventListener(
        "click",
        handleMealAction
    );
}

async function loadMembers() {
    try {
        const response = await fetch(MEMBERS_API, {
            headers: {
                Accept: "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudieron cargar los deportistas. HTTP ${response.status}`
            );
        }

        const data = await response.json();
        members = Array.isArray(data) ? data : [];

        renderMemberOptions();
        renderMemberFilter();
    } catch (error) {
        console.error(error);
        showFormMessage(error.message);
    }
}

async function loadNutritionPlans() {
    showLoading(true);
    hideError();

    try {
        const response = await fetch(NUTRITION_API, {
            headers: {
                Accept: "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudieron cargar los planes. HTTP ${response.status}`
            );
        }

        const data = await response.json();
        nutritionPlans = Array.isArray(data) ? data : [];

        updateCounters();
        applyFilters();

        if (!selectedPlan && nutritionPlans.length > 0) {
            selectPlan(nutritionPlans[0]);
        } else if (selectedPlan) {
            const refreshed = nutritionPlans.find(
                plan => plan.id === selectedPlan.id
            );

            if (refreshed) {
                selectPlan(refreshed);
            } else {
                clearSelectedPlan();
            }
        }
    } catch (error) {
        console.error(error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

function updateCounters() {
    const activeCount = nutritionPlans.filter(
        plan => plan.active
    ).length;

    const calories = nutritionPlans
        .map(plan => Number(plan.dailyCalories))
        .filter(value => Number.isFinite(value) && value > 0);

    const waterValues = nutritionPlans
        .map(plan => Number(plan.dailyWaterLiters))
        .filter(value => Number.isFinite(value) && value > 0);

    elements.heroPlanCount.textContent = nutritionPlans.length;
    elements.totalPlansCount.textContent = nutritionPlans.length;
    elements.activePlansCount.textContent = activeCount;

    elements.averageCaloriesValue.textContent =
        calories.length > 0
            ? `${calculateAverage(calories).toFixed(0)} kcal`
            : "—";

    elements.averageWaterValue.textContent =
        waterValues.length > 0
            ? `${calculateAverage(waterValues).toFixed(1)} L`
            : "—";
}

function applyFilters() {
    const query = elements.searchInput.value
        .trim()
        .toLowerCase();

    const memberId = elements.memberFilter.value;
    const status = elements.statusFilter.value;

    const filtered = nutritionPlans.filter(plan => {
        const text = [
            plan.name,
            plan.objective,
            plan.memberFullName,
            plan.memberIdentification
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesText =
            query === "" || text.includes(query);

        const matchesMember =
            memberId === "all"
            || String(plan.memberId) === memberId;

        const matchesStatus =
            status === "all"
            || (status === "active" && plan.active)
            || (status === "inactive" && !plan.active);

        return matchesText && matchesMember && matchesStatus;
    });

    renderPlans(filtered);
}

function renderPlans(data) {
    elements.grid.innerHTML = "";

    if (data.length === 0) {
        elements.empty.classList.remove("hidden");
        return;
    }

    elements.empty.classList.add("hidden");

    elements.grid.innerHTML = data
        .map(createPlanCard)
        .join("");
}

function createPlanCard(plan) {
    const selectedClass =
        selectedPlan?.id === plan.id
            ? "selected"
            : "";

    return `
        <article
            class="nutrition-plan-card ${selectedClass}"
            data-plan-id="${plan.id}"
        >
            <div class="nutrition-card-header">

                <div class="nutrition-card-person">

                    <div class="nutrition-card-avatar">
                        ${escapeHtml(getInitials(plan.memberFullName))}
                    </div>

                    <div>
                        <strong>
                            ${escapeHtml(plan.memberFullName)}
                        </strong>

                        <small>
                            ${escapeHtml(plan.memberIdentification)}
                        </small>
                    </div>

                </div>

                <span class="enterprise-badge ${
                    plan.active ? "active" : "inactive"
                }">
                    ${plan.active ? "Activo" : "Inactivo"}
                </span>

            </div>

            <div class="nutrition-card-body">
                <h4>${escapeHtml(plan.name)}</h4>

                <p>
                    ${escapeHtml(
                        plan.objective || "Sin objetivo registrado."
                    )}
                </p>
            </div>

            <div class="nutrition-card-metrics">

                <div class="nutrition-card-metric">
                    <strong>${plan.dailyCalories ?? "—"}</strong>
                    <span>Kcal</span>
                </div>

                <div class="nutrition-card-metric">
                    <strong>${plan.mealCount ?? 0}</strong>
                    <span>Comidas</span>
                </div>

                <div class="nutrition-card-metric">
                    <strong>${plan.dailyWaterLiters ?? "—"}</strong>
                    <span>Litros</span>
                </div>

            </div>
        </article>
    `;
}

function handlePlanSelection(event) {
    const card = event.target.closest("[data-plan-id]");

    if (!card) {
        return;
    }

    const id = Number(card.dataset.planId);

    const plan = nutritionPlans.find(
        current => current.id === id
    );

    if (plan) {
        selectPlan(plan);
    }
}

function selectPlan(plan) {
    selectedPlan = plan;

    elements.detailSection.classList.remove("hidden");

    elements.profileAvatar.textContent =
        getInitials(plan.memberFullName);

    elements.detailName.textContent = plan.name;

    elements.detailMember.textContent =
        `${plan.memberFullName} · ${plan.memberIdentification}`;

    elements.detailCaloriesBadge.textContent =
        `${plan.dailyCalories ?? 0} kcal`;

    elements.detailStatus.textContent =
        plan.active ? "Activo" : "Inactivo";

    elements.detailStatus.className =
        `enterprise-badge ${
            plan.active ? "active" : "inactive"
        }`;

    elements.detailObjective.textContent =
        plan.objective || "Sin objetivo registrado";

    elements.detailDates.textContent =
        formatDateRange(plan.startDate, plan.endDate);

    elements.detailMealCount.textContent =
        plan.mealCount ?? 0;

    elements.detailMealCalories.textContent =
        `${plan.totalMealCalories ?? 0} kcal`;

    elements.dailyCalories.textContent =
        plan.dailyCalories ?? "—";

    elements.protein.textContent =
        plan.proteinGrams ?? "—";

    elements.carbohydrates.textContent =
        plan.carbohydrateGrams ?? "—";

    elements.fat.textContent =
        plan.fatGrams ?? "—";

    elements.water.textContent =
        plan.dailyWaterLiters ?? "—";

    elements.mealBadge.textContent =
        `${plan.mealCount ?? 0} comida(s)`;

    elements.detailObservations.textContent =
        plan.observations || "Sin observaciones registradas.";

    elements.deactivateButton.disabled = !plan.active;

    elements.deactivateButton.textContent =
        plan.active
            ? "Desactivar"
            : "Plan inactivo";

    renderMeals(plan.meals || []);
    applyFilters();

    elements.detailSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderMeals(meals) {
    elements.mealsList.innerHTML = "";

    if (!meals || meals.length === 0) {
        elements.mealsEmpty.classList.remove("hidden");
        return;
    }

    elements.mealsEmpty.classList.add("hidden");

    const ordered = [...meals].sort(
        (a, b) =>
            (a.mealOrder || 0)
            - (b.mealOrder || 0)
    );

    elements.mealsList.innerHTML = ordered
        .map(createMealItem)
        .join("");
}

function createMealItem(meal) {
    return `
        <article class="nutrition-meal-item">

            <div class="nutrition-meal-order">
                ${meal.mealOrder ?? "—"}
            </div>

            <div class="nutrition-meal-info">
                <strong>${escapeHtml(meal.name)}</strong>

                <small>
                    ${escapeHtml(
                        formatTime(meal.suggestedTime)
                    )}
                </small>
            </div>

            <div class="nutrition-meal-value">
                <strong>${meal.calories ?? "—"}</strong>
                <span>Kcal</span>
            </div>

            <div class="nutrition-meal-value">
                <strong>${meal.proteinGrams ?? "—"}</strong>
                <span>Proteína</span>
            </div>

            <div class="nutrition-meal-value">
                <strong>${meal.carbohydrateGrams ?? "—"}</strong>
                <span>Carbohidratos</span>
            </div>

            <div class="nutrition-meal-value">
                <strong>${meal.fatGrams ?? "—"}</strong>
                <span>Grasas</span>
            </div>

            ${
                meal.description
                    ? `
                        <div class="nutrition-meal-description">
                            ${escapeHtml(meal.description)}
                        </div>
                    `
                    : ""
            }

        </article>
    `;
}

function openCreateModal() {
    elements.form.reset();
    elements.planId.value = "";
    elements.memberId.disabled = false;
    elements.active.checked = true;

    mealDrafts = [];

    setDefaultDates();
    clearValidation();
    renderMealBuilder();
    calculateMacroCalories();

    elements.modalTitle.textContent =
        "Nuevo plan nutricional";

    elements.saveButton.textContent =
        "Guardar plan";

    elements.modal.classList.remove("hidden");
}

function openEditModal() {
    if (!selectedPlan) {
        return;
    }

    elements.planId.value = selectedPlan.id;
    elements.memberId.value = selectedPlan.memberId;
    elements.memberId.disabled = true;

    elements.name.value = selectedPlan.name || "";
    elements.objective.value = selectedPlan.objective || "";
    elements.startDate.value = selectedPlan.startDate || "";
    elements.endDate.value = selectedPlan.endDate || "";
    elements.calories.value = selectedPlan.dailyCalories ?? "";
    elements.proteinInput.value = selectedPlan.proteinGrams ?? "";
    elements.carbohydrateInput.value =
        selectedPlan.carbohydrateGrams ?? "";
    elements.fatInput.value = selectedPlan.fatGrams ?? "";
    elements.waterInput.value =
        selectedPlan.dailyWaterLiters ?? "";
    elements.observations.value =
        selectedPlan.observations || "";
    elements.active.checked = Boolean(selectedPlan.active);

    mealDrafts = (selectedPlan.meals || []).map(
        (meal, index) => ({
            internalId: createInternalId(),
            name: meal.name || "",
            suggestedTime: normalizeTimeInput(meal.suggestedTime),
            description: meal.description || "",
            calories: meal.calories ?? "",
            proteinGrams: meal.proteinGrams ?? "",
            carbohydrateGrams:
                meal.carbohydrateGrams ?? "",
            fatGrams: meal.fatGrams ?? "",
            mealOrder: meal.mealOrder ?? index + 1,
            active: meal.active !== false
        })
    );

    clearValidation();
    renderMealBuilder();
    calculateMacroCalories();

    elements.modalTitle.textContent =
        "Editar plan nutricional";

    elements.saveButton.textContent =
        "Actualizar plan";

    elements.modal.classList.remove("hidden");
}

function duplicateSelectedPlan() {
    if (!selectedPlan) {
        return;
    }

    elements.form.reset();
    elements.planId.value = "";
    elements.memberId.disabled = false;
    elements.memberId.value = selectedPlan.memberId;

    elements.name.value =
        `${selectedPlan.name} - Copia`;

    elements.objective.value =
        selectedPlan.objective || "";

    setDefaultDates();

    elements.calories.value =
        selectedPlan.dailyCalories ?? "";

    elements.proteinInput.value =
        selectedPlan.proteinGrams ?? "";

    elements.carbohydrateInput.value =
        selectedPlan.carbohydrateGrams ?? "";

    elements.fatInput.value =
        selectedPlan.fatGrams ?? "";

    elements.waterInput.value =
        selectedPlan.dailyWaterLiters ?? "";

    elements.observations.value =
        selectedPlan.observations || "";

    elements.active.checked = true;

    mealDrafts = (selectedPlan.meals || []).map(
        (meal, index) => ({
            internalId: createInternalId(),
            name: meal.name || "",
            suggestedTime: normalizeTimeInput(meal.suggestedTime),
            description: meal.description || "",
            calories: meal.calories ?? "",
            proteinGrams: meal.proteinGrams ?? "",
            carbohydrateGrams:
                meal.carbohydrateGrams ?? "",
            fatGrams: meal.fatGrams ?? "",
            mealOrder: index + 1,
            active: true
        })
    );

    clearValidation();
    renderMealBuilder();
    calculateMacroCalories();

    elements.modalTitle.textContent =
        "Duplicar plan nutricional";

    elements.saveButton.textContent =
        "Crear copia";

    elements.modal.classList.remove("hidden");
}

function closeModal() {
    elements.modal.classList.add("hidden");
    elements.form.reset();
    elements.planId.value = "";
    elements.memberId.disabled = false;

    mealDrafts = [];

    clearValidation();
    renderMealBuilder();
}

function addMealDraft() {
    mealDrafts.push({
        internalId: createInternalId(),
        name: "",
        suggestedTime: "",
        description: "",
        calories: "",
        proteinGrams: "",
        carbohydrateGrams: "",
        fatGrams: "",
        mealOrder: mealDrafts.length + 1,
        active: true
    });

    renderMealBuilder();
}

function renderMealBuilder() {
    elements.mealBuilderList.innerHTML = "";

    if (mealDrafts.length === 0) {
        elements.mealBuilderEmpty.classList.remove("hidden");
        return;
    }

    elements.mealBuilderEmpty.classList.add("hidden");

    normalizeMealOrder();

    elements.mealBuilderList.innerHTML = mealDrafts
        .map(createMealBuilderCard)
        .join("");
}

function createMealBuilderCard(meal, index) {
    return `
        <article
            class="meal-builder-card"
            data-meal-id="${meal.internalId}"
        >

            <div class="meal-builder-card-header">

                <h4>Comida ${index + 1}</h4>

                <div class="meal-builder-actions">

                    <button
                        class="meal-builder-action"
                        type="button"
                        data-meal-action="up"
                    >
                        ↑
                    </button>

                    <button
                        class="meal-builder-action"
                        type="button"
                        data-meal-action="down"
                    >
                        ↓
                    </button>

                    <button
                        class="meal-builder-action"
                        type="button"
                        data-meal-action="duplicate"
                    >
                        ⧉
                    </button>

                    <button
                        class="meal-builder-action"
                        type="button"
                        data-meal-action="remove"
                    >
                        ×
                    </button>

                </div>

            </div>

            <div class="meal-builder-grid">

                <label class="wide">
                    Nombre de la comida *

                    <input
                        type="text"
                        maxlength="120"
                        data-meal-field="name"
                        value="${escapeAttribute(meal.name)}"
                        placeholder="Ej. Desayuno"
                    >
                </label>

                <label>
                    Hora sugerida

                    <input
                        type="time"
                        data-meal-field="suggestedTime"
                        value="${escapeAttribute(meal.suggestedTime)}"
                    >
                </label>

                <label>
                    Orden

                    <input
                        type="number"
                        min="1"
                        data-meal-field="mealOrder"
                        value="${meal.mealOrder}"
                    >
                </label>

                <label>
                    Calorías

                    <input
                        type="number"
                        min="0"
                        data-meal-field="calories"
                        value="${meal.calories}"
                    >
                </label>

                <label>
                    Proteínas (g)

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        data-meal-field="proteinGrams"
                        value="${meal.proteinGrams}"
                    >
                </label>

                <label>
                    Carbohidratos (g)

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        data-meal-field="carbohydrateGrams"
                        value="${meal.carbohydrateGrams}"
                    >
                </label>

                <label>
                    Grasas (g)

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        data-meal-field="fatGrams"
                        value="${meal.fatGrams}"
                    >
                </label>

                <label class="full">
                    Descripción

                    <textarea
                        maxlength="5000"
                        data-meal-field="description"
                        placeholder="Alimentos, cantidades y recomendaciones..."
                    >${escapeHtml(meal.description)}</textarea>
                </label>

            </div>

        </article>
    `;
}

function handleMealInput(event) {
    const field = event.target.closest("[data-meal-field]");

    if (!field) {
        return;
    }

    const card = field.closest("[data-meal-id]");

    if (!card) {
        return;
    }

    const meal = mealDrafts.find(
        current =>
            current.internalId === card.dataset.mealId
    );

    if (meal) {
        meal[field.dataset.mealField] = field.value;
    }
}

function handleMealAction(event) {
    const button = event.target.closest("[data-meal-action]");

    if (!button) {
        return;
    }

    const card = button.closest("[data-meal-id]");

    if (!card) {
        return;
    }

    const index = mealDrafts.findIndex(
        meal => meal.internalId === card.dataset.mealId
    );

    if (index < 0) {
        return;
    }

    const action = button.dataset.mealAction;

    if (action === "up" && index > 0) {
        [
            mealDrafts[index - 1],
            mealDrafts[index]
        ] = [
            mealDrafts[index],
            mealDrafts[index - 1]
        ];
    }

    if (
        action === "down"
        && index < mealDrafts.length - 1
    ) {
        [
            mealDrafts[index],
            mealDrafts[index + 1]
        ] = [
            mealDrafts[index + 1],
            mealDrafts[index]
        ];
    }

    if (action === "duplicate") {
        const source = mealDrafts[index];

        mealDrafts.splice(index + 1, 0, {
            ...source,
            internalId: createInternalId(),
            name: source.name
                ? `${source.name} - Copia`
                : ""
        });
    }

    if (action === "remove") {
        mealDrafts.splice(index, 1);
    }

    renderMealBuilder();
}

async function saveNutritionPlan(event) {
    event.preventDefault();

    synchronizeMealFields();

    if (!validateForm()) {
        return;
    }

    const planId = elements.planId.value;

    const payload = {
        memberId:
            planId && selectedPlan
                ? selectedPlan.memberId
                : Number(elements.memberId.value),

        name: elements.name.value.trim(),
        objective: emptyToNull(elements.objective.value),
        startDate: emptyToNull(elements.startDate.value),
        endDate: emptyToNull(elements.endDate.value),

        dailyCalories:
            integerOrNull(elements.calories.value),

        proteinGrams:
            numberOrNull(elements.proteinInput.value),

        carbohydrateGrams:
            numberOrNull(elements.carbohydrateInput.value),

        fatGrams:
            numberOrNull(elements.fatInput.value),

        dailyWaterLiters:
            numberOrNull(elements.waterInput.value),

        observations:
            emptyToNull(elements.observations.value),

        active: elements.active.checked,

        meals: mealDrafts.map((meal, index) => ({
            name: meal.name.trim(),

            suggestedTime:
                emptyToNull(meal.suggestedTime),

            description:
                emptyToNull(meal.description),

            calories:
                integerOrNull(meal.calories),

            proteinGrams:
                numberOrNull(meal.proteinGrams),

            carbohydrateGrams:
                numberOrNull(meal.carbohydrateGrams),

            fatGrams:
                numberOrNull(meal.fatGrams),

            mealOrder: index + 1,
            active: true
        }))
    };

    const url = planId
        ? `${NUTRITION_API}/${planId}`
        : NUTRITION_API;

    const method = planId ? "PUT" : "POST";

    const originalText = elements.saveButton.textContent;

    elements.saveButton.disabled = true;
    elements.saveButton.textContent =
        planId ? "Actualizando..." : "Guardando...";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        });

        const body = await response
            .json()
            .catch(() => null);

        if (!response.ok) {
            throw new Error(extractErrorMessage(body));
        }

        closeModal();
        await loadNutritionPlans();

        const savedPlan = nutritionPlans.find(
            plan => plan.id === body?.id
        );

        if (savedPlan) {
            selectPlan(savedPlan);
        }
    } catch (error) {
        console.error(error);
        showFormMessage(error.message);
    } finally {
        elements.saveButton.disabled = false;
        elements.saveButton.textContent = originalText;
    }
}

async function deactivateSelectedPlan() {
    if (!selectedPlan || !selectedPlan.active) {
        return;
    }

    const confirmed = window.confirm(
        `¿Deseas desactivar el plan "${selectedPlan.name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${NUTRITION_API}/${selectedPlan.id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const body = await response
                .json()
                .catch(() => null);

            throw new Error(extractErrorMessage(body));
        }

        await loadNutritionPlans();
    } catch (error) {
        console.error(error);
        window.alert(error.message);
    }
}

function validateForm() {
    return (
        validateMember()
        && validateName()
        && validateCalories()
        && validateDates()
        && validateMeals()
    );
}

function validateMember() {
    const valid = Boolean(elements.memberId.value);

    setValidationState(
        elements.memberId,
        elements.memberValidation,
        valid,
        valid
            ? "Deportista seleccionado"
            : "Debe seleccionar un deportista"
    );

    return valid;
}

function validateName() {
    const valid = elements.name.value.trim().length > 0;

    setValidationState(
        elements.name,
        elements.nameValidation,
        valid,
        valid
            ? "Nombre válido"
            : "El nombre del plan es obligatorio"
    );

    return valid;
}

function validateCalories() {
    if (elements.calories.value === "") {
        clearValidationState(
            elements.calories,
            elements.caloriesValidation
        );

        return true;
    }

    const value = Number(elements.calories.value);

    const valid =
        Number.isInteger(value)
        && value > 0
        && value <= 10000;

    setValidationState(
        elements.calories,
        elements.caloriesValidation,
        valid,
        valid
            ? "Valor energético válido"
            : "Ingrese un valor entre 1 y 10000"
    );

    return valid;
}

function validateDates() {
    if (!elements.endDate.value) {
        clearValidationState(
            elements.endDate,
            elements.dateValidation
        );

        return true;
    }

    const start = elements.startDate.value
        ? new Date(`${elements.startDate.value}T00:00:00`)
        : new Date();

    const end = new Date(
        `${elements.endDate.value}T00:00:00`
    );

    const valid = end >= start;

    setValidationState(
        elements.endDate,
        elements.dateValidation,
        valid,
        valid
            ? "Periodo válido"
            : "La fecha final no puede ser anterior a la inicial"
    );

    return valid;
}

function validateMeals() {
    const invalidMeal = mealDrafts.find(
        meal => !meal.name.trim()
    );

    if (invalidMeal) {
        showFormMessage(
            "Todas las comidas deben tener un nombre."
        );

        return false;
    }

    elements.formMessage.textContent = "";
    return true;
}

function calculateMacroCalories() {
    const protein =
        Number(elements.proteinInput.value) || 0;

    const carbohydrates =
        Number(elements.carbohydrateInput.value) || 0;

    const fat =
        Number(elements.fatInput.value) || 0;

    const total =
        protein * 4
        + carbohydrates * 4
        + fat * 9;

    elements.calculatedMacroCalories.textContent =
        `${total.toFixed(0)} kcal`;
}

function synchronizeMealFields() {
    elements.mealBuilderList
        .querySelectorAll("[data-meal-id]")
        .forEach(card => {
            const meal = mealDrafts.find(
                current =>
                    current.internalId
                    === card.dataset.mealId
            );

            if (!meal) {
                return;
            }

            card.querySelectorAll("[data-meal-field]")
                .forEach(field => {
                    meal[field.dataset.mealField] =
                        field.value;
                });
        });
}

function renderMemberOptions() {
    const currentValue = elements.memberId.value;

    elements.memberId.innerHTML = `
        <option value="">
            Seleccione un deportista
        </option>
    `;

    members
        .filter(member => member.active)
        .forEach(member => {
            const option = document.createElement("option");

            option.value = member.id;
            option.textContent =
                `${member.fullName} — ${member.identification}`;

            elements.memberId.appendChild(option);
        });

    if (currentValue) {
        elements.memberId.value = currentValue;
    }
}

function renderMemberFilter() {
    const currentValue = elements.memberFilter.value;

    elements.memberFilter.innerHTML = `
        <option value="all">Todos</option>
    `;

    members.forEach(member => {
        const option = document.createElement("option");

        option.value = member.id;
        option.textContent = member.fullName;

        elements.memberFilter.appendChild(option);
    });

    if (currentValue) {
        elements.memberFilter.value = currentValue;
    }
}

function normalizeMealOrder() {
    mealDrafts.forEach((meal, index) => {
        meal.mealOrder = index + 1;
    });
}

function clearSelectedPlan() {
    selectedPlan = null;
    elements.detailSection.classList.add("hidden");
}

function clearValidation() {
    clearValidationState(
        elements.memberId,
        elements.memberValidation
    );

    clearValidationState(
        elements.name,
        elements.nameValidation
    );

    clearValidationState(
        elements.calories,
        elements.caloriesValidation
    );

    clearValidationState(
        elements.endDate,
        elements.dateValidation
    );

    elements.formMessage.textContent = "";
}

function setValidationState(
    field,
    message,
    valid,
    text
) {
    field.classList.toggle("valid", valid);
    field.classList.toggle("invalid", !valid);

    message.textContent = text;
    message.classList.toggle("success", valid);
    message.classList.toggle("error", !valid);
}

function clearValidationState(field, message) {
    field.classList.remove("valid", "invalid");
    message.textContent = "";
    message.classList.remove("success", "error");
}

function setDefaultDates() {
    const today = new Date();

    elements.startDate.value =
        today.toISOString().slice(0, 10);

    const end = new Date(today);
    end.setDate(end.getDate() + 30);

    elements.endDate.value =
        end.toISOString().slice(0, 10);
}

function showLoading(show) {
    elements.loading.style.display =
        show ? "block" : "none";
}

function showError(message) {
    elements.error.textContent = message;
    elements.error.classList.remove("hidden");
}

function hideError() {
    elements.error.textContent = "";
    elements.error.classList.add("hidden");
}

function showFormMessage(message) {
    elements.formMessage.textContent = message;
}

function calculateAverage(values) {
    return values.reduce(
        (total, value) => total + value,
        0
    ) / values.length;
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        "es-EC",
        {
            year: "numeric",
            month: "short",
            day: "2-digit"
        }
    ).format(
        new Date(`${value}T00:00:00`)
    );
}

function formatDateRange(startDate, endDate) {
    if (!startDate && !endDate) {
        return "Periodo no definido";
    }

    if (!endDate) {
        return `Desde ${formatDate(startDate)}`;
    }

    return `${formatDate(startDate)} — ${formatDate(endDate)}`;
}

function formatTime(value) {
    if (!value) {
        return "Hora no definida";
    }

    return String(value).slice(0, 5);
}

function normalizeTimeInput(value) {
    if (!value) {
        return "";
    }

    return String(value).slice(0, 5);
}

function getInitials(fullName) {
    const parts = String(fullName || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) {
        return "NU";
    }

    const first = parts[0].charAt(0);
    const last = parts.length > 1
        ? parts[parts.length - 1].charAt(0)
        : "";

    return `${first}${last}`.toUpperCase();
}

function createInternalId() {
    return `meal-${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}`;
}

function emptyToNull(value) {
    const normalized = String(value ?? "").trim();

    return normalized === ""
        ? null
        : normalized;
}

function numberOrNull(value) {
    if (value === "") {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}

function integerOrNull(value) {
    const number = numberOrNull(value);

    return number == null
        ? null
        : Math.trunc(number);
}

function extractErrorMessage(body) {
    if (!body) {
        return "No fue posible completar la operación";
    }

    if (body.message) {
        return body.message;
    }

    if (body.validationErrors) {
        return Object.values(
            body.validationErrors
        ).join(". ");
    }

    if (Array.isArray(body.errors)) {
        return body.errors
            .map(error =>
                error.defaultMessage || error.message
            )
            .filter(Boolean)
            .join(". ");
    }

    return "No fue posible completar la operación";
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeNutritionDashboard,
        { once: true }
    );
} else {
    initializeNutritionDashboard();
}
