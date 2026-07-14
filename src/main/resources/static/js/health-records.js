console.log("health-records.js cargado correctamente");

const HEALTH_RECORDS_API = "/api/v1/health-records";
const MEMBERS_API = "/api/v1/members";

let healthRecords = [];
let members = [];
let selectedRecord = null;

const elements = {
    heroRecordCount:
        document.getElementById("heroRecordCount"),

    totalRecordsCount:
        document.getElementById("totalRecordsCount"),

    activeRecordsCount:
        document.getElementById("activeRecordsCount"),

    allergyRecordsCount:
        document.getElementById("allergyRecordsCount"),

    restrictionRecordsCount:
        document.getElementById("restrictionRecordsCount"),

    newHealthRecordButton:
        document.getElementById("newHealthRecordButton"),

    recordSearchInput:
        document.getElementById("recordSearchInput"),

    recordStatusFilter:
        document.getElementById("recordStatusFilter"),

    refreshHealthRecordsButton:
        document.getElementById("refreshHealthRecordsButton"),

    recordsLoading:
        document.getElementById("recordsLoading"),

    recordsError:
        document.getElementById("recordsError"),

    healthRecordsList:
        document.getElementById("healthRecordsList"),

    recordsEmpty:
        document.getElementById("recordsEmpty"),

    clinicalProfileSection:
        document.getElementById("clinicalProfileSection"),

    profileAvatar:
        document.getElementById("profileAvatar"),

    profileMemberName:
        document.getElementById("profileMemberName"),

    profileIdentification:
        document.getElementById("profileIdentification"),

    profileAge:
        document.getElementById("profileAge"),

    profileBloodType:
        document.getElementById("profileBloodType"),

    profileStatus:
        document.getElementById("profileStatus"),

    profileEmail:
        document.getElementById("profileEmail"),

    profilePhone:
        document.getElementById("profilePhone"),

    profileOpenedAt:
        document.getElementById("profileOpenedAt"),

    profileMedicalHistory:
        document.getElementById("profileMedicalHistory"),

    profileAllergies:
        document.getElementById("profileAllergies"),

    profileInjuries:
        document.getElementById("profileInjuries"),

    profileMedications:
        document.getElementById("profileMedications"),

    profilePhysicalRestrictions:
        document.getElementById("profilePhysicalRestrictions"),

    profileClinicalObservations:
        document.getElementById("profileClinicalObservations"),

    editHealthRecordButton:
        document.getElementById("editHealthRecordButton"),

    deactivateHealthRecordButton:
        document.getElementById("deactivateHealthRecordButton"),

    printHealthRecordButton:
        document.getElementById("printHealthRecordButton"),

    modal:
        document.getElementById("healthRecordModal"),

    modalOverlay:
        document.getElementById("healthRecordModalOverlay"),

    modalTitle:
        document.getElementById("healthRecordModalTitle"),

    closeModalButton:
        document.getElementById("closeHealthRecordModalButton"),

    cancelButton:
        document.getElementById("cancelHealthRecordButton"),

    form:
        document.getElementById("healthRecordForm"),

    recordId:
        document.getElementById("healthRecordId"),

    memberId:
        document.getElementById("healthRecordMemberId"),

    openedAt:
        document.getElementById("healthRecordOpenedAt"),

    active:
        document.getElementById("healthRecordActive"),

    medicalHistory:
        document.getElementById("medicalHistory"),

    allergies:
        document.getElementById("allergies"),

    injuries:
        document.getElementById("injuries"),

    medications:
        document.getElementById("medications"),

    physicalRestrictions:
        document.getElementById("physicalRestrictions"),

    clinicalObservations:
        document.getElementById("clinicalObservations"),

    memberIdValidationMessage:
        document.getElementById("memberIdValidationMessage"),

    openedAtValidationMessage:
        document.getElementById("openedAtValidationMessage"),

    formMessage:
        document.getElementById("healthRecordFormMessage"),

    saveButton:
        document.getElementById("saveHealthRecordButton")
};

