console.log("training-routines.js cargado correctamente");

const ROUTINES_API = "/api/v1/training-routines";
const MEMBERS_API = "/api/v1/members";

let routines = [];
let members = [];
let selectedRoutine = null;
let exerciseDrafts = [];

const elements = {
    heroRoutineCount:
        document.getElementById("heroRoutineCount"),

    totalRoutinesCount:
        document.getElementById("totalRoutinesCount"),

    activeRoutinesCount:
        document.getElementById("activeRoutinesCount"),

    totalExercisesCount:
        document.getElementById("totalExercisesCount"),

    averageDurationValue:
        document.getElementById("averageDurationValue"),

    newRoutineButton:
        document.getElementById("newRoutineButton"),

    routineSearchInput:
        document.getElementById("routineSearchInput"),

    routineMemberFilter:
        document.getElementById("routineMemberFilter"),

    routineStatusFilter:
        document.getElementById("routineStatusFilter"),

    refreshRoutinesButton:
        document.getElementById("refreshRoutinesButton"),

    routinesLoading:
        document.getElementById("routinesLoading"),

    routinesError:
        document.getElementById("routinesError"),

    routinesEmpty:
        document.getElementById("routinesEmpty"),

    routinesGrid:
        document.getElementById("routinesGrid"),

    routineDetailSection:
        document.getElementById("routineDetailSection"),

    routineProfileAvatar:
        document.getElementById("routineProfileAvatar"),

    routineDetailName:
        document.getElementById("routineDetailName"),

    routineDetailMember:
        document.getElementById("routineDetailMember"),

    routineDetailLevel:
        document.getElementById("routineDetailLevel"),

    routineDetailStatus:
        document.getElementById("routineDetailStatus"),

    routineDetailObjective:
        document.getElementById("routineDetailObjective"),

    routineDetailDates:
        document.getElementById("routineDetailDates"),

    routineDetailDays:
        document.getElementById("routineDetailDays"),

    routineDetailDuration:
        document.getElementById("routineDetailDuration"),

    routineDetailExerciseCount:
        document.getElementById("routineDetailExerciseCount"),

    routineDetailTotalSets:
        document.getElementById("routineDetailTotalSets"),

    routineExerciseBadge:
        document.getElementById("routineExerciseBadge"),

    routineExercisesList:
        document.getElementById("routineExercisesList"),

    routineExercisesEmpty:
        document.getElementById("routineExercisesEmpty"),

    routineDetailObservations:
        document.getElementById("routineDetailObservations"),

    editRoutineButton:
        document.getElementById("editRoutineButton"),

    duplicateRoutineButton:
        document.getElementById("duplicateRoutineButton"),

    deactivateRoutineButton:
        document.getElementById("deactivateRoutineButton"),

    printRoutineButton:
        document.getElementById("printRoutineButton"),

    modal:
        document.getElementById("routineModal"),

    modalOverlay:
        document.getElementById("routineModalOverlay"),

    modalTitle:
        document.getElementById("routineModalTitle"),

    closeModalButton:
        document.getElementById("closeRoutineModalButton"),

    cancelRoutineButton:
        document.getElementById("cancelRoutineButton"),

    form:
        document.getElementById("routineForm"),

    routineId:
        document.getElementById("routineId"),

    memberId:
        document.getElementById("routineMemberId"),

    name:
        document.getElementById("routineName"),

    level:
        document.getElementById("routineLevel"),

    objective:
        document.getElementById("routineObjective"),

    startDate:
        document.getElementById("routineStartDate"),

    endDate:
        document.getElementById("routineEndDate"),

    daysPerWeek:
        document.getElementById("routineDaysPerWeek"),

    duration:
        document.getElementById("routineDuration"),

    observations:
        document.getElementById("routineObservations"),

    active:
        document.getElementById("routineActive"),

    memberValidation:
        document.getElementById("routineMemberValidation"),

    nameValidation:
        document.getElementById("routineNameValidation"),

    startDateValidation:
        document.getElementById("routineStartDateValidation"),

    endDateValidation:
        document.getElementById("routineEndDateValidation"),

    daysValidation:
        document.getElementById("routineDaysValidation"),

    durationValidation:
        document.getElementById("routineDurationValidation"),

    addExerciseButton:
        document.getElementById("addExerciseButton"),

    exerciseBuilderList:
        document.getElementById("exerciseBuilderList"),

    exerciseBuilderEmpty:
        document.getElementById("exerciseBuilderEmpty"),

    formMessage:
        document.getElementById("routineFormMessage"),

    saveRoutineButton:
        document.getElementById("saveRoutineButton")
};

