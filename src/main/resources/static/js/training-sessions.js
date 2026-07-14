console.log("training-sessions.js cargado correctamente");

const API = {
    sessions: "/api/v1/training-sessions",
    members: "/api/v1/members",
    routines: "/api/v1/training-routines"
};

let sessions = [];
let members = [];
let routines = [];
let selectedSession = null;
let editingSessionId = null;
let performedExercises = [];

const $ = (id) => document.getElementById(id);

const ui = {
    heroCount: $("heroSessionCount"),
    totalCount: $("totalSessionsCount"),
    completedCount: $("completedSessionsCount"),
    totalSteps: $("totalStepsValue"),
    totalCalories: $("totalCaloriesValue"),

    historyTab: $("historyTabButton"),
    registerTab: $("registerTabButton"),
    historyPanel: $("sessionHistoryPanel"),
    registerPanel: $("sessionRegisterPanel"),

    newButton: $("newSessionButton"),
    backButton: $("backToHistoryButton"),
    refreshButton: $("refreshSessionsButton"),

    search: $("sessionSearchInput"),
    memberFilter: $("sessionMemberFilter"),
    activityFilter: $("sessionActivityFilter"),
    loading: $("sessionsLoading"),
    error: $("sessionsError"),
    empty: $("sessionsEmpty"),
    tableBody: $("sessionsTableBody"),

    form: $("trainingSessionForm"),
    formTitle: $("sessionFormTitle"),
    sessionId: $("trainingSessionId"),
    memberId: $("trainingSessionMemberId"),
    routineId: $("trainingSessionRoutineId"),
    date: $("trainingSessionDate"),
    activity: $("trainingSessionActivityType"),
    startTime: $("trainingSessionStartTime"),
    endTime: $("trainingSessionEndTime"),
    duration: $("trainingSessionDuration"),
    cardio: $("trainingSessionCardioMinutes"),
    steps: $("trainingSessionSteps"),
    distance: $("trainingSessionDistance"),
    calories: $("trainingSessionCalories"),
    floors: $("trainingSessionFloors"),
    avgHr: $("trainingSessionAverageHeartRate"),
    maxHr: $("trainingSessionMaximumHeartRate"),
    effort: $("trainingSessionEffortLevel"),
    pain: $("trainingSessionPainLevel"),
    observations: $("trainingSessionObservations"),
    completed: $("trainingSessionCompleted"),
    active: $("trainingSessionActive"),

    memberValidation: $("sessionMemberValidation"),
    timeValidation: $("sessionTimeValidation"),
    formMessage: $("trainingSessionFormMessage"),

    addExerciseButton: $("addPerformedExerciseButton"),
    exercisesList: $("performedExercisesList"),
    exercisesEmpty: $("performedExercisesEmpty"),

    cancelButton: $("cancelTrainingSessionButton"),
    saveButton: $("saveTrainingSessionButton"),

    detailSection: $("sessionDetailSection"),
    detailAvatar: $("sessionDetailAvatar"),
    detailMember: $("sessionDetailMember"),
    detailRoutine: $("sessionDetailRoutine"),
    detailActivity: $("sessionDetailActivity"),
    detailStatus: $("sessionDetailStatus"),
    detailDate: $("sessionDetailDate"),
    detailDuration: $("sessionDetailDuration"),
    detailCompletion: $("sessionDetailCompletion"),
    detailVolume: $("sessionDetailVolume"),
    detailSteps: $("detailSteps"),
    detailDistance: $("detailDistance"),
    detailCardio: $("detailCardio"),
    detailCalories: $("detailCalories"),
    detailFloors: $("detailFloors"),
    detailAvgHr: $("detailAverageHeartRate"),
    detailEffort: $("detailEffort"),
    detailPain: $("detailPain"),
    exerciseBadge: $("sessionExerciseBadge"),
    executedList: $("sessionExecutedExercisesList"),
    detailObservations: $("sessionDetailObservations"),

    editButton: $("editTrainingSessionButton"),
    deactivateButton: $("deactivateTrainingSessionButton"),
    printButton: $("printTrainingSessionButton")
};