async function initializeClinicalDashboard() {
    bindEvents();
    configureTextCounters();
    setDefaultOpenedAt();

    await Promise.all([
        loadMembers(),
        loadHealthRecords()
    ]);
}

function bindEvents() {
    elements.newHealthRecordButton.addEventListener(
        "click",
        openCreateModal
    );

    elements.refreshHealthRecordsButton.addEventListener(
        "click",
        loadHealthRecords
    );

    elements.recordSearchInput.addEventListener(
        "input",
        applyRecordFilters
    );

    elements.recordStatusFilter.addEventListener(
        "change",
        applyRecordFilters
    );

    elements.healthRecordsList.addEventListener(
        "click",
        handleRecordSelection
    );

    elements.editHealthRecordButton.addEventListener(
        "click",
        openEditModal
    );

    elements.deactivateHealthRecordButton.addEventListener(
        "click",
        deactivateSelectedRecord
    );

    elements.printHealthRecordButton.addEventListener(
        "click",
        () => window.print()
    );

    elements.closeModalButton.addEventListener(
        "click",
        closeModal
    );

    elements.cancelButton.addEventListener(
        "click",
        closeModal
    );

    elements.modalOverlay.addEventListener(
        "click",
        closeModal
    );

    elements.form.addEventListener(
        "submit",
        saveHealthRecord
    );

    elements.memberId.addEventListener(
        "change",
        validateMemberSelection
    );

    elements.openedAt.addEventListener(
        "change",
        validateOpenedAt
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
    } catch (error) {
        console.error(error);
        showFormMessage(error.message);
    }
}

