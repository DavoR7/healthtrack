console.log("physical-assessments.js cargado correctamente");

const ASSESSMENTS_API = "/api/v1/physical-assessments";
const MEMBERS_API = "/api/v1/members";

let assessments = [];
let members = [];
let selectedAssessment = null;

const elements = {
    heroAssessmentCount:
        document.getElementById("heroAssessmentCount"),

    totalAssessmentsCount:
        document.getElementById("totalAssessmentsCount"),

    normalBmiCount:
        document.getElementById("normalBmiCount"),

    averageWeightValue:
        document.getElementById("averageWeightValue"),

    averageOxygenValue:
        document.getElementById("averageOxygenValue"),

    newAssessmentButton:
        document.getElementById("newAssessmentButton"),

    assessmentSearchInput:
        document.getElementById("assessmentSearchInput"),

    assessmentMemberFilter:
        document.getElementById("assessmentMemberFilter"),

    refreshAssessmentsButton:
        document.getElementById("refreshAssessmentsButton"),

    assessmentsLoading:
        document.getElementById("assessmentsLoading"),

    assessmentsError:
        document.getElementById("assessmentsError"),

    assessmentsTableBody:
        document.getElementById("assessmentsTableBody"),

    assessmentDetailSection:
        document.getElementById("assessmentDetailSection"),

    assessmentProfileAvatar:
        document.getElementById("assessmentProfileAvatar"),

    assessmentProfileName:
        document.getElementById("assessmentProfileName"),

    assessmentProfileIdentification:
        document.getElementById("assessmentProfileIdentification"),

    assessmentProfileDate:
        document.getElementById("assessmentProfileDate"),

    assessmentProfileBmiClassification:
        document.getElementById(
            "assessmentProfileBmiClassification"
        ),

    assessmentProfileStatus:
        document.getElementById("assessmentProfileStatus"),

    detailWeight:
        document.getElementById("detailWeight"),

    detailHeight:
        document.getElementById("detailHeight"),

    detailBmi:
        document.getElementById("detailBmi"),

    detailBmiClassification:
        document.getElementById("detailBmiClassification"),

    detailBodyFat:
        document.getElementById("detailBodyFat"),

    detailMuscleMass:
        document.getElementById("detailMuscleMass"),

    detailWaist:
        document.getElementById("detailWaist"),

    detailHeartRate:
        document.getElementById("detailHeartRate"),

    detailBloodPressure:
        document.getElementById("detailBloodPressure"),

    detailOxygen:
        document.getElementById("detailOxygen"),

    detailObservations:
        document.getElementById("detailObservations"),

    editAssessmentButton:
        document.getElementById("editAssessmentButton"),

    deactivateAssessmentButton:
        document.getElementById("deactivateAssessmentButton"),

    printAssessmentButton:
        document.getElementById("printAssessmentButton"),

    modal:
        document.getElementById("assessmentModal"),

    modalOverlay:
        document.getElementById("assessmentModalOverlay"),

    modalTitle:
        document.getElementById("assessmentModalTitle"),

    closeModalButton:
        document.getElementById("closeAssessmentModalButton"),

    cancelAssessmentButton:
        document.getElementById("cancelAssessmentButton"),

    form:
        document.getElementById("assessmentForm"),

    assessmentId:
        document.getElementById("assessmentId"),

    memberId:
        document.getElementById("assessmentMemberId"),

    assessmentDate:
        document.getElementById("assessmentDate"),

    active:
        document.getElementById("assessmentActive"),

    weightKg:
        document.getElementById("weightKg"),

    heightCm:
        document.getElementById("heightCm"),

    calculatedBmi:
        document.getElementById("calculatedBmi"),

    bodyFatPercentage:
        document.getElementById("bodyFatPercentage"),

    muscleMassKg:
        document.getElementById("muscleMassKg"),

    waistCircumferenceCm:
        document.getElementById("waistCircumferenceCm"),

    restingHeartRate:
        document.getElementById("restingHeartRate"),

    systolicPressure:
        document.getElementById("systolicPressure"),

    diastolicPressure:
        document.getElementById("diastolicPressure"),

    oxygenSaturation:
        document.getElementById("oxygenSaturation"),

    observations:
        document.getElementById("assessmentObservations"),

    memberValidation:
        document.getElementById("assessmentMemberValidation"),

    dateValidation:
        document.getElementById("assessmentDateValidation"),

    weightValidation:
        document.getElementById("weightValidation"),

    heightValidation:
        document.getElementById("heightValidation"),

    formMessage:
        document.getElementById("assessmentFormMessage"),

    saveAssessmentButton:
        document.getElementById("saveAssessmentButton")
};

