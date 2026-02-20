// ===========================================
// Users page: top-buttons tabs, modal edit/delete
// Persist single edits; update table immediately
// ===========================================
// --- LocalStorage key ---
const LS_KEY = "lolos_users_v1";

// --- Seed dataset (random) ---
const SEED = {
  admins: [
    {
      id: 1,
      name: "Ana López",
      role: "Administrador",
      status: "Activo",
      lastActive: "Hace 3 min",
    },
    {
      id: 2,
      name: "Carlos Méndez",
      role: "Administrador",
      status: "Inactivo",
      lastActive: "Hace 2 días",
    },
    {
      id: 3,
      name: "Brenda Torres",
      role: "Empleado",
      status: "Activo",
      lastActive: "Hace 12 min",
    },
    {
      id: 4,
      name: "Diego Ramírez",
      role: "Administrador",
      status: "Activo",
      lastActive: "Hace 1 h",
    },
    {
      id: 5,
      name: "Elena Vargas",
      role: "Empleado",
      status: "Suspendido",
      lastActive: "Hace 5 días",
    },
    {
      id: 6,
      name: "Fabián Ortega",
      role: "Administrador",
      status: "Activo",
      lastActive: "Hace 47 min",
    },
  ],
  clients: [
    {
      id: 101,
      name: "María Ríos",
      email: "maria.rios@example.com",
      phone: "554 123 9876",
    },
    {
      id: 102,
      name: "Óscar Pérez",
      email: "oscar.pz@example.com",
      phone: "553 221 0045",
    },
    {
      id: 103,
      name: "Paulina Neri",
      email: "paulina.neri@example.com",
      phone: "551 987 0001",
    },
    {
      id: 104,
      name: "Raúl Gómez",
      email: "raul.gmz@example.com",
      phone: "552 665 7788",
    },
    {
      id: 105,
      name: "Sara Campos",
      email: "sara.campos@example.com",
      phone: "555 010 2222",
    },
  ],
};

// --- State (load from localStorage or seed) ---
let DATA = loadFromStorage() || SEED;
let currentTab = "admins";
let currentQuery = "";

// --- DOM refs ---
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");

const btnTabAdmins = document.getElementById("tab-admins");
const btnTabClients = document.getElementById("tab-clients");

const toastEl = document.getElementById("saveToast");
const toastMsg = document.getElementById("toastMsg");
const toast = toastEl ? new bootstrap.Toast(toastEl) : null;

// Modal + fields
const editModalEl = document.getElementById("editUserModal");
const editModal = new bootstrap.Modal(editModalEl);
const editForm = document.getElementById("editUserForm");

const editUserId = document.getElementById("editUserId");
const editUserType = document.getElementById("editUserType");

const adminFields = document.getElementById("adminFields");
const adminName = document.getElementById("adminName");
const adminRole = document.getElementById("adminRole");
const adminStatus = document.getElementById("adminStatus");

const clientFields = document.getElementById("clientFields");
const clientName = document.getElementById("clientName");
const clientEmail = document.getElementById("clientEmail");
const clientPhone = document.getElementById("clientPhone");

const deleteUserBtn = document.getElementById("deleteUserBtn");

// --------------------------
// Storage helpers
// --------------------------
const url = `http://localhost:8080/api/v1/users`;
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    console.log("Loaded from storage:", raw);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Failed to parse localStorage", e);
    return null;
  }
}

const usersInfo = document.getElementById('usersApi');

function fetchFromAPI() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
                usersInfo.innerHTML = `<p>No hay usuarios registrados.</p>`;
                return;
      }
                let renderUsers = `<h3>Usuarios registrados:</h3>`;
                data.forEach(user => {
                    renderUsers  += `
                    <div style="margin-bottom: 1rem; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px;">
                        <p><strong>Nombre de usuario:</strong> ${user.nameOf}</p>
                        <p><strong>Correo electrónico:</strong> ${user.email}</p>
                        <p><strong>Estado de usuario:</strong> ${user.available ? "Disponible" : "No disponible"}</p>
                    </div>
                `;
            });
            usersInfo.innerHTML = renderUsers;
      })
    
    .catch(error => {
      usersInfo.innerHTML = `<p>Error al cargar los usuarios.</p>`;
      console.error(error);
    });
}


function saveToStorage() {
  localStorage.setItem(LS_KEY, JSON.stringify(DATA));
}

// --------------------------
// Rendering: head + body
// --------------------------
function renderHead() {
  if (currentTab === "admins") {
    tableHead.innerHTML = `
          <tr>
            <th class="icon-col"><i class="bi bi-person"></i></th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Actividad</th>
            <th class="icon-col"><i class="bi bi-gear"></i></th>
          </tr>
        `;
  } else {
    tableHead.innerHTML = `
          <tr>
            <th class="icon-col"><i class="bi bi-person"></i></th>
            <th>Usuario</th>
            <th>Correo Electrónico</th>
            <th>Celular</th>
            <th class="icon-col"><i class="bi bi-gear"></i></th>
          </tr>
        `;
  }
}

