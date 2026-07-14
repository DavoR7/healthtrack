const rolesGrid = document.getElementById("roles-grid");
const loadingMessage = document.getElementById("loading-message");
const roleCount = document.getElementById("role-count");
const activeRoleCount = document.getElementById("active-role-count");
const apiStatus = document.getElementById("api-status");

const modal = document.getElementById("role-modal");
const form = document.getElementById("role-form");
const modalTitle = document.getElementById("modal-title");
const formMessage = document.getElementById("form-message");

const roleIdInput = document.getElementById("role-id");
const roleCodeInput = document.getElementById("role-code");
const roleNameInput = document.getElementById("role-name");
const roleDescriptionInput = document.getElementById("role-description");
const roleActiveInput = document.getElementById("role-active");

async function loadSystemStatus() {
    try {
        const response = await fetch("/api/v1/status");

        if (!response.ok) {
            throw new Error();
        }

        const data = await response.json();
        apiStatus.textContent = data.status;
    } catch {
        apiStatus.textContent = "Sin conexión";
    }
}

async function loadRoles() {
    loadingMessage.style.display = "block";
    loadingMessage.textContent = "Cargando roles desde PostgreSQL...";

    try {
        const response = await fetch("/api/v1/identity/roles");

        if (!response.ok) {
            throw new Error("No se pudieron obtener los roles");
        }

        const roles = await response.json();

        loadingMessage.style.display = "none";
        roleCount.textContent = roles.length;
        activeRoleCount.textContent = roles.filter(role => role.active).length;

        rolesGrid.innerHTML = roles.map(createRoleCard).join("");
    } catch (error) {
        loadingMessage.style.display = "none";

        rolesGrid.innerHTML = `
            <div class="error-message">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}

function createRoleCard(role) {
    return `
        <article class="role-card">
            <span class="role-code">
                ${escapeHtml(role.code)}
            </span>

            <h4>${escapeHtml(role.name)}</h4>

            <p>
                ${escapeHtml(role.description ?? "Sin descripción")}
            </p>

            <span class="role-status">
                ${role.active ? "Activo" : "Inactivo"}
            </span>

            <div class="role-actions">
                <button
                    class="small-button"
                    type="button"
                    onclick="editRole(${role.id})"
                >
                    Editar
                </button>

                <button
                    class="small-button danger-button"
                    type="button"
                    onclick="deleteRole(${role.id}, '${escapeAttribute(role.name)}')"
                >
                    Eliminar
                </button>
            </div>
        </article>
    `;
}

function openCreateModal() {
    form.reset();
    roleIdInput.value = "";
    roleActiveInput.checked = true;
    modalTitle.textContent = "Nuevo rol";
    formMessage.textContent = "";
    modal.classList.remove("hidden");
    roleCodeInput.focus();
}

async function editRole(id) {
    try {
        const response = await fetch(`/api/v1/identity/roles/${id}`);

        if (!response.ok) {
            throw new Error("No se pudo cargar el rol");
        }

        const role = await response.json();

        roleIdInput.value = role.id;
        roleCodeInput.value = role.code;
        roleNameInput.value = role.name;
        roleDescriptionInput.value = role.description ?? "";
        roleActiveInput.checked = role.active;

        modalTitle.textContent = "Editar rol";
        formMessage.textContent = "";
        modal.classList.remove("hidden");
    } catch (error) {
        alert(error.message);
    }
}

async function saveRole(event) {
    event.preventDefault();
    formMessage.textContent = "";

    const roleId = roleIdInput.value;

    const payload = {
        code: roleCodeInput.value,
        name: roleNameInput.value,
        description: roleDescriptionInput.value,
        active: roleActiveInput.checked
    };

    const url = roleId
        ? `/api/v1/identity/roles/${roleId}`
        : "/api/v1/identity/roles";

    const method = roleId ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const responseBody = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(extractErrorMessage(responseBody));
        }

        closeModal();
        await loadRoles();
    } catch (error) {
        formMessage.textContent = error.message;
    }
}

async function deleteRole(id, name) {
    const confirmed = confirm(
        `¿Deseas eliminar el rol "${name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `/api/v1/identity/roles/${id}`,
            { method: "DELETE" }
        );

        if (!response.ok) {
            const body = await response.json().catch(() => null);
            throw new Error(extractErrorMessage(body));
        }

        await loadRoles();
    } catch (error) {
        alert(error.message);
    }
}

function extractErrorMessage(body) {
    if (!body) {
        return "Ocurrió un error inesperado";
    }

    if (body.message) {
        return body.message;
    }

    if (body.validationErrors) {
        return Object.values(body.validationErrors).join(". ");
    }

    return "No fue posible completar la operación";
}

function closeModal() {
    modal.classList.add("hidden");
    form.reset();
    formMessage.textContent = "";
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value)
        .replaceAll("`", "&#096;");
}

document.getElementById("open-role-modal")
    .addEventListener("click", openCreateModal);

document.getElementById("close-role-modal")
    .addEventListener("click", closeModal);

document.getElementById("close-modal-overlay")
    .addEventListener("click", closeModal);

document.getElementById("cancel-role")
    .addEventListener("click", closeModal);

form.addEventListener("submit", saveRole);

document.addEventListener("DOMContentLoaded", () => {
    loadSystemStatus();
    loadRoles();
});