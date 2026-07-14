console.log("members.js cargado correctamente");
const API_URL = "/api/v1/members";

const tableBody = document.getElementById("membersTableBody");
const searchBox = document.getElementById("searchBox");
const statusFilter = document.getElementById("statusFilter");
const refreshMembersButton =
    document.getElementById("refreshMembersButton");

const paginationInfo =
    document.getElementById("paginationInfo");

const totalMembers = document.getElementById("totalMembers");
const membersCounter = document.getElementById("membersCounter");

const modal = document.getElementById("memberModal");
const newMemberButton = document.getElementById("newMemberButton");
const closeModalButton = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");
const memberForm = document.getElementById("memberForm");

let members = [];
let editingMemberId = null;

async function loadMembers() {
    if (!tableBody) {
        console.error("No existe el elemento membersTableBody");
        return;
    }

    renderLoading();

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar la información. HTTP ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error(
                "La API no devolvió una lista válida de deportistas"
            );
        }

        members = data;

        console.log(
            `${members.length} deportista(s) cargado(s):`,
            members
        );

        updateCounters();
        renderMembers(members);

    } catch (error) {
        console.error("Error al cargar deportistas:", error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="table-error">
                    ${escapeHtml(error.message)}
                </td>
            </tr>
        `;
    }
}

function renderLoading() {
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="enterprise-empty">
                Cargando deportistas...
            </td>
        </tr>
    `;
}

function updateCounters() {
    totalMembers.textContent = members.length;
    membersCounter.textContent = members.length;
}

function renderMembers(data) {
    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7">

                    <div class="enterprise-empty">

                        <div class="enterprise-empty-icon">
                            SG
                        </div>

                        <h4>No existen deportistas</h4>

                        <p>
                            No se encontraron registros que coincidan
                            con los criterios seleccionados.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        updatePaginationInfo(0);
        return;
    }

    tableBody.innerHTML = data
        .map(createMemberRow)
        .join("");

    updatePaginationInfo(data.length);
}

function createMemberRow(member) {
    const initials = getInitials(member);

    const avatarContent = member.photoUrl
        ? `
            <img
                src="${escapeAttribute(member.photoUrl)}"
                alt="${escapeAttribute(member.fullName)}"
            >
        `
        : escapeHtml(initials);

    return `
        <tr>

            <td>
                <div class="enterprise-person">

                    <div class="enterprise-avatar">
                        ${avatarContent}
                    </div>

                    <div class="enterprise-person-info">
                        <strong>
                            ${escapeHtml(member.fullName)}
                        </strong>

                        <small>
                            ${escapeHtml(
                                member.gender ?? "No especificado"
                            )}
                        </small>
                    </div>

                </div>
            </td>

            <td>
                <strong>
                    ${escapeHtml(member.identification)}
                </strong>
            </td>

            <td>
                ${escapeHtml(member.age ?? "—")}
            </td>

            <td>
                <div class="enterprise-person-info">
                    <strong>
                        ${escapeHtml(member.email ?? "Sin correo")}
                    </strong>

                    <small>
                        ${escapeHtml(member.phone ?? "Sin teléfono")}
                    </small>
                </div>
            </td>

            <td>
                <span class="enterprise-badge warning">
                    ${escapeHtml(member.bloodType ?? "No registrado")}
                </span>
            </td>

            <td>
                <span class="enterprise-badge ${
                    member.active ? "active" : "inactive"
                }">
                    ${member.active ? "Activo" : "Inactivo"}
                </span>
            </td>

            <td class="actions-cell">

                <div class="enterprise-actions">

                    <button
                        type="button"
                        class="enterprise-button secondary"
                        data-action="edit"
                        data-member-id="${member.id}"
                    >
                        Editar
                    </button>

                    ${
                        member.active
                            ? `
                                <button
                                    type="button"
                                    class="enterprise-button danger"
                                    data-action="deactivate"
                                    data-member-id="${member.id}"
                                >
                                    Desactivar
                                </button>
                            `
                            : `
                                <span class="enterprise-badge inactive">
                                    Deshabilitado
                                </span>
                            `
                    }

                </div>

            </td>

        </tr>
    `;
}

function openCreateModal() {
    editingMemberId = null;
    memberForm.reset();

    const activeField =
        memberForm.elements.namedItem("active");

    if (activeField) {
        activeField.checked = true;
    }

    clearValidation();

    const modalTitle = document.querySelector(
        "#memberModal .modal-header h3"
    );

    if (modalTitle) {
        modalTitle.textContent = "Nuevo deportista";
    }

    const saveButton =
        document.getElementById("saveMemberButton");

    if (saveButton) {
        saveButton.textContent = "Guardar";
    }

    modal.classList.remove("hidden");
}

