// ===== Utility: Bootstrap toast helper =====
const toastEl = document.getElementById("saveToast");
const toast = toastEl ? new bootstrap.Toast(toastEl) : null;

// ===== INFO: client-side validation + save to localStorage (all required) =====
document.getElementById("save-info")?.addEventListener("click", () => {
  const form = document.getElementById("form-info");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  const payload = {
    name: document.getElementById("biz-name").value.trim(),
    email: document.getElementById("biz-email").value.trim(),
    phone1: document.getElementById("phone-1").value.trim(),
    phone2: document.getElementById("phone-2").value.trim(),
    address: document.getElementById("address").value.trim(),
    website: document.getElementById("website").value.trim(),
    instagram: document.getElementById("instagram").value.trim(),
    notes: document.getElementById("notes").value.trim(),
  };
  localStorage.setItem("lolos_config_info", JSON.stringify(payload));
  toast?.show();
});

// ===== HOURS: render rows for each day, keep columns aligned, simple open/close per day =====
const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const tbody = document.querySelector("#tabla-horarios tbody");

// Builds a single row for the "hours" table
function crearFila(dia, index) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
        <td class="fw-medium">${dia}</td>
        <td>
            <div class="form-check form-switch m-0">
            <input class="form-check-input toggle-abierto" type="checkbox" id="abierto-${index}" ${index === 6 ? "" : "checked"}>
            <label class="visually-hidden" for="abierto-${index}">Abierto</label>
            </div>
        </td>
        <td>
            <input type="time" class="form-control form-control-sm rounded-0 hora-apertura" value="08:00">
        </td>
        <td>
            <input type="time" class="form-control form-control-sm rounded-0 hora-cierre" value="20:00">
        </td>
        `;
  return tr;
}

// Render table rows and wire up behaviors
if (tbody) {
  DIAS.forEach((d, i) => tbody.appendChild(crearFila(d, i)));

  // Enable/disable time inputs when "Abierto" changes
  const updateRowDisabled = (row) => {
    const abierto = row.querySelector(".toggle-abierto").checked;
    row
      .querySelectorAll('input[type="time"]')
      .forEach((inp) => (inp.disabled = !abierto));
  };

  // Initialize all rows
  [...tbody.rows].forEach((row) => {
    updateRowDisabled(row);
    row
      .querySelector(".toggle-abierto")
      .addEventListener("change", () => updateRowDisabled(row));
  });

  // Copy Monday schedule to the rest of the week
  document.getElementById("btn-copiar-lunes")?.addEventListener("click", () => {
    const lunes = tbody.rows[0];
    const abierto = lunes.querySelector(".toggle-abierto").checked;
    const open = lunes.querySelector(".hora-apertura").value;
    const close = lunes.querySelector(".hora-cierre").value;

    [...tbody.rows].forEach((r, idx) => {
      if (idx === 0) return;
      r.querySelector(".toggle-abierto").checked = abierto;
      r.querySelector(".hora-apertura").value = open;
      r.querySelector(".hora-cierre").value = close;
      updateRowDisabled(r);
    });
  });

  // Mark all days as closed
  document.getElementById("btn-cerrar-todos")?.addEventListener("click", () => {
    [...tbody.rows].forEach((r) => {
      r.querySelector(".toggle-abierto").checked = false;
      updateRowDisabled(r);
    });
  });
}

// Save hours configuration to localStorage
document.getElementById("save-hours")?.addEventListener("click", () => {
  const datos = [...tbody.rows].map((r, idx) => ({
    dia: DIAS[idx],
    abierto: r.querySelector(".toggle-abierto").checked,
    apertura: r.querySelector(".hora-apertura").value || null,
    cierre: r.querySelector(".hora-cierre").value || null,
  }));
  localStorage.setItem("lolos_config_hours", JSON.stringify(datos));
  toast?.show();
});

// ===== NOTIFICATIONS (simple switches like your mock) =====
document.getElementById("save-notifs")?.addEventListener("click", () => {
  const payload = {
    stockLow: document.getElementById("notif-stock").checked,
    promosExpiring: document.getElementById("notif-promos").checked,
    newOrders: document.getElementById("notif-orders").checked,
  };
  localStorage.setItem("lolos_config_alerts", JSON.stringify(payload));
  toast?.show();
});
