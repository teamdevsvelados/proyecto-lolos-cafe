// ===========================================
// Users page: top-buttons tabs, modal edit/delete
// Persist single edits; update table immediately
// ===========================================
const BASE_URL = 'http://localhost:8080'
let apiData
// --- DOM refs ---
const searchInput = document.getElementById("searchInput");
const btnTabAdmins = document.getElementById("tab-admins");
const btnTabClients = document.getElementById("tab-clients");

// Modal + fields
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'))
let pendingDeleteId = null

const adminFields = document.getElementById("adminFields");
const adminName = document.getElementById("adminName");
const adminRole = document.getElementById("adminRole");
const adminStatus = document.getElementById("adminStatus");

const clientFields = document.getElementById("clientFields");
const clientName = document.getElementById("clientName");
const clientEmail = document.getElementById("clientEmail");
const clientPhone = document.getElementById("clientPhone");

const deleteUserBtn = document.getElementById("deleteUserBtn");

function fetchFromAPI() {
  const url = `${BASE_URL}/api/v1/users`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      apiData = data
      renderUsersTable(data)
    })
    .catch(error => {
      usersInfo.innerHTML = `<p>Error al cargar los usuarios.</p>`;
      console.error(error);
    });
}

function renderUsersTable(data) {
  const tableHead = document.getElementById("tableHead");
  const tableBody = document.getElementById("tableBody");

  tableHead.innerHTML = `
    <tr>
      <th class="icon-col"><i class="bi bi-person"></i></th>
      <th>Usuario</th>
      <th>Correo</th>
      <th>Estatus</th>
      <th class="icon-col">Eliminar</th>
    </tr>
  `;

  if (data.length === 0) {
    tableBody.innerHTML = data.map(() => 
      `
        <tr>
          <td class="icon-col">No hay usuarios registrados.</td>
        </tr>
      `,
    ).join("");
    return
  }

  if (currentTab === "admins") {
    tableBody.innerHTML = data.map(user => 
      `
        <tr>
          <td class="icon-col"><span class="avatar"><i class="bi bi-person"></i></span></td>
          <td>${user.nameOf}</td>
          <td>${user.email}</td>
          <td>${user.available ? 'Activo' : 'Inactivo'}</td>
          <td class="icon-col">
            <button class="btn btn-link p-0 delete-action text-danger" title="Eliminar" data-entity="admins" data-id="${user.id}">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>
      `,
    ).join("");
  } else {
    tableBody.innerHTML = data.map( cliente => 
      `
        <tr>
          <td class="icon-col"><span class="avatar"><i class="bi bi-person"></i></span></td>
          <td>${cliente.nameOf}</td>
          <td>${cliente.email}</td>
          <td>${cliente.available ? 'Activo' : 'Inactivo'}</td>
          <td class="icon-col">
            <button class="btn btn-link p-0 delete-action text-danger" title="Eliminar" data-entity="clients" data-id="${cliente.id}">
              <i class="bi bi-trash3"></i>
            </button>
          </td>
        </tr>
      `,
      ).join("");
  }
}

// --------------------------
// Search
// --------------------------
searchInput.addEventListener("input", (e) => {
  const filteredUsers = apiData.filter( user => {
    return user.nameOf.toLowerCase().includes(e.target.value.toLowerCase())
  })
  renderUsersTable(filteredUsers)
});


// --- LocalStorage key ---
let currentTab = "admins";
let currentQuery = "";

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
}

btnTabAdmins.addEventListener("click", () => setTab("admins"));
btnTabClients.addEventListener("click", () => setTab("clients"));



// --------------------------
// DELETE USER
// --------------------------
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-action");
  if (!btn) return;

  pendingDeleteId = Number(btn.getAttribute("data-id"));
  deleteModal.show();
});

document.getElementById('confirmDelete').addEventListener('click', async (e) => {
  const url = `${BASE_URL}/api/v1/users/delete-user/${pendingDeleteId}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    if(!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)        
    }
    
    deleteModal.hide();
    showToast('Usuario eliminado correctamente', 'success')
    fetchFromAPI()
  } catch (error) {
    console.warn('Fetch error: ', error)
    showToast('Hubo un error al realizar la acción, inténtalo más tarde', 'danger')
  } finally {
    pendingDeleteId = null;
  }

});


function showToast(message, type = 'success') {
  const toastElement = document.querySelector("#dynamicToast")
  const toastMessage = document.querySelector('#toastMessage');
  
  // Cambia color según el tipo
  toastElement.className = `toast align-items-center border-0 text-bg-${type}`;
  toastMessage.textContent = message;
  
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// --------------------------
// Initial render
// --------------------------
fetchFromAPI();