function closeMemberModal() {
    editingMemberId = null;
    memberForm.reset();
    modal.classList.add("hidden");
}

async function editMember(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: {
                "Accept": "application/json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `No se pudo cargar el deportista. HTTP ${response.status}`
            );
        }

        const member = await response.json();

        editingMemberId = member.id;

        setFormValue("identification", member.identification);
        setFormValue("firstName", member.firstName);
        setFormValue("lastName", member.lastName);
        setFormValue("gender", member.gender);
        setFormValue("birthDate", member.birthDate);
        setFormValue("email", member.email);
        setFormValue("phone", member.phone);
        setFormValue("address", member.address);
        setFormValue("bloodType", member.bloodType);
        setFormValue(
            "emergencyContactName",
            member.emergencyContactName
        );
        setFormValue(
            "emergencyContactPhone",
            member.emergencyContactPhone
        );
        setFormValue("photoUrl", member.photoUrl);

        const activeField =
            memberForm.elements.namedItem("active");

        if (activeField) {
            activeField.checked = Boolean(member.active);
        }

        const modalTitle = document.querySelector(
            "#memberModal .modal-header h3"
        );

        if (modalTitle) {
            modalTitle.textContent = "Editar deportista";
        }

        const saveButton =
            document.getElementById("saveMemberButton");

        if (saveButton) {
            saveButton.textContent = "Actualizar";
        }

        modal.classList.remove("hidden");

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function setFormValue(fieldName, value) {
    const field = memberForm.elements.namedItem(fieldName);

    if (field) {
        field.value = value ?? "";
    }
}

async function saveMember(event) {
    event.preventDefault();
    if (!validateMemberForm()) {
    return;
    }
    const formData = new FormData(memberForm);

    const payload = {
    identification:
        normalizeRequired(formData.get("identification")),

    firstName:
        normalizeRequired(formData.get("firstName")),

    lastName:
        normalizeRequired(formData.get("lastName")),

    gender:
        emptyToNull(formData.get("gender")),

    birthDate:
        emptyToNull(formData.get("birthDate")),

    email:
        emptyToNull(formData.get("email")),

    phone:
        emptyToNull(formData.get("phone")),

    address:
        emptyToNull(formData.get("address")),

    bloodType:
        emptyToNull(formData.get("bloodType")),

    emergencyContactName:
        emptyToNull(formData.get("emergencyContactName")),

    emergencyContactPhone:
        emptyToNull(formData.get("emergencyContactPhone")),

    photoUrl:
        emptyToNull(formData.get("photoUrl")),

    active:
        memberForm.elements.namedItem("active")?.checked ?? true
};

    const url = editingMemberId
        ? `${API_URL}/${editingMemberId}`
        : API_URL;

    const method = editingMemberId
        ? "PUT"
        : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
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

        closeMemberModal();
        await loadMembers();
    } catch (error) {
        alert(error.message);
    }
}

async function deactivateMember(id) {
    const confirmed = confirm(
        "¿Deseas desactivar este deportista?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(
                "No se pudo desactivar el deportista"
            );
        }

        await loadMembers();
    } catch (error) {
        alert(error.message);
    }
}