async function initializeAssessmentDashboard() {
    bindEvents();
    setDefaultAssessmentDate();

    await Promise.all([
        loadMembers(),
        loadAssessments()
    ]);
}

function bindEvents() {
    elements.newAssessmentButton.addEventListener(
        "click",
        openCreateModal
    );

    elements.refreshAssessmentsButton.addEventListener(
        "click",
        loadAssessments
    );

    elements.assessmentSearchInput.addEventListener(
        "input",
        applyFilters
    );

    elements.assessmentMemberFilter.addEventListener(
        "change",
        applyFilters
    );

    elements.assessmentsTableBody.addEventListener(
        "click",
        handleTableAction
    );

    elements.editAssessmentButton.addEventListener(
        "click",
        openEditModal
    );

    elements.deactivateAssessmentButton.addEventListener(
        "click",
        deactivateSelectedAssessment
    );

    elements.printAssessmentButton.addEventListener(
        "click",
        () => window.print()
    );

    elements.closeModalButton.addEventListener(
        "click",
        closeModal
    );

    elements.cancelAssessmentButton.addEventListener(
        "click",
        closeModal
    );

    elements.modalOverlay.addEventListener(
        "click",
        closeModal
    );

    elements.form.addEventListener(
        "submit",
        saveAssessment
    );

    elements.memberId.addEventListener(
        "change",
        validateMember
    );

    elements.assessmentDate.addEventListener(
        "change",
        validateAssessmentDate
    );

    elements.weightKg.addEventListener(
        "input",
        handleBodyDataChange
    );

    elements.heightCm.addEventListener(
        "input",
        handleBodyDataChange
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

        members = Array.isArray(data)
            ? data
            : [];

        renderMemberOptions();
        renderMemberFilterOptions();
    } catch (error) {
        console.error(error);
        showFormMessage(error.message);
    }
}