async function loadHealthRecords() {
    showLoading(true);
    hideRecordsError();

    try {
        const response = await fetch(HEALTH_RECORDS_API, {
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudieron cargar los expedientes. HTTP ${response.status}`
            );
        }

        const data = await response.json();

        healthRecords = Array.isArray(data)
            ? data
            : [];

        updateClinicalCounters();
        applyRecordFilters();

        if (selectedRecord) {
            const refreshed = healthRecords.find(
                record => record.id === selectedRecord.id
            );

            if (refreshed) {
                selectRecord(refreshed);
            } else {
                clearSelectedProfile();
            }
        }
    } catch (error) {
        console.error(error);
        showRecordsError(error.message);
    } finally {
        showLoading(false);
    }
}

function updateClinicalCounters() {
    const activeCount = healthRecords.filter(
        record => record.active
    ).length;

    const allergyCount = healthRecords.filter(
        record => hasRelevantClinicalText(record.allergies)
    ).length;

    const restrictionCount = healthRecords.filter(
        record => hasRelevantClinicalText(
            record.physicalRestrictions
        )
    ).length;

    elements.heroRecordCount.textContent =
        healthRecords.length;

    elements.totalRecordsCount.textContent =
        healthRecords.length;

    elements.activeRecordsCount.textContent =
        activeCount;

    elements.allergyRecordsCount.textContent =
        allergyCount;

    elements.restrictionRecordsCount.textContent =
        restrictionCount;
}

function hasRelevantClinicalText(value) {
    if (!value || !String(value).trim()) {
        return false;
    }

    const normalized = String(value)
        .trim()
        .toLowerCase();

    const noInformationExpressions = [
        "no reporta",
        "sin alergias",
        "ninguna",
        "ninguno",
        "no presenta",
        "sin restricciones",
        "no consume"
    ];

    return !noInformationExpressions.some(
        expression => normalized.includes(expression)
    );
}

function applyRecordFilters() {
    const query = elements.recordSearchInput.value
        .trim()
        .toLowerCase();

    const status = elements.recordStatusFilter.value;

    const filteredRecords = healthRecords.filter(record => {
        const searchableText = [
            record.memberFullName,
            record.memberIdentification,
            record.memberEmail,
            record.memberPhone
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesText =
            query === ""
            || searchableText.includes(query);

        const matchesStatus =
            status === "all"
            || (status === "active" && record.active)
            || (status === "inactive" && !record.active);

        return matchesText && matchesStatus;
    });

    renderHealthRecordList(filteredRecords);
}

function renderHealthRecordList(records) {
    elements.healthRecordsList.innerHTML = "";

    if (records.length === 0) {
        elements.recordsEmpty.classList.remove("hidden");
        return;
    }

    elements.recordsEmpty.classList.add("hidden");

    elements.healthRecordsList.innerHTML = records
        .map(createRecordItem)
        .join("");
}

function createRecordItem(record) {
    const selectedClass =
        selectedRecord?.id === record.id
            ? "selected"
            : "";

    return `
        <article
            class="clinical-record-item ${selectedClass}"
            data-record-id="${record.id}"
        >
            <div class="clinical-record-person">

                <div class="clinical-record-avatar">
                    ${escapeHtml(
                        getInitials(record.memberFullName)
                    )}
                </div>

                <div class="clinical-record-person-info">
                    <strong>
                        ${escapeHtml(record.memberFullName)}
                    </strong>

                    <small>
                        ${escapeHtml(
                            record.memberIdentification
                        )}
                    </small>
                </div>

            </div>

            <div class="clinical-record-summary">

                <span class="enterprise-badge ${
                    record.active ? "active" : "inactive"
                }">
                    ${record.active ? "Activo" : "Inactivo"}
                </span>

                <time>
                    Apertura:
                    ${escapeHtml(
                        formatDate(record.openedAt)
                    )}
                </time>

            </div>
        </article>
    `;
}

function handleRecordSelection(event) {
    const item = event.target.closest(
        "[data-record-id]"
    );

    if (!item) {
        return;
    }

    const recordId = Number(item.dataset.recordId);

    const record = healthRecords.find(
        current => current.id === recordId
    );

    if (record) {
        selectRecord(record);
    }
}

function selectRecord(record) {
    selectedRecord = record;

    elements.clinicalProfileSection.classList.remove(
        "hidden"
    );

    elements.profileAvatar.textContent =
        getInitials(record.memberFullName);

    elements.profileMemberName.textContent =
        record.memberFullName;

    elements.profileIdentification.textContent =
        record.memberIdentification;

    elements.profileAge.textContent =
        record.memberAge == null
            ? "Edad no registrada"
            : `${record.memberAge} años`;

    elements.profileBloodType.textContent =
        record.memberBloodType || "Sangre no registrada";

    elements.profileStatus.textContent =
        record.active ? "Activo" : "Inactivo";

    elements.profileStatus.className =
        `enterprise-badge ${
            record.active ? "active" : "inactive"
        }`;

    elements.profileEmail.textContent =
        record.memberEmail || "Sin correo";

    elements.profilePhone.textContent =
        record.memberPhone || "Sin teléfono";

    elements.profileOpenedAt.textContent =
        formatDate(record.openedAt);

    elements.profileMedicalHistory.textContent =
        displayClinicalValue(record.medicalHistory);

    elements.profileAllergies.textContent =
        displayClinicalValue(record.allergies);

    elements.profileInjuries.textContent =
        displayClinicalValue(record.injuries);

    elements.profileMedications.textContent =
        displayClinicalValue(record.medications);

    elements.profilePhysicalRestrictions.textContent =
        displayClinicalValue(
            record.physicalRestrictions
        );

    elements.profileClinicalObservations.textContent =
        displayClinicalValue(
            record.clinicalObservations
        );

    elements.deactivateHealthRecordButton.disabled =
        !record.active;

    renderHealthRecordList(
        getCurrentlyFilteredRecords()
    );

    elements.clinicalProfileSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function getCurrentlyFilteredRecords() {
    const query = elements.recordSearchInput.value
        .trim()
        .toLowerCase();

    const status = elements.recordStatusFilter.value;

    return healthRecords.filter(record => {
        const text = [
            record.memberFullName,
            record.memberIdentification,
            record.memberEmail,
            record.memberPhone
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesText =
            query === "" || text.includes(query);

        const matchesStatus =
            status === "all"
            || (status === "active" && record.active)
            || (status === "inactive" && !record.active);

        return matchesText && matchesStatus;
    });
}

function clearSelectedProfile() {
    selectedRecord = null;

    elements.clinicalProfileSection.classList.add(
        "hidden"
    );
}

function openCreateModal() {
    elements.form.reset();
    elements.recordId.value = "";
    elements.active.checked = true;

    setDefaultOpenedAt();
    clearFormValidation();
    renderMemberOptions();

    elements.modalTitle.textContent =
        "Nuevo expediente clínico";

    elements.saveButton.textContent =
        "Guardar expediente";

    elements.memberId.disabled = false;

    elements.modal.classList.remove("hidden");
}

function openEditModal() {
    if (!selectedRecord) {
        return;
    }

    elements.recordId.value =
        selectedRecord.id;

    elements.memberId.value =
        selectedRecord.memberId;

    elements.openedAt.value =
        selectedRecord.openedAt || "";

    elements.active.checked =
        Boolean(selectedRecord.active);

    elements.medicalHistory.value =
        selectedRecord.medicalHistory || "";

    elements.allergies.value =
        selectedRecord.allergies || "";

    elements.injuries.value =
        selectedRecord.injuries || "";

    elements.medications.value =
        selectedRecord.medications || "";

    elements.physicalRestrictions.value =
        selectedRecord.physicalRestrictions || "";

    elements.clinicalObservations.value =
        selectedRecord.clinicalObservations || "";

    elements.memberId.disabled = false;

    elements.modalTitle.textContent =
        "Editar expediente clínico";

    elements.saveButton.textContent =
        "Actualizar expediente";

    clearFormValidation();
    updateAllTextCounters();

    elements.modal.classList.remove("hidden");
}

function closeModal() {
    elements.modal.classList.add("hidden");
    elements.form.reset();
    elements.recordId.value = "";
    elements.memberId.disabled = false;
    clearFormValidation();
}

async function saveHealthRecord(event) {
    event.preventDefault();

    if (!validateHealthRecordForm()) {
        return;
    }

    const recordId = elements.recordId.value;

    const payload = {
        memberId: Number(elements.memberId.value),

        medicalHistory:
            emptyToNull(elements.medicalHistory.value),

        allergies:
            emptyToNull(elements.allergies.value),

        injuries:
            emptyToNull(elements.injuries.value),

        medications:
            emptyToNull(elements.medications.value),

        physicalRestrictions:
            emptyToNull(
                elements.physicalRestrictions.value
            ),

        clinicalObservations:
            emptyToNull(
                elements.clinicalObservations.value
            ),

        openedAt:
            emptyToNull(elements.openedAt.value),

        active:
            elements.active.checked
    };

    const url = recordId
        ? `${HEALTH_RECORDS_API}/${recordId}`
        : HEALTH_RECORDS_API;

    const method = recordId
        ? "PUT"
        : "POST";

    const originalText =
        elements.saveButton.textContent;

    elements.saveButton.disabled = true;
    elements.saveButton.textContent =
        recordId ? "Actualizando..." : "Guardando...";

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
        await loadHealthRecords();

        const savedRecord = body;

        if (savedRecord?.id) {
            const refreshed = healthRecords.find(
                record => record.id === savedRecord.id
            );

            if (refreshed) {
                selectRecord(refreshed);
            }
        }
    } catch (error) {
        console.error(error);
        showFormMessage(error.message);
    } finally {
        elements.saveButton.disabled = false;
        elements.saveButton.textContent = originalText;
    }
}

async function deactivateSelectedRecord() {
    if (!selectedRecord || !selectedRecord.active) {
        return;
    }

    const confirmed = window.confirm(
        `¿Deseas desactivar el expediente de ${selectedRecord.memberFullName}?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${HEALTH_RECORDS_API}/${selectedRecord.id}`,
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

        await loadHealthRecords();

        const refreshed = healthRecords.find(
            record => record.id === selectedRecord.id
        );

        if (refreshed) {
            selectRecord(refreshed);
        }
    } catch (error) {
        console.error(error);
        window.alert(error.message);
    }
}

function renderMemberOptions() {
    const selectedValue = elements.memberId.value;

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

    if (selectedValue) {
        elements.memberId.value = selectedValue;
    }
}

function validateHealthRecordForm() {
    const validMember = validateMemberSelection();
    const validOpenedAt = validateOpenedAt();

    return validMember && validOpenedAt;
}

function validateMemberSelection() {
    const valid = Boolean(elements.memberId.value);

    setValidationState(
        elements.memberId,
        elements.memberIdValidationMessage,
        valid,
        valid
            ? "Deportista seleccionado"
            : "Debe seleccionar un deportista"
    );

    return valid;
}

function validateOpenedAt() {
    if (!elements.openedAt.value) {
        clearValidationState(
            elements.openedAt,
            elements.openedAtValidationMessage
        );

        return true;
    }

    const selectedDate = new Date(
        `${elements.openedAt.value}T00:00:00`
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const valid = selectedDate <= today;

    setValidationState(
        elements.openedAt,
        elements.openedAtValidationMessage,
        valid,
        valid
            ? "Fecha válida"
            : "La fecha de apertura no puede ser futura"
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

function clearFormValidation() {
    clearValidationState(
        elements.memberId,
        elements.memberIdValidationMessage
    );

    clearValidationState(
        elements.openedAt,
        elements.openedAtValidationMessage
    );

    elements.formMessage.textContent = "";
    updateAllTextCounters();
}

function configureTextCounters() {
    const fields = [
        ["medicalHistory", "medicalHistoryCounter"],
        ["allergies", "allergiesCounter"],
        ["injuries", "injuriesCounter"],
        ["medications", "medicationsCounter"],
        [
            "physicalRestrictions",
            "physicalRestrictionsCounter"
        ],
        [
            "clinicalObservations",
            "clinicalObservationsCounter"
        ]
    ];

    fields.forEach(([fieldId, counterId]) => {
        const field = document.getElementById(fieldId);
        const counter = document.getElementById(counterId);

        field.addEventListener("input", () => {
            counter.textContent =
                `${field.value.length} / 5000`;
        });
    });
}

function updateAllTextCounters() {
    const fields = [
        ["medicalHistory", "medicalHistoryCounter"],
        ["allergies", "allergiesCounter"],
        ["injuries", "injuriesCounter"],
        ["medications", "medicationsCounter"],
        [
            "physicalRestrictions",
            "physicalRestrictionsCounter"
        ],
        [
            "clinicalObservations",
            "clinicalObservationsCounter"
        ]
    ];

    fields.forEach(([fieldId, counterId]) => {
        const field = document.getElementById(fieldId);
        const counter = document.getElementById(counterId);

        counter.textContent =
            `${field.value.length} / 5000`;
    });
}

function setDefaultOpenedAt() {
    elements.openedAt.value =
        new Date().toISOString().slice(0, 10);
}

function showLoading(show) {
    elements.recordsLoading.style.display =
        show ? "block" : "none";
}

function showRecordsError(message) {
    elements.recordsError.textContent = message;
    elements.recordsError.classList.remove("hidden");
}

function hideRecordsError() {
    elements.recordsError.textContent = "";
    elements.recordsError.classList.add("hidden");
}

function showFormMessage(message) {
    elements.formMessage.textContent = message;
}

function displayClinicalValue(value) {
    return value && String(value).trim()
        ? value
        : "Sin información registrada.";
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
        initializeClinicalDashboard,
        { once: true }
    );
} else {
    initializeClinicalDashboard();
}