async function initializeRoutineDashboard() {
    bindEvents();
    setDefaultDates();

    await Promise.all([
        loadMembers(),
        loadRoutines()
    ]);
}

function bindEvents() {
    elements.newRoutineButton.addEventListener(
        "click",
        openCreateModal
    );

    elements.refreshRoutinesButton.addEventListener(
        "click",
        loadRoutines
    );

    elements.routineSearchInput.addEventListener(
        "input",
        applyFilters
    );

    elements.routineMemberFilter.addEventListener(
        "change",
        applyFilters
    );

    elements.routineStatusFilter.addEventListener(
        "change",
        applyFilters
    );

    elements.routinesGrid.addEventListener(
        "click",
        handleRoutineCardClick
    );

    elements.editRoutineButton.addEventListener(
        "click",
        openEditModal
    );

    elements.duplicateRoutineButton.addEventListener(
        "click",
        duplicateSelectedRoutine
    );

    elements.deactivateRoutineButton.addEventListener(
        "click",
        deactivateSelectedRoutine
    );

    elements.printRoutineButton.addEventListener(
        "click",
        () => window.print()
    );

    elements.closeModalButton.addEventListener(
        "click",
        closeModal
    );

    elements.cancelRoutineButton.addEventListener(
        "click",
        closeModal
    );

    elements.modalOverlay.addEventListener(
        "click",
        closeModal
    );

    elements.form.addEventListener(
        "submit",
        saveRoutine
    );

    elements.memberId.addEventListener(
        "change",
        validateMember
    );

    elements.name.addEventListener(
        "input",
        validateName
    );

    elements.startDate.addEventListener(
        "change",
        validateDates
    );

    elements.endDate.addEventListener(
        "change",
        validateDates
    );

    elements.daysPerWeek.addEventListener(
        "input",
        validateDays
    );

    elements.duration.addEventListener(
        "input",
        validateDuration
    );

    elements.addExerciseButton.addEventListener(
        "click",
        addExerciseDraft
    );

    elements.exerciseBuilderList.addEventListener(
        "input",
        handleExerciseInput
    );

    elements.exerciseBuilderList.addEventListener(
        "click",
        handleExerciseAction
    );
}