function matchesQuery(item, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return true;
  const fields = [
    item.name,
    item.role,
    item.status,
    item.lastActive,
    item.email,
    item.phone,
  ]
    .filter(Boolean)
    .map((v) => String(v).toLowerCase());
  return fields.some((v) => v.includes(q));
}

function renderBody() {
  const list = DATA[currentTab].filter((x) => matchesQuery(x, currentQuery));
  if (currentTab === "admins") {
    tableBody.innerHTML = list
      .map(
        (u) => `
          <tr>
            <td class="icon-col"><span class="avatar"><i class="bi bi-person"></i></span></td>
            <td>${u.name}</td>
            <td>${u.role}</td>
            <td>${u.status}</td>
            <td>${u.lastActive}</td>
            <td class="icon-col">
              <button class="btn btn-link p-0 gear" title="Editar" data-entity="admins" data-id="${u.id}">
                <i class="bi bi-gear"></i>
              </button>
            </td>
          </tr>
        `,
      )
      .join("");
  } else {
    tableBody.innerHTML = list
      .map(
        (c) => `
          <tr>
            <td class="icon-col"><span class="avatar"><i class="bi bi-person"></i></span></td>
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td class="icon-col">
              <button class="btn btn-link p-0 gear" title="Editar" data-entity="clients" data-id="${c.id}">
                <i class="bi bi-gear"></i>
              </button>
            </td>
          </tr>
        `,
      )
      .join("");
  }
}

function renderAll() {
  renderHead();
  renderBody();
}

// --------------------------
// Tabs behavior
// --------------------------
function setTab(tab) {
  if (tab === currentTab) return;
  currentTab = tab;

  // Remove 'active' and set aria-selected="false" on both
  [btnTabAdmins, btnTabClients].forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
  });

  // Activate current
  const btn = currentTab === "admins" ? btnTabAdmins : btnTabClients;
  btn.classList.add("active");
  btn.setAttribute("aria-selected", "true");

  // Re-render table
  renderAll();
}

btnTabAdmins.addEventListener("click", () => setTab("admins"));
btnTabClients.addEventListener("click", () => setTab("clients"));

// --------------------------
// Search
// --------------------------
let searchTimer = null;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    currentQuery = e.target.value || "";
    renderBody();
  }, 120);
});

// --------------------------
// Open modal from gear button
// --------------------------
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".gear");
  if (!btn) return;

  const entity = btn.getAttribute("data-entity"); // 'admins' | 'clients'
  const id = Number(btn.getAttribute("data-id"));
  const record = DATA[entity].find((x) => x.id === id);
  if (!record) return;

  // Reset validation
  editForm.classList.remove("was-validated");

  // Fill hidden fields
  editUserId.value = String(id);
  editUserType.value = entity;

  // Toggle field groups + assign values
  if (entity === "admins") {
    document.getElementById("editModalTitle").textContent =
      "Editar administrador";
    adminFields.classList.remove("d-none");
    clientFields.classList.add("d-none");
    adminName.value = record.name || "";
    adminRole.value = record.role || "Empleado";
    adminStatus.value = record.status || "Activo";
  } else {
    document.getElementById("editModalTitle").textContent = "Editar cliente";
    clientFields.classList.remove("d-none");
    adminFields.classList.add("d-none");
    clientName.value = record.name || "";
    clientEmail.value = record.email || "";
    clientPhone.value = record.phone || "";
  }

  editModal.show();
});

// --------------------------
// Save (modal submit) — persist only edited user
// --------------------------
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!editForm.checkValidity()) {
    editForm.classList.add("was-validated");
    return;
  }

  const entity = editUserType.value; // 'admins' | 'clients'
  const id = Number(editUserId.value);
  const list = DATA[entity];
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return;

  if (entity === "admins") {
    list[idx] = {
      ...list[idx],
      name: adminName.value.trim(),
      role: adminRole.value,
      status: adminStatus.value,
    };
  } else {
    list[idx] = {
      ...list[idx],
      name: clientName.value.trim(),
      email: clientEmail.value.trim(),
      phone: clientPhone.value.trim(),
    };
  }

  saveToStorage();
  renderBody();
  editModal.hide();

  toastMsg.textContent = "Cambios guardados.";
  toast?.show();
});

// --------------------------
// Delete (inside modal) — ask for confirmation
// --------------------------
deleteUserBtn.addEventListener("click", () => {
  const entity = editUserType.value;
  const id = Number(editUserId.value);
  const list = DATA[entity];

  if (!confirm("¿Eliminar este usuario? Esta acción no se puede deshacer."))
    return;

  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return;

  list.splice(idx, 1);
  saveToStorage();
  renderBody();
  editModal.hide();

  toastMsg.textContent = "Usuario eliminado.";
  toast?.show();
});

// --------------------------
// Initial render
// --------------------------
renderAll();
fetchFromAPI();