async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        cache: "no-store",
        ...options,
        headers: {
            Accept: "application/json",
            ...(options.body ? {"Content-Type": "application/json"} : {}),
            ...(options.headers || {})
        }
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(extractError(body, response.status));
    }

    return body;
}

async function initialize() {
    bindEvents();
    resetForm();

    await Promise.all([
        loadMembers(),
        loadSessions()
    ]);
}

function bindEvents() {
    ui.historyTab.addEventListener("click", () => showPanel("history"));
    ui.registerTab.addEventListener("click", openCreateForm);
    ui.newButton.addEventListener("click", openCreateForm);
    ui.backButton.addEventListener("click", () => showPanel("history"));
    ui.cancelButton.addEventListener("click", () => showPanel("history"));
    ui.refreshButton.addEventListener("click", loadSessions);

    ui.search.addEventListener("input", applyFilters);
    ui.memberFilter.addEventListener("change", applyFilters);
    ui.activityFilter.addEventListener("change", applyFilters);
    ui.tableBody.addEventListener("click", handleTableClick);

    ui.memberId.addEventListener("change", handleMemberChange);
    ui.routineId.addEventListener("change", loadRoutineExercises);
    ui.startTime.addEventListener("change", updateDurationFromTimes);
    ui.endTime.addEventListener("change", updateDurationFromTimes);

    ui.addExerciseButton.addEventListener("click", addFreeExercise);
    ui.exercisesList.addEventListener("input", syncExerciseField);
    ui.exercisesList.addEventListener("change", syncExerciseField);
    ui.exercisesList.addEventListener("click", handleExerciseAction);

    ui.form.addEventListener("submit", saveSession);
    ui.editButton.addEventListener("click", openEditForm);
    ui.deactivateButton.addEventListener("click", deactivateSelected);
    ui.printButton.addEventListener("click", () => window.print());
}

async function loadMembers() {
    try {
        const data = await apiRequest(API.members);
        members = Array.isArray(data) ? data : [];
        renderMemberSelectors();
    } catch (error) {
        showError(error.message);
    }
}

