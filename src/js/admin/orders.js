// =========================================================
// Orders board
// =========================================================

const LS_KEY = "lolos_orders_board_v1";

// Example Seed
const SEED = [
  {
    id: 41223,
    status: "new",
    code: "#41223",
    customer: "Dafne Hernández",
    type: "Pedido para recolección / llevar",
    placedAt: "12:22 p.m.",
    items: [
      {
        name: "Latte Vainilla Francesa",
        options: "Grande | Caliente | Leche deslactosada | Sin azúcar",
        price: 75,
      },
      {
        name: "Caramel Macchiato",
        options: "Mediano | Frío | Leche regular",
        price: 60,
      },
      {
        name: "Moka",
        options: "Grande | Caliente | Nata | Doble espresso",
        price: 63,
      },
      { name: "Cheesecake Vasco", options: "Rebanada", price: 40 },
    ],
  },
  {
    id: 46432,
    status: "new",
    code: "#46432",
    customer: "Misael Valencia",
    type: "Pedido para recolección / llevar",
    placedAt: "11:55 a.m.",
    items: [
      { name: "Americano", options: "Grande | Caliente", price: 40 },
      { name: "Rol de canela", options: "Pieza", price: 35 },
    ],
  },
  {
    id: 41242,
    status: "new",
    code: "#41242",
    customer: "Sandra Borboa",
    type: "Pedido para recolección / llevar",
    placedAt: "11:30 a.m.",
    items: [
      {
        name: "Matcha Latte",
        options: "Mediano | Frío | Leche de almendra",
        price: 68,
      },
    ],
  },
  {
    id: 51242,
    status: "prep",
    code: "#51242",
    customer: "Andrea Castro",
    type: "Recolección",
    placedAt: "10:51 a.m.",
    items: [{ name: "Capuchino", options: "Mediano | Caliente", price: 48 }],
  },
  {
    id: 52242,
    status: "prep",
    code: "#52242",
    customer: "Juan Esteban",
    type: "Recolección",
    placedAt: "10:42 a.m.",
    items: [{ name: "Chai Latte", options: "Grande | Caliente", price: 55 }],
  },
  {
    id: 61242,
    status: "done",
    code: "#61242",
    customer: "Daniel Martínez",
    type: "Recolección",
    placedAt: "10:10 a.m.",
    items: [{ name: "Espresso doble", options: "Corto", price: 35 }],
  },
];

// --- State ---
let ORDERS = loadOrders();
if (!ORDERS) {
  ORDERS = [...SEED];
  saveOrders();
}

let selectedOrderId = null; // id's order
let searchQuery = ""; // search query in lowercase

// --- DOM refs ---
const listNew = document.getElementById("list-new");
const listPrep = document.getElementById("list-prep");
const listDone = document.getElementById("list-done");

const countNew = document.getElementById("count-new");
const countPrep = document.getElementById("count-prep");
const countDone = document.getElementById("count-done");

const searchBox = document.getElementById("searchBox");

// Modal
const orderDetailModal = new bootstrap.Modal(
  document.getElementById("orderDetailModal"),
);
const toast = new bootstrap.Toast(document.getElementById("feedbackToast"));
const toastMsg = document.getElementById("toastMsg");

// Details Modal
const odmCustomer = document.getElementById("odmCustomer");
const odmCode = document.getElementById("odmCode");
const odmType = document.getElementById("odmType");
const odmPlacedAt = document.getElementById("odmPlacedAt");
const odmItems = document.getElementById("odmItems");
const odmTotal = document.getElementById("odmTotal");
const odmActions = document.getElementById("odmActions");

// ----------------- Storage -----------------
function loadOrders() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn("Failed to parse orders LS", e);
    return null;
  }
}
function saveOrders() {
  localStorage.setItem(LS_KEY, JSON.stringify(ORDERS));
}

// ----------------- Helpers -----------------
const mxn = (n) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const countByStatus = (s) => ORDERS.filter((o) => o.status === s).length;
const plural = (n, one, many) => (n === 1 ? one : many);

// Search in: code, customer, and item names/options
function matchesQuery(order, q) {
  if (!q) return true;
  const inCode = (order.code || "").toLowerCase().includes(q);
  const inCustomer = (order.customer || "").toLowerCase().includes(q);
  const inItems = (order.items || []).some(
    (it) =>
      (it.name || "").toLowerCase().includes(q) ||
      (it.options || "").toLowerCase().includes(q),
  );
  return inCode || inCustomer || inItems;
}