async function loadAssessments() {
    showLoading(true);
    hideAssessmentsError();

    try {
        const response = await fetch(ASSESSMENTS_API, {
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudieron cargar las evaluaciones. HTTP ${response.status}`
            );
        }

        const data = await response.json();

        assessments = Array.isArray(data)
            ? data
            : [];

        updateCounters();
        applyFilters();

        if (!selectedAssessment && assessments.length > 0) {
            selectAssessment(assessments[0]);
        } else if (selectedAssessment) {
            const refreshed = assessments.find(
                assessment =>
                    assessment.id === selectedAssessment.id
            );

            if (refreshed) {
                selectAssessment(refreshed);
            } else {
                clearSelectedAssessment();
            }
        }
    } catch (error) {
        console.error(error);
        showAssessmentsError(error.message);
    } finally {
        showLoading(false);
    }
}

function updateCounters() {
    const normalBmi = assessments.filter(
        assessment =>
            assessment.bmiClassification === "Normal"
    ).length;

    const weightValues = assessments
        .map(assessment => Number(assessment.weightKg))
        .filter(Number.isFinite);

    const oxygenValues = assessments
        .map(assessment => Number(assessment.oxygenSaturation))
        .filter(Number.isFinite);

    elements.heroAssessmentCount.textContent =
        assessments.length;

    elements.totalAssessmentsCount.textContent =
        assessments.length;

    elements.normalBmiCount.textContent =
        normalBmi;

    elements.averageWeightValue.textContent =
        weightValues.length > 0
            ? `${calculateAverage(weightValues).toFixed(1)} kg`
            : "—";

    elements.averageOxygenValue.textContent =
        oxygenValues.length > 0
            ? `${calculateAverage(oxygenValues).toFixed(1)} %`
            : "—";
}

function applyFilters() {
    const query = elements.assessmentSearchInput.value
        .trim()
        .toLowerCase();

    const memberFilter =
        elements.assessmentMemberFilter.value;

    const filtered = assessments.filter(assessment => {
        const searchableText = [
            assessment.memberFullName,
            assessment.memberIdentification
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesText =
            query === ""
            || searchableText.includes(query);

        const matchesMember =
            memberFilter === "all"
            || String(assessment.memberId) === memberFilter;

        return matchesText && matchesMember;
    });

    renderAssessments(filtered);
}

function renderAssessments(data) {
    if (data.length === 0) {
        elements.assessmentsTableBody.innerHTML = `
            <tr>
                <td colspan="9" class="enterprise-empty">
                    No existen evaluaciones que coincidan
                    con los filtros seleccionados.
                </td>
            </tr>
        `;
        return;
    }

    elements.assessmentsTableBody.innerHTML = data
        .map(createAssessmentRow)
        .join("");
}

function createAssessmentRow(assessment) {
    return `
        <tr>
            <td>
                <div class="enterprise-person">

                    <div class="enterprise-avatar">
                        ${escapeHtml(
                            getInitials(
                                assessment.memberFullName
                            )
                        )}
                    </div>

                    <div class="enterprise-person-info">
                        <strong>
                            ${escapeHtml(
                                assessment.memberFullName
                            )}
                        </strong>

                        <small>
                            ${escapeHtml(
                                assessment.memberIdentification
                            )}
                        </small>
                    </div>

                </div>
            </td>

            <td>
                ${escapeHtml(
                    formatDate(assessment.assessmentDate)
                )}
            </td>

            <td>
                ${displayMetric(assessment.weightKg, "kg")}
            </td>

            <td>
                ${displayMetric(assessment.heightCm, "cm")}
            </td>

            <td>
                <strong>
                    ${assessment.bmi ?? "—"}
                </strong>

                <br>

                <small>
                    ${escapeHtml(
                        assessment.bmiClassification
                        ?? "No calculado"
                    )}
                </small>
            </td>

            <td>
                ${
                    assessment.systolicPressure
                    && assessment.diastolicPressure
                        ? `${assessment.systolicPressure}/${assessment.diastolicPressure}`
                        : "—"
                }
            </td>

            <td>
                ${displayMetric(
                    assessment.oxygenSaturation,
                    "%"
                )}
            </td>

            <td>
                <span class="enterprise-badge ${
                    assessment.active
                        ? "active"
                        : "inactive"
                }">
                    ${assessment.active ? "Activo" : "Inactivo"}
                </span>
            </td>

            <td class="actions-cell">

                <div class="enterprise-actions">

                    <button
                        type="button"
                        class="enterprise-button secondary"
                        data-action="view"
                        data-assessment-id="${assessment.id}"
                    >
                        Ver
                    </button>

                    <button
                        type="button"
                        class="enterprise-button secondary"
                        data-action="edit"
                        data-assessment-id="${assessment.id}"
                    >
                        Editar
                    </button>

                    ${
                        assessment.active
                            ? `
                                <button
                                    type="button"
                                    class="enterprise-button danger"
                                    data-action="deactivate"
                                    data-assessment-id="${assessment.id}"
                                >
                                    Desactivar
                                </button>
                            `
                            : ""
                    }

                </div>

            </td>
        </tr>
    `;
}

function handleTableAction(event) {
    const button = event.target.closest(
        "button[data-action]"
    );

    if (!button) {
        return;
    }

    const assessmentId = Number(
        button.dataset.assessmentId
    );

    const assessment = assessments.find(
        current => current.id === assessmentId
    );

    if (!assessment) {
        return;
    }

    const action = button.dataset.action;

    if (action === "view") {
        selectAssessment(assessment);
    }

    if (action === "edit") {
        selectAssessment(assessment);
        openEditModal();
    }

    if (action === "deactivate") {
        selectAssessment(assessment);
        deactivateSelectedAssessment();
    }
}

function selectAssessment(assessment) {
    selectedAssessment = assessment;

    elements.assessmentDetailSection.classList.remove(
        "hidden"
    );

    elements.assessmentProfileAvatar.textContent =
        getInitials(assessment.memberFullName);

    elements.assessmentProfileName.textContent =
        assessment.memberFullName;

    elements.assessmentProfileIdentification.textContent =
        assessment.memberIdentification;

    elements.assessmentProfileDate.textContent =
        formatDate(assessment.assessmentDate);

    elements.assessmentProfileBmiClassification.textContent =
        assessment.bmiClassification || "No calculado";

    elements.assessmentProfileStatus.textContent =
        assessment.active ? "Activo" : "Inactivo";

    elements.assessmentProfileStatus.className =
        `enterprise-badge ${
            assessment.active ? "active" : "inactive"
        }`;

    elements.detailWeight.textContent =
        assessment.weightKg ?? "—";

    elements.detailHeight.textContent =
        assessment.heightCm ?? "—";

    elements.detailBmi.textContent =
        assessment.bmi ?? "—";

    elements.detailBmiClassification.textContent =
        assessment.bmiClassification || "No calculado";

    elements.detailBodyFat.textContent =
        assessment.bodyFatPercentage ?? "—";

    elements.detailMuscleMass.textContent =
        assessment.muscleMassKg ?? "—";

    elements.detailWaist.textContent =
        assessment.waistCircumferenceCm ?? "—";

    elements.detailHeartRate.textContent =
        assessment.restingHeartRate ?? "—";

    elements.detailBloodPressure.textContent =
        assessment.systolicPressure
        && assessment.diastolicPressure
            ? `${assessment.systolicPressure}/${assessment.diastolicPressure}`
            : "—";

    elements.detailOxygen.textContent =
        assessment.oxygenSaturation ?? "—";

    elements.detailObservations.textContent =
        assessment.observations
        || "Sin observaciones registradas.";

    elements.deactivateAssessmentButton.disabled =
        !assessment.active;

    elements.deactivateAssessmentButton.textContent =
        assessment.active
            ? "Desactivar"
            : "Evaluación inactiva";

    elements.assessmentDetailSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function clearSelectedAssessment() {
    selectedAssessment = null;

    elements.assessmentDetailSection.classList.add(
        "hidden"
    );
}

function openCreateModal() {
    elements.form.reset();
    elements.assessmentId.value = "";
    elements.active.checked = true;
    elements.memberId.disabled = false;

    setDefaultAssessmentDate();
    clearValidation();
    calculateBmiPreview();

    elements.modalTitle.textContent =
        "Nueva evaluación";

    elements.saveAssessmentButton.textContent =
        "Guardar evaluación";

    elements.modal.classList.remove("hidden");
}

function openEditModal() {
    if (!selectedAssessment) {
        return;
    }

    elements.assessmentId.value =
        selectedAssessment.id;

    elements.memberId.value =
        selectedAssessment.memberId;

    elements.assessmentDate.value =
        selectedAssessment.assessmentDate || "";

    elements.active.checked =
        Boolean(selectedAssessment.active);

    elements.weightKg.value =
        selectedAssessment.weightKg ?? "";

    elements.heightCm.value =
        selectedAssessment.heightCm ?? "";

    elements.bodyFatPercentage.value =
        selectedAssessment.bodyFatPercentage ?? "";

    elements.muscleMassKg.value =
        selectedAssessment.muscleMassKg ?? "";

    elements.waistCircumferenceCm.value =
        selectedAssessment.waistCircumferenceCm ?? "";

    elements.restingHeartRate.value =
        selectedAssessment.restingHeartRate ?? "";

    elements.systolicPressure.value =
        selectedAssessment.systolicPressure ?? "";

    elements.diastolicPressure.value =
        selectedAssessment.diastolicPressure ?? "";

    elements.oxygenSaturation.value =
        selectedAssessment.oxygenSaturation ?? "";

    elements.observations.value =
        selectedAssessment.observations ?? "";

    elements.memberId.disabled = true;

    elements.modalTitle.textContent =
        "Editar evaluación";

    elements.saveAssessmentButton.textContent =
        "Actualizar evaluación";

    clearValidation();
    calculateBmiPreview();

    elements.modal.classList.remove("hidden");
}

function closeModal() {
    elements.modal.classList.add("hidden");
    elements.form.reset();
    elements.assessmentId.value = "";
    elements.memberId.disabled = false;
    clearValidation();
}

async function saveAssessment(event) {
    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    const assessmentId =
        elements.assessmentId.value;

    const payload = {
        memberId: selectedAssessment && assessmentId
            ? selectedAssessment.memberId
            : Number(elements.memberId.value),

        assessmentDate:
            emptyToNull(elements.assessmentDate.value),

        weightKg:
            numberOrNull(elements.weightKg.value),

        heightCm:
            numberOrNull(elements.heightCm.value),

        bodyFatPercentage:
            numberOrNull(
                elements.bodyFatPercentage.value
            ),

        muscleMassKg:
            numberOrNull(elements.muscleMassKg.value),

        waistCircumferenceCm:
            numberOrNull(
                elements.waistCircumferenceCm.value
            ),

        restingHeartRate:
            integerOrNull(
                elements.restingHeartRate.value
            ),

        systolicPressure:
            integerOrNull(
                elements.systolicPressure.value
            ),

        diastolicPressure:
            integerOrNull(
                elements.diastolicPressure.value
            ),

        oxygenSaturation:
            numberOrNull(
                elements.oxygenSaturation.value
            ),

        observations:
            emptyToNull(elements.observations.value),

        active:
            elements.active.checked
    };

    const url = assessmentId
        ? `${ASSESSMENTS_API}/${assessmentId}`
        : ASSESSMENTS_API;

    const method = assessmentId
        ? "PUT"
        : "POST";

    const originalText =
        elements.saveAssessmentButton.textContent;

    elements.saveAssessmentButton.disabled = true;

    elements.saveAssessmentButton.textContent =
        assessmentId
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
        await loadAssessments();

        const savedAssessment = assessments.find(
            assessment => assessment.id === body?.id
        );

        if (savedAssessment) {
            selectAssessment(savedAssessment);
        }
    } catch (error) {
        console.error(error);
        showFormMessage(error.message);
    } finally {
        elements.saveAssessmentButton.disabled = false;
        elements.saveAssessmentButton.textContent =
            originalText;
    }
}

async function deactivateSelectedAssessment() {
    if (
        !selectedAssessment
        || !selectedAssessment.active
    ) {
        return;
    }

    const confirmed = window.confirm(
        `¿Deseas desactivar la evaluación de ${selectedAssessment.memberFullName}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${ASSESSMENTS_API}/${selectedAssessment.id}`,
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

        await loadAssessments();
    } catch (error) {
        console.error(error);
        window.alert(error.message);
    }
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

function renderMemberFilterOptions() {
    const currentValue =
        elements.assessmentMemberFilter.value;

    elements.assessmentMemberFilter.innerHTML = `
        <option value="all">
            Todos
        </option>
    `;

    members.forEach(member => {
        const option = document.createElement("option");

        option.value = member.id;
        option.textContent = member.fullName;

        elements.assessmentMemberFilter.appendChild(
            option
        );
    });

    if (currentValue) {
        elements.assessmentMemberFilter.value =
            currentValue;
    }
}

function handleBodyDataChange() {
    validateWeight();
    validateHeight();
    calculateBmiPreview();
}

function calculateBmiPreview() {
    const weight = Number(elements.weightKg.value);
    const heightCm = Number(elements.heightCm.value);

    if (
        !Number.isFinite(weight)
        || !Number.isFinite(heightCm)
        || weight <= 0
        || heightCm <= 0
    ) {
        elements.calculatedBmi.value = "";
        return;
    }

    const heightMeters = heightCm / 100;
    const bmi = weight / (heightMeters ** 2);

    elements.calculatedBmi.value =
        `${bmi.toFixed(2)} — ${classifyBmi(bmi)}`;
}

function validateForm() {
    const validMember = validateMember();
    const validDate = validateAssessmentDate();
    const validWeight = validateWeight();
    const validHeight = validateHeight();

    return (
        validMember
        && validDate
        && validWeight
        && validHeight
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

function validateAssessmentDate() {
    if (!elements.assessmentDate.value) {
        clearValidationState(
            elements.assessmentDate,
            elements.dateValidation
        );

        return true;
    }

    const selectedDate = new Date(
        `${elements.assessmentDate.value}T00:00:00`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const valid = selectedDate <= today;

    setValidationState(
        elements.assessmentDate,
        elements.dateValidation,
        valid,
        valid
            ? "Fecha válida"
            : "La fecha no puede ser futura"
    );

    return valid;
}

function validateWeight() {
    if (elements.weightKg.value === "") {
        clearValidationState(
            elements.weightKg,
            elements.weightValidation
        );

        return true;
    }

    const weight = Number(elements.weightKg.value);

    const valid =
        Number.isFinite(weight)
        && weight > 0
        && weight <= 500;

    setValidationState(
        elements.weightKg,
        elements.weightValidation,
        valid,
        valid
            ? "Peso válido"
            : "Ingrese un peso entre 1 y 500 kg"
    );

    return valid;
}

function validateHeight() {
    if (elements.heightCm.value === "") {
        clearValidationState(
            elements.heightCm,
            elements.heightValidation
        );

        return true;
    }

    const height = Number(elements.heightCm.value);

    const valid =
        Number.isFinite(height)
        && height >= 30
        && height <= 300;

    setValidationState(
        elements.heightCm,
        elements.heightValidation,
        valid,
        valid
            ? "Estatura válida"
            : "Ingrese una estatura entre 30 y 300 cm"
    );

    return valid;
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

function clearValidation() {
    clearValidationState(
        elements.memberId,
        elements.memberValidation
    );

    clearValidationState(
        elements.assessmentDate,
        elements.dateValidation
    );

    clearValidationState(
        elements.weightKg,
        elements.weightValidation
    );

    clearValidationState(
        elements.heightCm,
        elements.heightValidation
    );

    elements.formMessage.textContent = "";
}

function setDefaultAssessmentDate() {
    elements.assessmentDate.value =
        new Date().toISOString().slice(0, 10);
}

function showLoading(show) {
    elements.assessmentsLoading.style.display =
        show ? "block" : "none";
}

function showAssessmentsError(message) {
    elements.assessmentsError.textContent = message;
    elements.assessmentsError.classList.remove("hidden");
}

function hideAssessmentsError() {
    elements.assessmentsError.textContent = "";
    elements.assessmentsError.classList.add("hidden");
}

function showFormMessage(message) {
    elements.formMessage.textContent = message;
}

function displayMetric(value, unit) {
    return value == null
        ? "—"
        : `${escapeHtml(value)} ${unit}`;
}

function calculateAverage(values) {
    return values.reduce(
        (total, value) => total + value,
        0
    ) / values.length;
}

function classifyBmi(bmi) {
    if (bmi < 18.5) {
        return "Bajo peso";
    }

    if (bmi < 25) {
        return "Normal";
    }

    if (bmi < 30) {
        return "Sobrepeso";
    }

    return "Obesidad";
}

function formatDate(value) {
    if (!value) {
        return "—";
    }

    const date = new Date(`${value}T00:00:00`);

    return new Intl.DateTimeFormat(
        "es-EC",
        {
            year: "numeric",
            month: "long",
            day: "2-digit"
        }
    ).format(date);
}

function getInitials(fullName) {
    const parts = String(fullName || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) {
        return "SG";
    }

    const first = parts[0].charAt(0);
    const last = parts.length > 1
        ? parts[parts.length - 1].charAt(0)
        : "";

    return `${first}${last}`.toUpperCase();
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

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeAssessmentDashboard,
        { once: true }
    );
} else {
    initializeAssessmentDashboard();
}