async function loadSessions() {
    setLoading(true);
    clearError();

    try {
        const data = await apiRequest(API.sessions);
        sessions = Array.isArray(data) ? data : [];

        updateKpis();
        applyFilters();

        if (selectedSession) {
            const refreshed = sessions.find(item => item.id === selectedSession.id);
            refreshed ? selectSession(refreshed, false) : clearSelected();
        }
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

function updateKpis() {
    const completed = sessions.filter(item => item.completed).length;
    const steps = sessions.reduce((sum, item) => sum + Number(item.steps || 0), 0);
    const calories = sessions.reduce((sum, item) => sum + Number(item.caloriesBurned || 0), 0);

    ui.heroCount.textContent = sessions.length;
    ui.totalCount.textContent = sessions.length;
    ui.completedCount.textContent = completed;
    ui.totalSteps.textContent = formatInteger(steps);
    ui.totalCalories.textContent = formatInteger(calories);
}

function applyFilters() {
    const query = ui.search.value.trim().toLowerCase();
    const memberId = ui.memberFilter.value;
    const activity = ui.activityFilter.value;

    const filtered = sessions.filter(item => {
        const text = [
            item.memberFullName,
            item.memberIdentification,
            item.routineName,
            item.activityType,
            item.observations
        ].filter(Boolean).join(" ").toLowerCase();

        return (
            (query === "" || text.includes(query)) &&
            (memberId === "all" || String(item.memberId) === memberId) &&
            (activity === "all" || item.activityType === activity)
        );
    });

    renderSessions(filtered);
}

function renderSessions(data) {
    if (!data.length) {
        ui.empty.classList.remove("hidden");
        ui.tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="empty-table">
                    No existen sesiones que coincidan con los filtros.
                </td>
            </tr>
        `;
        return;
    }

    ui.empty.classList.add("hidden");

    ui.tableBody.innerHTML = data.map(item => `
        <tr data-session-id="${item.id}">
            <td>
                <div class="member-name-cell">
                    <span class="member-initials">${escapeHtml(initials(item.memberFullName))}</span>
                    <div>
                        <strong>${escapeHtml(item.memberFullName)}</strong>
                        <small>${escapeHtml(item.memberIdentification)}</small>
                    </div>
                </div>
            </td>
            <td>${formatDate(item.sessionDate)}</td>
            <td><span class="session-activity-badge">${formatActivity(item.activityType)}</span></td>
            <td>${item.durationMinutes ?? "—"} min</td>
            <td>${formatInteger(item.steps || 0)}</td>
            <td>${formatInteger(item.caloriesBurned || 0)} kcal</td>
            <td>${Number(item.completionPercentage || 0).toFixed(0)}%</td>
            <td>
                <span class="enterprise-badge ${item.completed ? "active" : "inactive"}">
                    ${item.completed ? "Completada" : "Pendiente"}
                </span>
            </td>
            <td class="actions-cell">
                <div class="action-buttons">
                    <button type="button" data-action="view">Ver</button>
                    <button type="button" data-action="edit">Editar</button>
                    ${item.active ? `<button type="button" data-action="deactivate">Desactivar</button>` : ""}
                </div>
            </td>
        </tr>
    `).join("");
}

function handleTableClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const row = button.closest("[data-session-id]");
    const session = sessions.find(item => item.id === Number(row?.dataset.sessionId));
    if (!session) return;

    selectedSession = session;

    if (button.dataset.action === "view") selectSession(session);
    if (button.dataset.action === "edit") openEditForm();
    if (button.dataset.action === "deactivate") deactivateSelected();
}

function selectSession(item, scroll = true) {
    selectedSession = item;
    ui.detailSection.classList.remove("hidden");

    ui.detailAvatar.textContent = initials(item.memberFullName);
    ui.detailMember.textContent = item.memberFullName;
    ui.detailRoutine.textContent = item.routineName || "Actividad libre, sin rutina";
    ui.detailActivity.textContent = formatActivity(item.activityType);
    ui.detailStatus.textContent = item.completed ? "Completada" : "Pendiente";
    ui.detailStatus.className = `enterprise-badge ${item.completed ? "active" : "inactive"}`;
    ui.detailDate.textContent = formatDate(item.sessionDate);
    ui.detailDuration.textContent = item.durationMinutes == null ? "No registrada" : `${item.durationMinutes} minutos`;
    ui.detailCompletion.textContent = `${Number(item.completionPercentage || 0).toFixed(0)} %`;
    ui.detailVolume.textContent = `${formatDecimal(item.totalWeightVolumeKg || 0)} kg`;

    ui.detailSteps.textContent = formatInteger(item.steps || 0);
    ui.detailDistance.textContent = formatDecimal(item.distanceKm || 0);
    ui.detailCardio.textContent = formatInteger(item.cardioMinutes || 0);
    ui.detailCalories.textContent = formatInteger(item.caloriesBurned || 0);
    ui.detailFloors.textContent = formatInteger(item.floorsClimbed || 0);
    ui.detailAvgHr.textContent = item.averageHeartRate ?? "—";
    ui.detailEffort.textContent = item.effortLevel ?? "—";
    ui.detailPain.textContent = item.painLevel ?? "—";
    ui.exerciseBadge.textContent = `${item.exerciseCount || 0} ejercicio(s)`;
    ui.detailObservations.textContent = item.observations || "Sin observaciones registradas.";

    ui.deactivateButton.disabled = !item.active;
    ui.deactivateButton.textContent = item.active ? "Desactivar" : "Registro inactivo";

    renderExecutedExercises(item.performedExercises || []);

    if (scroll) {
        ui.detailSection.scrollIntoView({behavior: "smooth", block: "start"});
    }
}

function renderExecutedExercises(data) {
    if (!data.length) {
        ui.executedList.innerHTML = `
            <div class="enterprise-empty">
                <div class="enterprise-empty-icon">EX</div>
                <h4>Sin ejercicios detallados</h4>
                <p>La sesión contiene solamente indicadores generales.</p>
            </div>
        `;
        return;
    }

    ui.executedList.innerHTML = [...data]
        .sort((a, b) => Number(a.exerciseOrder || 0) - Number(b.exerciseOrder || 0))
        .map((exercise, index) => `
            <article class="session-executed-exercise">
                <div class="session-executed-order">${exercise.exerciseOrder || index + 1}</div>
                <div class="session-executed-info">
                    <strong>${escapeHtml(exercise.exerciseName)}</strong>
                    <small>${escapeHtml(exercise.exerciseType || "Sin tipo")} · ${exercise.completed ? "Completado" : "Pendiente"}</small>
                </div>
                <div class="session-executed-value"><strong>${exercise.setsCompleted ?? "—"}</strong><span>Series</span></div>
                <div class="session-executed-value"><strong>${escapeHtml(exercise.repetitionsCompleted || "—")}</strong><span>Repeticiones</span></div>
                <div class="session-executed-value"><strong>${formatDecimal(exercise.weightKg || 0)}</strong><span>Kg</span></div>
                <div class="session-executed-value"><strong>${exercise.durationMinutes ?? "—"}</strong><span>Minutos</span></div>
            </article>
        `).join("");
}

function showPanel(panel) {
    const history = panel === "history";

    ui.historyTab.classList.toggle("active", history);
    ui.registerTab.classList.toggle("active", !history);
    ui.historyPanel.classList.toggle("hidden", !history);
    ui.registerPanel.classList.toggle("hidden", history);

    if (history) {
        ui.detailSection.classList.toggle("hidden", !selectedSession);
    } else {
        ui.detailSection.classList.add("hidden");
    }
}

function openCreateForm() {
    resetForm();
    ui.formTitle.textContent = "Registrar nueva sesión";
    ui.saveButton.textContent = "Guardar sesión";
    showPanel("register");
}

function resetForm() {
    editingSessionId = null;
    performedExercises = [];

    ui.form.reset();
    ui.sessionId.value = "";
    ui.memberId.disabled = false;
    ui.date.value = todayInput();
    ui.activity.value = "FUERZA";
    ui.completed.checked = true;
    ui.active.checked = true;

    renderRoutineOptions([]);
    renderExerciseBuilder();
    clearValidation();
}

async function handleMemberChange() {
    validateMember();
    performedExercises = [];
    renderExerciseBuilder();

    const memberId = numberOrNull(ui.memberId.value);

    if (!memberId) {
        routines = [];
        renderRoutineOptions([]);
        return;
    }

    try {
        const data = await apiRequest(`${API.routines}/member/${memberId}?active=true`);
        routines = Array.isArray(data) ? data : [];
        renderRoutineOptions(routines);
    } catch (error) {
        routines = [];
        renderRoutineOptions([]);
        showFormMessage(error.message);
    }
}

async function loadRoutineExercises() {
    const routineId = numberOrNull(ui.routineId.value);

    if (!routineId) {
        performedExercises = [];
        renderExerciseBuilder();
        return;
    }

    try {
        const routine = await apiRequest(`${API.routines}/${routineId}`);

        performedExercises = (routine.exercises || []).map((exercise, index) => ({
            key: createKey(),
            routineExerciseId: exercise.id,
            exerciseName: exercise.name || "",
            exerciseType: inferType(exercise.name, exercise.muscleGroup),
            setsCompleted: exercise.setsCount ?? "",
            repetitionsCompleted: exercise.repetitions || "",
            weightKg: exercise.loadKg ?? "",
            durationMinutes: "",
            distanceKm: "",
            caloriesBurned: "",
            averageHeartRate: "",
            effortLevel: "",
            painLevel: "",
            completed: false,
            active: true,
            observations: exercise.instructions || "",
            exerciseOrder: index + 1
        }));

        renderExerciseBuilder();
    } catch (error) {
        showFormMessage(error.message);
    }
}

function renderMemberSelectors() {
    ui.memberId.innerHTML = `
        <option value="">Seleccione un deportista</option>
        ${members.filter(item => item.active).map(item => `
            <option value="${item.id}">
                ${escapeHtml(item.fullName)} — ${escapeHtml(item.identification)}
            </option>
        `).join("")}
    `;

    ui.memberFilter.innerHTML = `
        <option value="all">Todos</option>
        ${members.map(item => `
            <option value="${item.id}">${escapeHtml(item.fullName)}</option>
        `).join("")}
    `;
}

function renderRoutineOptions(data, selectedId = "") {
    ui.routineId.innerHTML = `
        <option value="">Actividad libre, sin rutina</option>
        ${data.map(item => `
            <option value="${item.id}" ${String(item.id) === String(selectedId) ? "selected" : ""}>
                ${escapeHtml(item.name)}
            </option>
        `).join("")}
    `;
}

function addFreeExercise() {
    performedExercises.push({
        key: createKey(),
        routineExerciseId: null,
        exerciseName: "",
        exerciseType: "OTRA",
        setsCompleted: "",
        repetitionsCompleted: "",
        weightKg: "",
        durationMinutes: "",
        distanceKm: "",
        caloriesBurned: "",
        averageHeartRate: "",
        effortLevel: "",
        painLevel: "",
        completed: false,
        active: true,
        observations: "",
        exerciseOrder: performedExercises.length + 1
    });

    renderExerciseBuilder();
}

function renderExerciseBuilder() {
    performedExercises.forEach((item, index) => item.exerciseOrder = index + 1);

    if (!performedExercises.length) {
        ui.exercisesEmpty.classList.remove("hidden");
        ui.exercisesList.innerHTML = "";
        return;
    }

    ui.exercisesEmpty.classList.add("hidden");

    ui.exercisesList.innerHTML = performedExercises.map((exercise, index) => `
        <article class="performed-exercise-card" data-exercise-key="${exercise.key}">
            <div class="performed-exercise-card-header">
                <h4>Ejercicio ${index + 1}</h4>
                <div class="performed-exercise-actions">
                    <button type="button" class="performed-exercise-action" data-action="up">↑</button>
                    <button type="button" class="performed-exercise-action" data-action="down">↓</button>
                    <button type="button" class="performed-exercise-action" data-action="duplicate">⧉</button>
                    <button type="button" class="performed-exercise-action" data-action="remove">×</button>
                </div>
            </div>

            <div class="performed-exercise-grid">
                <label class="wide">Nombre *
                    <input data-field="exerciseName" type="text" maxlength="150" value="${escapeHtml(exercise.exerciseName)}">
                </label>

                <label>Tipo
                    <select data-field="exerciseType">${activityOptions(exercise.exerciseType)}</select>
                </label>

                <label>Series
                    <input data-field="setsCompleted" type="number" min="0" value="${exercise.setsCompleted}">
                </label>

                <label>Repeticiones
                    <input data-field="repetitionsCompleted" type="text" maxlength="50" value="${escapeHtml(exercise.repetitionsCompleted)}">
                </label>

                <label>Peso (kg)
                    <input data-field="weightKg" type="number" min="0" step="0.01" value="${exercise.weightKg}">
                </label>

                <label>Duración
                    <input data-field="durationMinutes" type="number" min="0" value="${exercise.durationMinutes}">
                </label>

                <label>Distancia (km)
                    <input data-field="distanceKm" type="number" min="0" step="0.01" value="${exercise.distanceKm}">
                </label>

                <label>Calorías
                    <input data-field="caloriesBurned" type="number" min="0" value="${exercise.caloriesBurned}">
                </label>

                <label>FC promedio
                    <input data-field="averageHeartRate" type="number" min="1" max="250" value="${exercise.averageHeartRate}">
                </label>

                <label>Esfuerzo
                    <select data-field="effortLevel">${scaleOptions(exercise.effortLevel, 1)}</select>
                </label>

                <label>Dolor
                    <select data-field="painLevel">${scaleOptions(exercise.painLevel, 0)}</select>
                </label>

                <label class="performed-exercise-completed">
                    <input data-field="completed" type="checkbox" ${exercise.completed ? "checked" : ""}>
                    Completado
                </label>

                <label class="full">Observaciones
                    <textarea data-field="observations" maxlength="5000">${escapeHtml(exercise.observations)}</textarea>
                </label>
            </div>
        </article>
    `).join("");
}

function syncExerciseField(event) {
    const field = event.target.closest("[data-field]");
    const card = field?.closest("[data-exercise-key]");
    if (!field || !card) return;

    const exercise = performedExercises.find(item => item.key === card.dataset.exerciseKey);
    if (!exercise) return;

    exercise[field.dataset.field] =
        field.type === "checkbox" ? field.checked : field.value;
}

function handleExerciseAction(event) {
    const button = event.target.closest("[data-action]");
    const card = button?.closest("[data-exercise-key]");
    if (!button || !card) return;

    const index = performedExercises.findIndex(item => item.key === card.dataset.exerciseKey);
    if (index < 0) return;

    const action = button.dataset.action;

    if (action === "up" && index > 0) {
        [performedExercises[index - 1], performedExercises[index]] =
            [performedExercises[index], performedExercises[index - 1]];
    }

    if (action === "down" && index < performedExercises.length - 1) {
        [performedExercises[index], performedExercises[index + 1]] =
            [performedExercises[index + 1], performedExercises[index]];
    }

    if (action === "duplicate") {
        performedExercises.splice(index + 1, 0, {
            ...performedExercises[index],
            key: createKey(),
            routineExerciseId: null,
            exerciseName: `${performedExercises[index].exerciseName} - Copia`
        });
    }

    if (action === "remove") {
        performedExercises.splice(index, 1);
    }

    renderExerciseBuilder();
}

function updateDurationFromTimes() {
    if (!ui.startTime.value || !ui.endTime.value) return;

    const minutes = minutesBetween(ui.startTime.value, ui.endTime.value);

    if (minutes >= 0) {
        ui.duration.value = minutes;
    }

    validateTimes();
}

async function saveSession(event) {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = buildPayload();
    const editing = Boolean(editingSessionId);
    const url = editing ? `${API.sessions}/${editingSessionId}` : API.sessions;
    const method = editing ? "PUT" : "POST";
    const originalText = ui.saveButton.textContent;

    ui.saveButton.disabled = true;
    ui.saveButton.textContent = editing ? "Actualizando..." : "Guardando...";

    try {
        const saved = await apiRequest(url, {
            method,
            body: JSON.stringify(payload)
        });

        editingSessionId = null;
        await loadSessions();

        const refreshed = sessions.find(item => item.id === saved.id);
        if (refreshed) selectSession(refreshed, false);

        showPanel("history");
        alert(editing ? "Sesión actualizada correctamente." : "Sesión registrada correctamente.");
    } catch (error) {
        showFormMessage(error.message);
    } finally {
        ui.saveButton.disabled = false;
        ui.saveButton.textContent = originalText;
    }
}

function buildPayload() {
    return {
        memberId: Number(ui.memberId.value),
        routineId: numberOrNull(ui.routineId.value),
        sessionDate: emptyToNull(ui.date.value),
        startTime: apiTime(ui.startTime.value),
        endTime: apiTime(ui.endTime.value),
        activityType: ui.activity.value,
        durationMinutes: integerOrNull(ui.duration.value),
        steps: integerOrNull(ui.steps.value),
        distanceKm: numberOrNull(ui.distance.value),
        cardioMinutes: integerOrNull(ui.cardio.value),
        caloriesBurned: integerOrNull(ui.calories.value),
        floorsClimbed: integerOrNull(ui.floors.value),
        averageHeartRate: integerOrNull(ui.avgHr.value),
        maximumHeartRate: integerOrNull(ui.maxHr.value),
        effortLevel: integerOrNull(ui.effort.value),
        painLevel: integerOrNull(ui.pain.value),
        completed: ui.completed.checked,
        active: ui.active.checked,
        observations: emptyToNull(ui.observations.value),

        performedExercises: performedExercises.map((exercise, index) => ({
            routineExerciseId: exercise.routineExerciseId || null,
            exerciseName: String(exercise.exerciseName || "").trim(),
            exerciseType: emptyToNull(exercise.exerciseType),
            setsCompleted: integerOrNull(exercise.setsCompleted),
            repetitionsCompleted: emptyToNull(exercise.repetitionsCompleted),
            weightKg: numberOrNull(exercise.weightKg),
            durationMinutes: integerOrNull(exercise.durationMinutes),
            distanceKm: numberOrNull(exercise.distanceKm),
            caloriesBurned: integerOrNull(exercise.caloriesBurned),
            averageHeartRate: integerOrNull(exercise.averageHeartRate),
            effortLevel: integerOrNull(exercise.effortLevel),
            painLevel: integerOrNull(exercise.painLevel),
            completed: Boolean(exercise.completed),
            active: exercise.active !== false,
            observations: emptyToNull(exercise.observations),
            exerciseOrder: index + 1
        }))
    };
}

async function openEditForm() {
    if (!selectedSession) return;

    const item = selectedSession;

    editingSessionId = item.id;
    ui.sessionId.value = item.id;
    ui.formTitle.textContent = "Editar sesión";
    ui.saveButton.textContent = "Actualizar sesión";

    ui.memberId.value = item.memberId;
    ui.memberId.disabled = true;
    ui.date.value = item.sessionDate || "";
    ui.activity.value = item.activityType || "FUERZA";
    ui.startTime.value = inputTime(item.startTime);
    ui.endTime.value = inputTime(item.endTime);
    ui.duration.value = item.durationMinutes ?? "";
    ui.cardio.value = item.cardioMinutes ?? "";
    ui.steps.value = item.steps ?? "";
    ui.distance.value = item.distanceKm ?? "";
    ui.calories.value = item.caloriesBurned ?? "";
    ui.floors.value = item.floorsClimbed ?? "";
    ui.avgHr.value = item.averageHeartRate ?? "";
    ui.maxHr.value = item.maximumHeartRate ?? "";
    ui.effort.value = item.effortLevel ?? "";
    ui.pain.value = item.painLevel ?? "";
    ui.observations.value = item.observations || "";
    ui.completed.checked = Boolean(item.completed);
    ui.active.checked = Boolean(item.active);

    try {
        const data = await apiRequest(`${API.routines}/member/${item.memberId}`);
        routines = Array.isArray(data) ? data : [];
        renderRoutineOptions(routines, item.routineId || "");
    } catch {
        renderRoutineOptions([], "");
    }

    performedExercises = (item.performedExercises || []).map((exercise, index) => ({
        key: createKey(),
        routineExerciseId: exercise.routineExerciseId,
        exerciseName: exercise.exerciseName || "",
        exerciseType: exercise.exerciseType || "OTRA",
        setsCompleted: exercise.setsCompleted ?? "",
        repetitionsCompleted: exercise.repetitionsCompleted || "",
        weightKg: exercise.weightKg ?? "",
        durationMinutes: exercise.durationMinutes ?? "",
        distanceKm: exercise.distanceKm ?? "",
        caloriesBurned: exercise.caloriesBurned ?? "",
        averageHeartRate: exercise.averageHeartRate ?? "",
        effortLevel: exercise.effortLevel ?? "",
        painLevel: exercise.painLevel ?? "",
        completed: Boolean(exercise.completed),
        active: exercise.active !== false,
        observations: exercise.observations || "",
        exerciseOrder: exercise.exerciseOrder ?? index + 1
    }));

    renderExerciseBuilder();
    clearValidation();
    showPanel("register");
}

async function deactivateSelected() {
    if (!selectedSession || !selectedSession.active) return;

    if (!confirm(`¿Deseas desactivar la sesión de ${selectedSession.memberFullName}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API.sessions}/${selectedSession.id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(extractError(body, response.status));
        }

        await loadSessions();
    } catch (error) {
        alert(error.message);
    }
}

function validateForm() {
    const memberOk = validateMember();
    const timeOk = validateTimes();
    const exercisesOk = !performedExercises.some(
        item => !String(item.exerciseName || "").trim()
    );

    if (!exercisesOk) {
        showFormMessage("Todos los ejercicios deben tener nombre.");
    }

    return memberOk && timeOk && exercisesOk;
}

function validateMember() {
    const valid = Boolean(ui.memberId.value);
    validation(ui.memberId, ui.memberValidation, valid,
        valid ? "Deportista seleccionado" : "Debe seleccionar un deportista");
    return valid;
}

function validateTimes() {
    if (!ui.startTime.value || !ui.endTime.value) {
        clearFieldValidation(ui.endTime, ui.timeValidation);
        return true;
    }

    const valid = minutesBetween(ui.startTime.value, ui.endTime.value) >= 0;
    validation(ui.endTime, ui.timeValidation, valid,
        valid ? "Horario válido" : "La hora final no puede ser anterior");
    return valid;
}

function validation(field, message, valid, text) {
    field.classList.toggle("valid", valid);
    field.classList.toggle("invalid", !valid);
    message.textContent = text;
    message.classList.toggle("success", valid);
    message.classList.toggle("error", !valid);
}

function clearFieldValidation(field, message) {
    field.classList.remove("valid", "invalid");
    message.textContent = "";
}

function clearValidation() {
    clearFieldValidation(ui.memberId, ui.memberValidation);
    clearFieldValidation(ui.endTime, ui.timeValidation);
    showFormMessage("");
}

function clearSelected() {
    selectedSession = null;
    ui.detailSection.classList.add("hidden");
}

function setLoading(show) {
    ui.loading.style.display = show ? "block" : "none";
}

function showError(message) {
    ui.error.textContent = message;
    ui.error.classList.remove("hidden");
}

function clearError() {
    ui.error.textContent = "";
    ui.error.classList.add("hidden");
}

function showFormMessage(message) {
    ui.formMessage.textContent = message || "";
}

function activityOptions(selected) {
    const values = [
        ["FUERZA", "Fuerza"], ["CARDIO", "Cardio"], ["CAMINATA", "Caminata"],
        ["CARRERA", "Carrera"], ["BICICLETA", "Bicicleta"], ["ESCALERAS", "Escaleras"],
        ["NATACION", "Natación"], ["MOVILIDAD", "Movilidad"],
        ["REHABILITACION", "Rehabilitación"], ["OTRA", "Otra"]
    ];

    return values.map(([value, label]) =>
        `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`
    ).join("");
}

function scaleOptions(selected, minimum) {
    let result = `<option value="">No registrado</option>`;

    for (let value = minimum; value <= 10; value++) {
        result += `<option value="${value}" ${String(value) === String(selected) ? "selected" : ""}>${value}</option>`;
    }

    return result;
}

function inferType(name, muscleGroup) {
    const text = `${name || ""} ${muscleGroup || ""}`.toLowerCase();

    if (text.includes("bicicleta") || text.includes("cardio") || text.includes("camin")) {
        return "CARDIO";
    }

    if (text.includes("movilidad") || text.includes("estiramiento")) {
        return "MOVILIDAD";
    }

    return "FUERZA";
}

function formatActivity(value) {
    return String(value || "Sin tipo")
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(value) {
    if (!value) return "—";

    return new Intl.DateTimeFormat("es-EC", {
        year: "numeric",
        month: "short",
        day: "2-digit"
    }).format(new Date(`${value}T00:00:00`));
}

function todayInput() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function minutesBetween(start, end) {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    return (eh * 60 + em) - (sh * 60 + sm);
}

function apiTime(value) {
    return value ? (value.length === 5 ? `${value}:00` : value) : null;
}

function inputTime(value) {
    return value ? String(value).slice(0, 5) : "";
}

function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "SE";
    return `${parts[0][0]}${parts.length > 1 ? parts.at(-1)[0] : ""}`.toUpperCase();
}

function createKey() {
    return `exercise-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatInteger(value) {
    return new Intl.NumberFormat("es-EC", {maximumFractionDigits: 0})
        .format(Number(value || 0));
}

function formatDecimal(value) {
    return new Intl.NumberFormat("es-EC", {maximumFractionDigits: 2})
        .format(Number(value || 0));
}

function emptyToNull(value) {
    const text = String(value ?? "").trim();
    return text === "" ? null : text;
}

function numberOrNull(value) {
    if (value === "" || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function integerOrNull(value) {
    const number = numberOrNull(value);
    return number == null ? null : Math.trunc(number);
}

function extractError(body, status) {
    if (!body) return `No fue posible completar la operación. HTTP ${status}`;
    if (body.message) return body.message;
    if (body.validationErrors) return Object.values(body.validationErrors).join(". ");
    if (Array.isArray(body.errors)) {
        return body.errors
            .map(item => item.defaultMessage || item.message)
            .filter(Boolean)
            .join(". ");
    }
    return body.error || `Error HTTP ${status}`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, {once: true});
} else {
    initialize();
}