function filterMembers() {
    const searchTerm = searchBox.value
        .trim()
        .toLowerCase();

    const status = statusFilter.value;

    const filteredMembers = members.filter(member => {
        const searchableText = [
            member.identification,
            member.firstName,
            member.lastName,
            member.fullName,
            member.email,
            member.phone
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesText =
            searchTerm === ""
            || searchableText.includes(searchTerm);

        const matchesStatus =
            status === "all"
            || (status === "active" && member.active)
            || (status === "inactive" && !member.active);

        return matchesText && matchesStatus;
    });

    renderMembers(filteredMembers);
}

function updatePaginationInfo(total) {
    if (!paginationInfo) {
        return;
    }

    if (total === 0) {
        paginationInfo.textContent =
            "No existen deportistas para mostrar";
        return;
    }

    paginationInfo.textContent =
        `Mostrando ${total} deportista(s)`;
}

function getInitials(member) {
    const firstInitial =
        member.firstName?.charAt(0) ?? "";

    const lastInitial =
        member.lastName?.charAt(0) ?? "";

    return `${firstInitial}${lastInitial}`.toUpperCase();
}

function emptyToNull(value) {
    if (value === null || value === undefined) {
        return null;
    }

    const normalized = String(value).trim();

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

    return "No fue posible completar la operación";
}

function normalizeRequired(value) {
    return String(value ?? "").trim();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function validateMemberForm() {
    let valid = true;

    valid = validateRequiredField(
        "identification",
        "identificationError",
        "La identificación es obligatoria"
    ) && valid;

    valid = validateRequiredField(
        "firstName",
        "firstNameError",
        "Los nombres son obligatorios"
    ) && valid;

    valid = validateRequiredField(
        "lastName",
        "lastNameError",
        "Los apellidos son obligatorios"
    ) && valid;

    valid = validateEmail() && valid;
    valid = validatePhone() && valid;
    valid = validateBirthDate() && valid;

    return valid;
}

function validateRequiredField(
    fieldName,
    messageId,
    errorMessage
) {
    const field = memberForm.elements.namedItem(fieldName);
    const message = document.getElementById(messageId);
    const valid = Boolean(field?.value.trim());

    setFieldValidation(
        field,
        message,
        valid,
        valid ? "Información válida" : errorMessage
    );

    return valid;
}

function validateEmail() {
    const field = memberForm.elements.namedItem("email");
    const message = document.getElementById("emailError");
    const value = field.value.trim();

    if (value === "") {
        clearFieldValidation(field, message);
        return true;
    }

    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    setFieldValidation(
        field,
        message,
        valid,
        valid
            ? "Correo válido"
            : "Ingrese un correo electrónico válido"
    );

    return valid;
}

function validatePhone() {
    const field = memberForm.elements.namedItem("phone");
    const message = document.getElementById("phoneError");
    const value = field.value.trim();

    if (value === "") {
        clearFieldValidation(field, message);
        return true;
    }

    const valid = /^[0-9+\-\s()]{7,30}$/.test(value);

    setFieldValidation(
        field,
        message,
        valid,
        valid
            ? "Teléfono válido"
            : "Ingrese un teléfono válido"
    );

    return valid;
}

function validateBirthDate() {
    const field = memberForm.elements.namedItem("birthDate");
    const message = document.getElementById("birthDateError");

    if (!field.value) {
        clearFieldValidation(field, message);
        return true;
    }

    const selectedDate = new Date(`${field.value}T00:00:00`);
    const valid = selectedDate < new Date();

    setFieldValidation(
        field,
        message,
        valid,
        valid
            ? "Fecha válida"
            : "La fecha debe ser anterior a hoy"
    );

    return valid;
}

function setFieldValidation(
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

function clearFieldValidation(field, message) {
    field.classList.remove("valid", "invalid");
    message.textContent = "";
    message.classList.remove("success", "error");
}

function clearValidation() {
    memberForm
        .querySelectorAll(".valid, .invalid")
        .forEach(field =>
            field.classList.remove("valid", "invalid")
        );

    memberForm
        .querySelectorAll(".enterprise-field-message")
        .forEach(message => {
            message.textContent = "";
            message.classList.remove("success", "error");
        });
}

function initializeMembersPage() {
    console.log("Inicializando módulo Members");

    const requiredElements = {
        tableBody,
        searchBox,
        totalMembers,
        membersCounter,
        modal,
        newMemberButton,
        closeModalButton,
        cancelButton,
        memberForm,
        statusFilter,
        refreshMembersButton,
        paginationInfo
    };

    memberForm.elements.identification.addEventListener(
        "input",
        validateMemberForm
    );

    memberForm.elements.firstName.addEventListener(
        "input",
        validateMemberForm
    );

    memberForm.elements.lastName.addEventListener(
        "input",
        validateMemberForm
    );

    memberForm.elements.email.addEventListener(
        "input",
        validateEmail
    );

    memberForm.elements.phone.addEventListener(
        "input",
        validatePhone
    );

    memberForm.elements.birthDate.addEventListener(
        "change",
        validateBirthDate
    );

    const missingElements = Object.entries(requiredElements)
        .filter(([, element]) => element === null)
        .map(([name]) => name);

    if (missingElements.length > 0) {
        console.error(
            "Elementos HTML no encontrados:",
            missingElements
        );
        return;
    }

    newMemberButton.addEventListener("click", openCreateModal);
    closeModalButton.addEventListener("click", closeMemberModal);
    cancelButton.addEventListener("click", closeMemberModal);

    const overlay = modal.querySelector(".modal-overlay");

    if (overlay) {
        overlay.addEventListener("click", closeMemberModal);
    }

    memberForm.addEventListener("submit", saveMember);
    searchBox.addEventListener("input", filterMembers);

    tableBody.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const memberId = Number(button.dataset.memberId);

        if (!Number.isFinite(memberId)) {
            console.error("ID de deportista no válido");
            return;
        }

        if (button.dataset.action === "edit") {
            editMember(memberId);
            return;
        }

        if (button.dataset.action === "deactivate") {
            deactivateMember(memberId);
        }
    });

    loadMembers();

    statusFilter.addEventListener(
        "change",
        filterMembers
    );

    refreshMembersButton.addEventListener(
        "click",
        loadMembers
    );
}

initializeMembersPage();