// Highlight term without breaking HTML
function hi(text, q) {
  if (!q) return escapeHtml(text);
  const safe = escapeHtml(text);
  const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
  return safe.replace(re, '<mark class="search-hit">$1</mark>');
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ----------------- Render -----------------
function render() {
  // Status counters (not affected by the filter)
  countNew.textContent = countByStatus("new");
  countPrep.textContent = countByStatus("prep");
  countDone.textContent = countByStatus("done");

  // Lists filtered by query
  const q = (searchQuery || "").trim().toLowerCase();
  renderList(listNew, "new", q);
  renderList(listPrep, "prep", q);
  renderList(listDone, "done", q);
}

function renderList(container, status, q) {
  const rows = ORDERS.filter((o) => o.status === status)
    .filter((o) => matchesQuery(o, q))
    .map((o) => rowTpl(o, q))
    .join("");

  container.innerHTML = rows || emptyTpl();
}

function emptyTpl() {
  return `<div class="text-center text-muted py-3">Sin pedidos en esta sección</div>`;
}

// A row with actual item count and highlighting
function rowTpl(o, q) {
  const nItems = o.items?.length || 0;
  const itemsLabel = `${nItems} ${plural(nItems, "artículo", "artículos")}`;
  return `
        <div class="order-row" data-id="${o.id}" data-status="${o.status}">
          <div class="order-id">${hi(o.code, q)}</div>
          <div class="order-customer">${hi(o.customer, q)}</div>
          <div class="order-items">${itemsLabel}</div>
          <div class="order-time">${o.placedAt || ""}</div>
          <div class="order-gear"><i class="bi bi-chevron-right"></i></div>
        </div>
      `;
}

// ----------------- Global events -----------------
// ck on rows: open the detail modal for any status
document.addEventListener("click", (e) => {
  const row = e.target.closest(".order-row");
  if (!row) return;
  const id = Number(row.getAttribute("data-id"));
  const order = ORDERS.find((o) => o.id === id);
  if (!order) return;

  selectedOrderId = id;
  fillDetailModal(order);
  orderDetailModal.show();
});

// Search box with debounce
const debounce = (fn, ms = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};
const onSearch = debounce((ev) => {
  searchQuery = ev.target.value || "";
  render();
}, 150);
searchBox?.addEventListener("input", onSearch);

// ----------------- Details Modal  -----------------
function fillDetailModal(o) {
  // Header
  odmCustomer.innerHTML = escapeHtml(o.customer);
  odmCode.textContent = o.code;
  odmType.textContent = o.type || "";
  odmPlacedAt.textContent = o.placedAt || "";

  // Items
  const rows = (o.items || [])
    .map(
      (it) => `
        <tr>
          <td class="fw-semibold">${escapeHtml(it.name)}</td>
          <td class="text-muted small">${escapeHtml(it.options || "")}</td>
          <td class="text-end price">${mxn(Number(it.price) || 0)}</td>
        </tr>
      `,
    )
    .join("");
  odmItems.innerHTML = rows;

  // Total
  const total = (o.items || []).reduce(
    (acc, it) => acc + (Number(it.price) || 0),
    0,
  );
  odmTotal.textContent = mxn(total);

  // Actions by status
  renderDetailActions(o);
}

function renderDetailActions(o) {
  odmActions.innerHTML = "";

  if (o.status === "new") {
    odmActions.innerHTML = `
          <button type="button" class="btn btn-outline-danger rounded-0" id="btnOdmDelete">
            <i class="bi bi-trash3 me-1"></i> Eliminar pedido
          </button>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-dark rounded-0" id="btnStartPrep">Iniciar preparación</button>
          </div>
        `;
    document
      .getElementById("btnOdmDelete")
      .addEventListener("click", () => confirmDelete(o.id));
    document
      .getElementById("btnStartPrep")
      .addEventListener("click", () =>
        moveTo(o.id, "prep", "Pedido movido a preparación."),
      );
    return;
  }

  if (o.status === "prep") {
    odmActions.innerHTML = `
          <button type="button" class="btn btn-outline-danger rounded-0" id="btnOdmDelete">
            <i class="bi bi-trash3 me-1"></i> Eliminar pedido
          </button>
          <div class="d-flex gap-2">
            <button type="button" class="btn btn-outline-dark rounded-0" id="btnGoBack">Regresar a Nuevos</button>
            <button type="button" class="btn btn-dark rounded-0" id="btnFinish">Marcar como Finalizado</button>
          </div>
        `;
    document
      .getElementById("btnOdmDelete")
      .addEventListener("click", () => confirmDelete(o.id));
    document
      .getElementById("btnGoBack")
      .addEventListener("click", () =>
        moveTo(o.id, "new", "Pedido regresado a Nuevos."),
      );
    document
      .getElementById("btnFinish")
      .addEventListener("click", () =>
        moveTo(o.id, "done", "Pedido finalizado."),
      );
    return;
  }

  // done: just reading
  odmActions.innerHTML = `
        <div class="text-muted">Pedido finalizado · Solo lectura</div>
        <button type="button" class="btn btn-outline-secondary rounded-0" data-bs-dismiss="modal">Cerrar</button>
      `;
}

// ----------------- Actions -----------------
function moveTo(id, status, msg) {
  const o = ORDERS.find((x) => x.id === id);
  if (!o) return;
  o.status = status;
  saveOrders();
  orderDetailModal.hide();
  render();
  feedback(msg || "Estado actualizado.");
}

function confirmDelete(id) {
  // Native confirmation
  if (!confirm("¿Deseas eliminar este pedido?")) return;
  const idx = ORDERS.findIndex((x) => x.id === id);
  if (idx === -1) return;
  ORDERS.splice(idx, 1);
  saveOrders();
  orderDetailModal.hide();
  render();
  feedback("Pedido eliminado.");
}

function feedback(msg) {
  toastMsg.textContent = msg;
  toast.show();
}

// ----------------- Initial render -----------------
render();
