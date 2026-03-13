// use the new db.js structure
// remove duplicate code and handle drinks and desserts

import { drinks, desserts, milks, extras } from "../db/db.js";

let basePrice = 0;

document.addEventListener("DOMContentLoaded", () => {

    const btnMas = document.getElementById("btn-mas");
    const btnMenos = document.getElementById("btn-menos");
    const inputCantidad = document.getElementById("input-cantidad");

    btnMas.addEventListener("click", () => {
        inputCantidad.value = parseInt(inputCantidad.value) + 1;
        updateTotalPrice();
    });

    btnMenos.addEventListener("click", () => {
        const value = parseInt(inputCantidad.value);
        if (value > 1) {
            inputCantidad.value = value - 1;
            updateTotalPrice();
        }
    });
});

/* =========================
   MODAL HANDLER
========================= */

function loadModal(modalElement) {

    modalElement.addEventListener("show.bs.modal", (event) => {

        const card = event.relatedTarget;
        if (!card) return;

        const product = JSON.parse(card.dataset.product);

        const modalImg = modalElement.querySelector("#modalImg");
        const modalTitle = modalElement.querySelector("#modalTitle");
        const modalPrice = modalElement.querySelector("#modalPrice");
        const modalDescription = modalElement.querySelector("#modalDescription");
        const modalBadge = modalElement.querySelector("#modalBadge");

        modalImg.src = product.image;
        modalImg.alt = product.name;
        modalTitle.textContent = product.name;
        modalDescription.textContent = product.description;

        const firstSize = product.sizes[0];
        basePrice = product.priceBySize[firstSize];

        modalPrice.textContent = `$${basePrice}`;

        if (product.badge) {
            modalBadge.textContent = `☆ ${product.badge}`;
            modalBadge.classList.remove("d-none");
        } else {
            modalBadge.classList.add("d-none");
        }

        renderSizes(product);

        if (product.temperatures) renderTemperatures(product);
        if (product.allowsMilk) renderMilks();
        if (product.allowsExtras) renderExtras();

        updateTotalPrice();
    });
}

const modalDrinks = document.getElementById("modalDrinks");
const modalPostres = document.getElementById("modalPostres");

if (modalDrinks) loadModal(modalDrinks);
if (modalPostres) loadModal(modalPostres);

/* =========================
   RENDER SIZES
========================= */

function renderSizes(product) {

    const container = document.getElementById("size-options");
    container.innerHTML = "";

    const sizeNames = {
        ch: "Chico (14 oz)",
        md: "Mediano (16 oz)",
        lg: "Grande (20 oz)",
        slice: "Rebanada",
        full: "Entero"
    };

    product.sizes.forEach((size, index) => {

        const price = product.priceBySize[size];
        const checked = index === 0 ? "checked" : "";

        container.innerHTML += `
        <div class="form-check mb-2">
            <input class="form-check-input"
                type="radio"
                name="size"
                value="${price}"
                ${checked}>

            <label class="form-check-label">
                ${sizeNames[size]} - $${price}
            </label>
        </div>
        `;
    });

    container.querySelectorAll("input[name='size']")
        .forEach(el => el.addEventListener("change", updateTotalPrice));
}

/* =========================
   RENDER TEMPERATURES
========================= */

function renderTemperatures(product) {

    const container = document.getElementById("temperature-options");
    container.innerHTML = "";

    const names = {
        hot: "Caliente",
        rocks: "En las rocas",
        frappe: "Frappé"
    };

    product.temperatures.forEach((temp, index) => {

        const checked = index === 0 ? "checked" : "";

        container.innerHTML += `
        <div class="form-check mb-2">
            <input class="form-check-input"
                type="radio"
                name="temp"
                ${checked}>

            <label class="form-check-label">
                ${names[temp]}
            </label>
        </div>
        `;
    });
}

/* =========================
   RENDER MILKS
========================= */

function renderMilks() {

    const container = document.getElementById("milks-container");
    container.innerHTML = "";

    milks.forEach((milk, index) => {

        const checked = index === 0 ? "checked" : "";

        container.innerHTML += `
        <div class="form-check mb-2">
            <input class="form-check-input"
                type="radio"
                name="milk"
                value="${milk.price}"
                ${checked}>

            <label class="form-check-label">
                ${milk.name} - $${milk.price}
            </label>
        </div>
        `;
    });

    container.querySelectorAll("input[name='milk']")
        .forEach(el => el.addEventListener("change", updateTotalPrice));
}

/* =========================
   RENDER EXTRAS
========================= */

function renderExtras() {

    const container = document.getElementById("extras-container");
    container.innerHTML = "";

    extras.forEach((extra, index) => {

        const checked = index === 0 ? "checked" : "";

        container.innerHTML += `
        <div class="form-check mb-2">
            <input class="form-check-input"
                type="radio"
                name="extra"
                value="${extra.price}"
                ${checked}>

            <label class="form-check-label">
                ${extra.name} - $${extra.price}
            </label>
        </div>
        `;
    });

    container.querySelectorAll("input[name='extra']")
        .forEach(el => el.addEventListener("change", updateTotalPrice));
}

/* =========================
   TOTAL PRICE
========================= */

function updateTotalPrice() {

    const qty = parseInt(document.getElementById("input-cantidad").value) || 1;

    const sizePrice = Number(document.querySelector("input[name='size']:checked")?.value || 0);
    const milkPrice = Number(document.querySelector("input[name='milk']:checked")?.value || 0);
    const extraPrice = Number(document.querySelector("input[name='extra']:checked")?.value || 0);

    const total = (sizePrice + milkPrice + extraPrice) * qty;

    document.getElementById("modal-total-dinamico").textContent =
        `$ ${total.toFixed(2)}`;
}