async function loadMembers() {
    try {
        const response = await fetch(MEMBERS_API, {
            headers: {
                "Accept": "application/json"
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

async function loadRoutines() {
    showLoading(true);
    hideRoutinesError();

    try {
        const response = await fetch(ROUTINES_API, {
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudieron cargar las rutinas. HTTP ${response.status}`
            );
        }

        const data = await response.json();

        routines = Array.isArray(data) ? data : [];

        updateCounters();
        applyFilters();

        if (!selectedRoutine && routines.length > 0) {
            selectRoutine(routines[0]);
        } else if (selectedRoutine) {
            const refreshed = routines.find(
                routine => routine.id === selectedRoutine.id
            );

            if (refreshed) {
                selectRoutine(refreshed);
            } else {
                clearSelectedRoutine();
            }
        }
    } catch (error) {
        console.error(error);
        showRoutinesError(error.message);
    } finally {
        showLoading(false);
    }
}

function updateCounters() {
    const activeCount = routines.filter(
        routine => routine.active
    ).length;

    const exerciseCount = routines.reduce(
        (total, routine) =>
            total + (routine.exerciseCount || 0),
        0
    );

    const durations = routines
        .map(routine =>
            Number(routine.estimatedDurationMinutes)
        )
        .filter(value =>
            Number.isFinite(value) && value > 0
        );

    elements.heroRoutineCount.textContent =
        routines.length;

    elements.totalRoutinesCount.textContent =
        routines.length;

    elements.activeRoutinesCount.textContent =
        activeCount;

    elements.totalExercisesCount.textContent =
        exerciseCount;

    elements.averageDurationValue.textContent =
        durations.length > 0
            ? `${calculateAverage(durations).toFixed(0)} min`
            : "—";
}

function applyFilters() {
    const query = elements.routineSearchInput.value
        .trim()
        .toLowerCase();

    const memberId =
        elements.routineMemberFilter.value;

    const status =
        elements.routineStatusFilter.value;

    const filtered = routines.filter(routine => {
        const text = [
            routine.name,
            routine.objective,
            routine.level,
            routine.memberFullName,
            routine.memberIdentification
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesText =
            query === "" || text.includes(query);

        const matchesMember =
            memberId === "all"
            || String(routine.memberId) === memberId;

        const matchesStatus =
            status === "all"
            || (status === "active" && routine.active)
            || (status === "inactive" && !routine.active);

        return (
            matchesText
            && matchesMember
            && matchesStatus
        );
    });

    renderRoutines(filtered);
}

function renderRoutines(data) {
    elements.routinesGrid.innerHTML = "";

    if (data.length === 0) {
        elements.routinesEmpty.classList.remove("hidden");
        return;
    }

    elements.routinesEmpty.classList.add("hidden");

    elements.routinesGrid.innerHTML = data
        .map(createRoutineCard)
        .join("");
}

function createRoutineCard(routine) {
    const selectedClass =
        selectedRoutine?.id === routine.id
            ? "selected"
            : "";

    return `
        <article
            class="training-routine-card ${selectedClass}"
            data-routine-id="${routine.id}"
        >
            <div class="routine-card-header">

                <div class="routine-card-person">

                    <div class="routine-card-avatar">
                        ${escapeHtml(
                            getInitials(routine.memberFullName)
                        )}
                    </div>

                    <div class="routine-card-person-info">

                        <strong>
                            ${escapeHtml(routine.memberFullName)}
                        </strong>

                        <small>
                            ${escapeHtml(
                                routine.memberIdentification
                            )}
                        </small>

                    </div>

                </div>

                <span class="enterprise-badge ${
                    routine.active ? "active" : "inactive"
                }">
                    ${routine.active ? "Activa" : "Inactiva"}
                </span>

            </div>

            <div class="routine-card-body">

                <span class="routine-level-badge">
                    ${escapeHtml(
                        formatLevel(routine.level)
                    )}
                </span>

                <h4>
                    ${escapeHtml(routine.name)}
                </h4>

                <p>
                    ${escapeHtml(
                        routine.objective
                        || "Sin objetivo registrado."
                    )}
                </p>

            </div>

            <div class="routine-card-metrics">

                <div class="routine-card-metric">
                    <strong>
                        ${routine.daysPerWeek ?? "—"}
                    </strong>
                    <span>Días</span>
                </div>

                <div class="routine-card-metric">
                    <strong>
                        ${routine.exerciseCount ?? 0}
                    </strong>
                    <span>Ejercicios</span>
                </div>

                <div class="routine-card-metric">
                    <strong>
                        ${routine.estimatedDurationMinutes ?? "—"}
                    </strong>
                    <span>Minutos</span>
                </div>

            </div>

        </article>
    `;
}

function handleRoutineCardClick(event) {
    const card = event.target.closest(
        "[data-routine-id]"
    );

    if (!card) {
        return;
    }

    const routineId = Number(card.dataset.routineId);

    const routine = routines.find(
        current => current.id === routineId
    );

    if (routine) {
        selectRoutine(routine);
    }
}

function selectRoutine(routine) {
    selectedRoutine = routine;

    elements.routineDetailSection.classList.remove(
        "hidden"
    );

    elements.routineProfileAvatar.textContent =
        getInitials(routine.memberFullName);

    elements.routineDetailName.textContent =
        routine.name;

    elements.routineDetailMember.textContent =
        `${routine.memberFullName} · ${routine.memberIdentification}`;

    elements.routineDetailLevel.textContent =
        formatLevel(routine.level);

    elements.routineDetailStatus.textContent =
        routine.active ? "Activa" : "Inactiva";

    elements.routineDetailStatus.className =
        `enterprise-badge ${
            routine.active ? "active" : "inactive"
        }`;

    elements.routineDetailObjective.textContent =
        routine.objective || "Sin objetivo registrado";

    elements.routineDetailDates.textContent =
        formatDateRange(
            routine.startDate,
            routine.endDate
        );

    elements.routineDetailDays.textContent =
        routine.daysPerWeek == null
            ? "No definido"
            : `${routine.daysPerWeek} día(s)`;

    elements.routineDetailDuration.textContent =
        routine.estimatedDurationMinutes == null
            ? "No definida"
            : `${routine.estimatedDurationMinutes} minutos`;

    elements.routineDetailExerciseCount.textContent =
        routine.exerciseCount ?? 0;

    elements.routineDetailTotalSets.textContent =
        calculateTotalSets(routine.exercises);

    elements.routineExerciseBadge.textContent =
        `${routine.exerciseCount ?? 0} ejercicio(s)`;

    elements.routineDetailObservations.textContent =
        routine.observations
        || "Sin observaciones registradas.";

    elements.deactivateRoutineButton.disabled =
        !routine.active;

    elements.deactivateRoutineButton.textContent =
        routine.active
            ? "Desactivar"
            : "Rutina inactiva";

    renderExercises(routine.exercises || []);
    applyFilters();

    elements.routineDetailSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderExercises(exercises) {
    elements.routineExercisesList.innerHTML = "";

    if (!exercises || exercises.length === 0) {
        elements.routineExercisesEmpty.classList.remove(
            "hidden"
        );
        return;
    }

    elements.routineExercisesEmpty.classList.add(
        "hidden"
    );

    const orderedExercises = [...exercises].sort(
        (a, b) =>
            (a.exerciseOrder || 0)
            - (b.exerciseOrder || 0)
    );

    elements.routineExercisesList.innerHTML =
        orderedExercises
            .map(createExerciseItem)
            .join("");
}

function createExerciseItem(exercise) {
    return `
        <article class="routine-exercise-item">

            <div class="routine-exercise-order">
                ${exercise.exerciseOrder ?? "—"}
            </div>

            <div class="routine-exercise-info">
                <strong>
                    ${escapeHtml(exercise.name)}
                </strong>

                <small>
                    ${escapeHtml(
                        exercise.muscleGroup
                        || "Grupo muscular no definido"
                    )}
                </small>
            </div>

            <div class="routine-exercise-value">
                <strong>
                    ${exercise.setsCount ?? "—"}
                </strong>
                <span>Series</span>
            </div>

            <div class="routine-exercise-value">
                <strong>
                    ${escapeHtml(
                        exercise.repetitions || "—"
                    )}
                </strong>
                <span>Repeticiones</span>
            </div>

            <div class="routine-exercise-value">
                <strong>
                    ${exercise.loadKg ?? "—"}
                </strong>
                <span>Kg</span>
            </div>

            <div class="routine-exercise-value">
                <strong>
                    ${exercise.restSeconds ?? "—"}
                </strong>
                <span>Descanso</span>
            </div>

            ${
                exercise.instructions
                    ? `
                        <div class="routine-exercise-instructions">
                            ${escapeHtml(exercise.instructions)}
                        </div>
                    `
                    : ""
            }

        </article>
    `;
}

function openCreateModal() {
    elements.form.reset();
    elements.routineId.value = "";
    elements.memberId.disabled = false;
    elements.active.checked = true;

    exerciseDrafts = [];

    setDefaultDates();
    clearFormValidation();
    renderExerciseBuilder();

    elements.modalTitle.textContent =
        "Nueva rutina";

    elements.saveRoutineButton.textContent =
        "Guardar rutina";

    elements.modal.classList.remove("hidden");
}

function openEditModal() {
    if (!selectedRoutine) {
        return;
    }

    elements.routineId.value =
        selectedRoutine.id;

    elements.memberId.value =
        selectedRoutine.memberId;

    elements.memberId.disabled = true;

    elements.name.value =
        selectedRoutine.name || "";

    elements.level.value =
        selectedRoutine.level || "";

    elements.objective.value =
        selectedRoutine.objective || "";

    elements.startDate.value =
        selectedRoutine.startDate || "";

    elements.endDate.value =
        selectedRoutine.endDate || "";

    elements.daysPerWeek.value =
        selectedRoutine.daysPerWeek ?? "";

    elements.duration.value =
        selectedRoutine.estimatedDurationMinutes ?? "";

    elements.observations.value =
        selectedRoutine.observations || "";

    elements.active.checked =
        Boolean(selectedRoutine.active);

    exerciseDrafts = (
        selectedRoutine.exercises || []
    ).map((exercise, index) => ({
        internalId: createInternalId(),
        name: exercise.name || "",
        muscleGroup: exercise.muscleGroup || "",
        setsCount: exercise.setsCount ?? "",
        repetitions: exercise.repetitions || "",
        loadKg: exercise.loadKg ?? "",
        restSeconds: exercise.restSeconds ?? "",
        exerciseOrder:
            exercise.exerciseOrder ?? index + 1,
        instructions: exercise.instructions || "",
        active: exercise.active !== false
    }));

    clearFormValidation();
    renderExerciseBuilder();

    elements.modalTitle.textContent =
        "Editar rutina";

    elements.saveRoutineButton.textContent =
        "Actualizar rutina";

    elements.modal.classList.remove("hidden");
}

function duplicateSelectedRoutine() {
    if (!selectedRoutine) {
        return;
    }

    elements.form.reset();
    elements.routineId.value = "";
    elements.memberId.disabled = false;

    elements.memberId.value =
        selectedRoutine.memberId;

    elements.name.value =
        `${selectedRoutine.name} - Copia`;

    elements.level.value =
        selectedRoutine.level || "";

    elements.objective.value =
        selectedRoutine.objective || "";

    setDefaultDates();

    elements.daysPerWeek.value =
        selectedRoutine.daysPerWeek ?? "";

    elements.duration.value =
        selectedRoutine.estimatedDurationMinutes ?? "";

    elements.observations.value =
        selectedRoutine.observations || "";

    elements.active.checked = true;

    exerciseDrafts = (
        selectedRoutine.exercises || []
    ).map((exercise, index) => ({
        internalId: createInternalId(),
        name: exercise.name || "",
        muscleGroup: exercise.muscleGroup || "",
        setsCount: exercise.setsCount ?? "",
        repetitions: exercise.repetitions || "",
        loadKg: exercise.loadKg ?? "",
        restSeconds: exercise.restSeconds ?? "",
        exerciseOrder: index + 1,
        instructions: exercise.instructions || "",
        active: true
    }));

    clearFormValidation();
    renderExerciseBuilder();

    elements.modalTitle.textContent =
        "Duplicar rutina";

    elements.saveRoutineButton.textContent =
        "Crear copia";

    elements.modal.classList.remove("hidden");
}

function closeModal() {
    elements.modal.classList.add("hidden");
    elements.form.reset();
    elements.routineId.value = "";
    elements.memberId.disabled = false;
    exerciseDrafts = [];
    clearFormValidation();
    renderExerciseBuilder();
}

function addExerciseDraft() {
    exerciseDrafts.push({
        internalId: createInternalId(),
        name: "",
        muscleGroup: "",
        setsCount: "",
        repetitions: "",
        loadKg: "",
        restSeconds: "",
        exerciseOrder: exerciseDrafts.length + 1,
        instructions: "",
        active: true
    });

    renderExerciseBuilder();

    const cards = elements.exerciseBuilderList
        .querySelectorAll(".exercise-builder-card");

    cards[cards.length - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}

function renderExerciseBuilder() {
    elements.exerciseBuilderList.innerHTML = "";

    if (exerciseDrafts.length === 0) {
        elements.exerciseBuilderEmpty.classList.remove(
            "hidden"
        );
        return;
    }

    elements.exerciseBuilderEmpty.classList.add(
        "hidden"
    );

    normalizeExerciseOrder();

    elements.exerciseBuilderList.innerHTML =
        exerciseDrafts
            .map(createExerciseBuilderCard)
            .join("");
}

function createExerciseBuilderCard(exercise, index) {
    return `
        <article
            class="exercise-builder-card"
            data-exercise-id="${exercise.internalId}"
        >

            <div class="exercise-builder-card-header">

                <h4>
                    Ejercicio ${index + 1}
                </h4>

                <div class="exercise-builder-actions">

                    <button
                        class="exercise-builder-action"
                        type="button"
                        data-exercise-action="up"
                        title="Subir"
                    >
                        ↑
                    </button>

                    <button
                        class="exercise-builder-action"
                        type="button"
                        data-exercise-action="down"
                        title="Bajar"
                    >
                        ↓
                    </button>

                    <button
                        class="exercise-builder-action"
                        type="button"
                        data-exercise-action="duplicate"
                        title="Duplicar"
                    >
                        ⧉
                    </button>

                    <button
                        class="exercise-builder-action danger"
                        type="button"
                        data-exercise-action="remove"
                        title="Eliminar"
                    >
                        ×
                    </button>

                </div>

            </div>

            <div class="exercise-builder-grid">

                <label class="wide">
                    Nombre del ejercicio *

                    <input
                        type="text"
                        maxlength="150"
                        data-exercise-field="name"
                        value="${escapeAttribute(exercise.name)}"
                        placeholder="Ej. Press de banca"
                    >
                </label>

                <label>
                    Grupo muscular

                    <input
                        type="text"
                        maxlength="100"
                        data-exercise-field="muscleGroup"
                        value="${escapeAttribute(
                            exercise.muscleGroup
                        )}"
                        placeholder="Ej. Pecho"
                    >
                </label>

                <label>
                    Orden

                    <input
                        type="number"
                        min="1"
                        data-exercise-field="exerciseOrder"
                        value="${exercise.exerciseOrder}"
                    >
                </label>

                <label>
                    Series

                    <input
                        type="number"
                        min="1"
                        data-exercise-field="setsCount"
                        value="${exercise.setsCount}"
                    >
                </label>

                <label>
                    Repeticiones

                    <input
                        type="text"
                        maxlength="50"
                        data-exercise-field="repetitions"
                        value="${escapeAttribute(
                            exercise.repetitions
                        )}"
                        placeholder="Ej. 12"
                    >
                </label>

                <label>
                    Carga (kg)

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        data-exercise-field="loadKg"
                        value="${exercise.loadKg}"
                    >
                </label>

                <label>
                    Descanso (seg)

                    <input
                        type="number"
                        min="0"
                        data-exercise-field="restSeconds"
                        value="${exercise.restSeconds}"
                    >
                </label>

                <label class="full">
                    Instrucciones

                    <textarea
                        maxlength="5000"
                        data-exercise-field="instructions"
                        placeholder="Técnica, postura y recomendaciones..."
                    >${escapeHtml(exercise.instructions)}</textarea>
                </label>

            </div>

        </article>
    `;
}

function handleExerciseInput(event) {
    const field = event.target.closest(
        "[data-exercise-field]"
    );

    if (!field) {
        return;
    }

    const card = field.closest(
        "[data-exercise-id]"
    );

    if (!card) {
        return;
    }

    const exercise = exerciseDrafts.find(
        current =>
            current.internalId === card.dataset.exerciseId
    );

    if (!exercise) {
        return;
    }

    exercise[field.dataset.exerciseField] =
        field.value;
}

function handleExerciseAction(event) {
    const button = event.target.closest(
        "[data-exercise-action]"
    );

    if (!button) {
        return;
    }

    const card = button.closest(
        "[data-exercise-id]"
    );

    if (!card) {
        return;
    }

    const index = exerciseDrafts.findIndex(
        exercise =>
            exercise.internalId === card.dataset.exerciseId
    );

    if (index < 0) {
        return;
    }

    const action = button.dataset.exerciseAction;

    if (action === "up" && index > 0) {
        [
            exerciseDrafts[index - 1],
            exerciseDrafts[index]
        ] = [
            exerciseDrafts[index],
            exerciseDrafts[index - 1]
        ];
    }

    if (
        action === "down"
        && index < exerciseDrafts.length - 1
    ) {
        [
            exerciseDrafts[index],
            exerciseDrafts[index + 1]
        ] = [
            exerciseDrafts[index + 1],
            exerciseDrafts[index]
        ];
    }

    if (action === "duplicate") {
        const source = exerciseDrafts[index];

        exerciseDrafts.splice(index + 1, 0, {
            ...source,
            internalId: createInternalId(),
            name: source.name
                ? `${source.name} - Copia`
                : ""
        });
    }

    if (action === "remove") {
        exerciseDrafts.splice(index, 1);
    }

    renderExerciseBuilder();
}

async function saveRoutine(event) {
    event.preventDefault();

    synchronizeExerciseFields();

    if (!validateRoutineForm()) {
        return;
    }

    const routineId = elements.routineId.value;

    const payload = {
        memberId:
            routineId && selectedRoutine
                ? selectedRoutine.memberId
                : Number(elements.memberId.value),

        name:
            elements.name.value.trim(),

        objective:
            emptyToNull(elements.objective.value),

        level:
            emptyToNull(elements.level.value),

        startDate:
            emptyToNull(elements.startDate.value),

        endDate:
            emptyToNull(elements.endDate.value),

        daysPerWeek:
            integerOrNull(elements.daysPerWeek.value),

        estimatedDurationMinutes:
            integerOrNull(elements.duration.value),

        observations:
            emptyToNull(elements.observations.value),

        active:
            elements.active.checked,

        exercises:
            exerciseDrafts.map((exercise, index) => ({
                name: exercise.name.trim(),

                muscleGroup:
                    emptyToNull(exercise.muscleGroup),

                setsCount:
                    integerOrNull(exercise.setsCount),

                repetitions:
                    emptyToNull(exercise.repetitions),

                loadKg:
                    numberOrNull(exercise.loadKg),

                restSeconds:
                    integerOrNull(exercise.restSeconds),

                exerciseOrder:
                    index + 1,

                instructions:
                    emptyToNull(exercise.instructions),

                active: true
            }))
    };

    const url = routineId
        ? `${ROUTINES_API}/${routineId}`
        : ROUTINES_API;

    const method = routineId
        ? "PUT"
        : "POST";

    const originalText =
        elements.saveRoutineButton.textContent;

    elements.saveRoutineButton.disabled = true;

    elements.saveRoutineButton.textContent =
        routineId
            ? "Actualizando..."
            : "Guardando...";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const body = await response
            .json()
            .catch(() => null);

        if (!response.ok) {
            throw new Error(
                extractErrorMessage(body)
            );
        }

        closeModal();
        await loadRoutines();

        const savedRoutine = routines.find(
            routine => routine.id === body?.id
        );

        if (savedRoutine) {
            selectRoutine(savedRoutine);
        }
    } catch (error) {
        console.error(error);
        showFormMessage(error.message);
    } finally {
        elements.saveRoutineButton.disabled = false;
        elements.saveRoutineButton.textContent =
            originalText;
    }
}

async function deactivateSelectedRoutine() {
    if (!selectedRoutine || !selectedRoutine.active) {
        return;
    }

    const confirmed = window.confirm(
        `¿Deseas desactivar la rutina "${selectedRoutine.name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${ROUTINES_API}/${selectedRoutine.id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            const body = await response
                .json()
                .catch(() => null);

            throw new Error(
                extractErrorMessage(body)
            );
        }

        await loadRoutines();
    } catch (error) {
        console.error(error);
        window.alert(error.message);
    }
}

function validateRoutineForm() {
    const validMember = validateMember();
    const validName = validateName();
    const validDates = validateDates();
    const validDays = validateDays();
    const validDuration = validateDuration();
    const validExercises = validateExercises();

    return (
        validMember
        && validName
        && validDates
        && validDays
        && validDuration
        && validExercises
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
    const valid =
        elements.name.value.trim().length > 0;

    setValidationState(
        elements.name,
        elements.nameValidation,
        valid,
        valid
            ? "Nombre válido"
            : "El nombre de la rutina es obligatorio"
    );

    return valid;
}

function validateDates() {
    clearValidationState(
        elements.startDate,
        elements.startDateValidation
    );

    if (!elements.endDate.value) {
        clearValidationState(
            elements.endDate,
            elements.endDateValidation
        );

        return true;
    }

    const startDate = elements.startDate.value
        ? new Date(`${elements.startDate.value}T00:00:00`)
        : new Date();

    const endDate =
        new Date(`${elements.endDate.value}T00:00:00`);

    const valid = endDate >= startDate;

    setValidationState(
        elements.endDate,
        elements.endDateValidation,
        valid,
        valid
            ? "Periodo válido"
            : "La fecha final no puede ser anterior a la fecha inicial"
    );

    return valid;
}

function validateDays() {
    if (elements.daysPerWeek.value === "") {
        clearValidationState(
            elements.daysPerWeek,
            elements.daysValidation
        );

        return true;
    }

    const value = Number(
        elements.daysPerWeek.value
    );

    const valid =
        Number.isInteger(value)
        && value >= 1
        && value <= 7;

    setValidationState(
        elements.daysPerWeek,
        elements.daysValidation,
        valid,
        valid
            ? "Frecuencia válida"
            : "Ingrese un valor entre 1 y 7"
    );

    return valid;
}

function validateDuration() {
    if (elements.duration.value === "") {
        clearValidationState(
            elements.duration,
            elements.durationValidation
        );

        return true;
    }

    const value = Number(elements.duration.value);

    const valid =
        Number.isFinite(value)
        && value > 0
        && value <= 600;

    setValidationState(
        elements.duration,
        elements.durationValidation,
        valid,
        valid
            ? "Duración válida"
            : "Ingrese una duración entre 1 y 600 minutos"
    );

    return valid;
}

function validateExercises() {
    const invalidExercise = exerciseDrafts.find(
        exercise => !exercise.name.trim()
    );

    if (invalidExercise) {
        showFormMessage(
            "Todos los ejercicios deben tener un nombre."
        );

        return false;
    }

    elements.formMessage.textContent = "";
    return true;
}

function synchronizeExerciseFields() {
    elements.exerciseBuilderList
        .querySelectorAll("[data-exercise-id]")
        .forEach(card => {
            const exercise = exerciseDrafts.find(
                current =>
                    current.internalId
                    === card.dataset.exerciseId
            );

            if (!exercise) {
                return;
            }

            card.querySelectorAll(
                "[data-exercise-field]"
            ).forEach(field => {
                exercise[field.dataset.exerciseField] =
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
    const currentValue =
        elements.routineMemberFilter.value;

    elements.routineMemberFilter.innerHTML = `
        <option value="all">
            Todos
        </option>
    `;

    members.forEach(member => {
        const option = document.createElement("option");

        option.value = member.id;
        option.textContent = member.fullName;

        elements.routineMemberFilter.appendChild(
            option
        );
    });

    if (currentValue) {
        elements.routineMemberFilter.value =
            currentValue;
    }
}

function normalizeExerciseOrder() {
    exerciseDrafts.forEach((exercise, index) => {
        exercise.exerciseOrder = index + 1;
    });
}

function clearSelectedRoutine() {
    selectedRoutine = null;

    elements.routineDetailSection.classList.add(
        "hidden"
    );
}

function clearFormValidation() {
    clearValidationState(
        elements.memberId,
        elements.memberValidation
    );

    clearValidationState(
        elements.name,
        elements.nameValidation
    );

    clearValidationState(
        elements.startDate,
        elements.startDateValidation
    );

    clearValidationState(
        elements.endDate,
        elements.endDateValidation
    );

    clearValidationState(
        elements.daysPerWeek,
        elements.daysValidation
    );

    clearValidationState(
        elements.duration,
        elements.durationValidation
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
    const startDate = today.toISOString().slice(0, 10);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30);

    elements.startDate.value = startDate;
    elements.endDate.value =
        endDate.toISOString().slice(0, 10);
}

function showLoading(show) {
    elements.routinesLoading.style.display =
        show ? "block" : "none";
}

function showRoutinesError(message) {
    elements.routinesError.textContent = message;
    elements.routinesError.classList.remove("hidden");
}

function hideRoutinesError() {
    elements.routinesError.textContent = "";
    elements.routinesError.classList.add("hidden");
}

function showFormMessage(message) {
    elements.formMessage.textContent = message;
}

function calculateTotalSets(exercises) {
    return (exercises || []).reduce(
        (total, exercise) =>
            total + (
                Number(exercise.setsCount) || 0
            ),
        0
    );
}

function calculateAverage(values) {
    return values.reduce(
        (total, value) => total + value,
        0
    ) / values.length;
}

function formatLevel(level) {
    if (!level) {
        return "Sin nivel";
    }

    return String(level)
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
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

function getInitials(fullName) {
    const parts = String(fullName || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) {
        return "RT";
    }

    const first = parts[0].charAt(0);

    const last = parts.length > 1
        ? parts[parts.length - 1].charAt(0)
        : "";

    return `${first}${last}`.toUpperCase();
}

function createInternalId() {
    return `exercise-${Date.now()}-${Math.random()
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

    if (body.errors && Array.isArray(body.errors)) {
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
        initializeRoutineDashboard,
        { once: true }
    );
} else {
    initializeRoutineDashboard();
}
