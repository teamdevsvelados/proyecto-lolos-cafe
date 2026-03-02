import { desserts, drinksWithCoffee, drinksWithoutCoffee, extras, milks } from "../db/db.js";

document.addEventListener('DOMContentLoaded', function () {
    const btnMas = document.getElementById('btn-mas');
    const btnMenos = document.getElementById('btn-menos');
    const inputCantidad = document.getElementById('input-cantidad');

    // Función para aumentar
    btnMas.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        inputCantidad.value = valorActual + 1;
        if (modalDrinks) {
            updateTotalPrice();
        } else {
            updateTotalPriceDessert()
        }
    });

    // Función para disminuir
    btnMenos.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        if (valorActual > 1) { // Evita que baje de 1
            inputCantidad.value = valorActual - 1;
            if (modalDrinks) {
                updateTotalPrice();
            } else {
                updateTotalPriceDessert()
            }
        }
    });
});

const modalPostres = document.getElementById('modalPostres');
if (modalPostres) {
    modalPostres.addEventListener('show.bs.modal', (event) => {
        const card = event.relatedTarget;
        if (!card || !card.classList.contains('product-card')) return;

        const product = JSON.parse(card.dataset.product);
        const productId = parseInt(product.id)
        const currentProduct = desserts.filter(dessert => dessert.id === productId)[0]

        basePrice = Number(currentProduct.priceBySize.slice);

        const modalImg = modalPostres.querySelector('#modalImg');
        const modalTitle = modalPostres.querySelector('#modalTitle');
        const modalPrice = modalPostres.querySelector('#modalPrice');
        const modalDescription = modalPostres.querySelector('#modalDescription');
        const modalBadge = modalPostres.querySelector('#modalBadge');
        const inputCantidad = modalPostres.querySelector('#input-cantidad');

        // This data comes from html data-product
        modalImg.src = product.image;
        modalImg.alt = product.name;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `$${product.price}`;
        modalDescription.textContent = product.description;

        if (product.badge) {
            modalBadge.textContent = `☆ ${product.badge}`;
            modalBadge.classList.remove('d-none');
        } else {
            modalBadge.classList.add('d-none');
        }

        inputCantidad.value = '1';
        renderDessertSizes(currentProduct)
        updateTotalPriceDessert();
    });
}

const modalDrinks = document.getElementById('modalDrinks');
if (modalDrinks) {
    modalDrinks.addEventListener('show.bs.modal', (event) => {
        // Determinate if we are working with products with or without coffee
        const dataset = document.querySelector("[data-category]").getAttribute('data-category')
        const typeOfProducts = dataset === 'with-coffee' ? drinksWithCoffee : drinksWithoutCoffee

        const card = event.relatedTarget;

        if (!card || !card.classList.contains('product-card')) return;

        const product = JSON.parse(card.dataset.product);
        const productId = parseInt(product.id)

        const currentProduct = typeOfProducts.filter(drink => drink.id === productId)[0]

        basePrice = Number(currentProduct.priceByTemperature.hot ? currentProduct.priceByTemperature.hot.ch : currentProduct.priceByTemperature.frappe.md);

        const modalImg = modalDrinks.querySelector('#modalImg');
        const modalTitle = modalDrinks.querySelector('#modalTitle');
        const modalPrice = modalDrinks.querySelector('#modalPrice');
        const modalDescription = modalDrinks.querySelector('#modalDescription');
        const modalBadge = modalDrinks.querySelector('#modalBadge');
        const inputCantidad = modalDrinks.querySelector('#input-cantidad');

        // This data comes from html data-product
        modalImg.src = product.image;
        modalImg.alt = product.name;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `$${product.price}`;
        modalDescription.textContent = product.description;

        if (product.badge) {
            modalBadge.textContent = `☆ ${product.badge}`;
            modalBadge.classList.remove('d-none');
        } else {
            modalBadge.classList.add('d-none');
        }


        inputCantidad.value = '1';
        renderTemperatures(currentProduct)
        updateTotalPrice();
    });
}

let basePrice = 0;

function updateTotalPriceDessert() {
    const inputCantidad = document.getElementById('input-cantidad');
    const modalTotalDinamico = document.getElementById('modal-total-dinamico');
    const mPrecio = document.getElementById('m-precio');
    const modalPrecio = document.getElementById('modalPrice');

    let milkPrice = 0
    let extrasPrice = 0
    let milkOptions = document.querySelector('input[name="milk"]')
    let extrasOptions = document.querySelector('input[name="extra"]')

    const sizePrice = Number(document.querySelector('input[name="size"]:checked').value)
    if (milkOptions && extrasOptions) {
        milkPrice = Number(document.querySelector('input[name="milk"]:checked').value)
        extrasPrice = Number(document.querySelector('input[name="extra"]:checked').value)
    }

    if (!inputCantidad || !modalTotalDinamico) return;

    if (mPrecio || modalPrecio) {
        basePrice = Number(sizePrice) || 0;
    }

    const cantidad = parseInt(inputCantidad.value) || 1;
    const total = (basePrice + milkPrice + extrasPrice) * cantidad;
    modalTotalDinamico.textContent = `$ ${total.toFixed(2)}`;
}

function updateTotalPrice() {
    const inputCantidad = document.getElementById('input-cantidad');
    const modalTotalDinamico = document.getElementById('modal-total-dinamico');
    const modalPrecio = document.getElementById('modalPrice');

    const sizePrice = Number(document.querySelector('input[name="size"]:checked').value)
    const milkPrice = Number(document.querySelector('input[name="milk"]:checked').value)
    const extrasPrice = Number(document.querySelector('input[name="extra"]:checked').value)

    if (!inputCantidad || !modalTotalDinamico) return;

    if (modalPrecio) {
        basePrice = Number(sizePrice) || 0;
    }

    const cantidad = parseInt(inputCantidad.value) || 1;
    const total = (basePrice + milkPrice + extrasPrice) * cantidad;
    modalTotalDinamico.textContent = `$ ${total.toFixed(2)}`;
}

function renderTemperatures(currentProduct) {
    const temperatureContainer = document.querySelector('#temperature-options')
    temperatureContainer.innerHTML = ''

    Object.keys(currentProduct.priceByTemperature).forEach((temperature, index) => {
        const temperatureData = currentProduct.priceByTemperature[temperature]

        const temperatureNames = {
            hot: 'Caliente',
            rocks: 'A las rocas',
            frappe: 'Frappé'
        }

        if (temperatureData !== null) {
            const isChecked = document.querySelector('input[name="temp"]:checked') ? '' : 'checked'
            const temperatureOptions = `
                <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="temp" id="${temperature}" ${isChecked}>
                    <label class="form-check-label" for="${temperature}">
                        ${temperatureNames[temperature]}
                    </label>
                </div>
            `
            temperatureContainer.innerHTML += temperatureOptions;
        }
    })
    const temperatures = document.querySelectorAll('input[name="temp"]')

    renderSizes(currentProduct, document.querySelector('input[name="temp"]:checked').getAttribute('id'))
    temperatures.forEach(temperature => {
        temperature.addEventListener('change', () => renderSizes(currentProduct, document.querySelector('input[name="temp"]:checked').getAttribute('id')))
    })
}

function renderSizes(currentProduct, selectedTemperature) {
    const sizeContainer = document.getElementById('size-options');
    sizeContainer.innerHTML = '';
    const sizes = currentProduct.priceByTemperature[selectedTemperature];

    if (sizes === null) {
        sizeContainer.innerHTML = '<p class="text-muted">No hay tamaños disponibles para esta temperatura</p>';
        return;
    }

    Object.keys(sizes).forEach((sizeKey, index) => {
        const price = sizes[sizeKey];
        const isChecked = index === 0 ? 'checked' : '';

        const sizeNames = {
            ch: 'Chico (14 oz.)',
            md: 'Mediano (16 oz.)',
            lg: 'Grande (20 oz.)'
        };
        const sizeHTML = `
        <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="size" id="${sizeKey}" value="${price}" ${isChecked}>
            <label class="form-check-label" for="${sizeKey}">
                ${sizeNames[sizeKey]} - $${price}
            </label>
        </div>
        `;

        sizeContainer.innerHTML += sizeHTML;
    });

    renderMilks()
    renderExtras()
    addOptionListeners()
    updateTotalPrice()
}

function renderMilks() {
    const milksContainer = document.getElementById('milks-container')
    milksContainer.innerHTML = '';

    milks.forEach((milk, index) => {
        const isChecked = index === 0 ? 'checked' : '';
        const milkHTML = `
        <div class="form-check mb-2">
            <input class="form-check-input" value="${milk.price}" type="radio" name="milk" id="${milk.name.toLowerCase()}" ${isChecked}>
            <label class="form-check-label" for="${milk.name}">
                ${milk.name} - $${milk.price}
            </label>
        </div>
        `;
        milksContainer.innerHTML += milkHTML
    })
}

function renderExtras() {
    const extrasContainer = document.getElementById('extras-container')
    extrasContainer.innerHTML = '';

    extras.forEach((extra, index) => {
        const isChecked = index === 0 ? 'checked' : '';
        const extrasHTML = `
        <div class="form-check mb-2">
            <input class="form-check-input" value="${extra.price}" type="radio" name="extra" id="${extra.name.toLowerCase()}" ${isChecked}>
            <label class="form-check-label" for="${extra.name}">
                ${extra.name} - $${extra.price}
            </label>
        </div>
        `;
        extrasContainer.innerHTML += extrasHTML
    })
}

function renderDessertSizes(currentProduct) {
    const sizeContainer = document.getElementById('size-options');
    sizeContainer.innerHTML = '';
    Object.keys(currentProduct.priceBySize).forEach((size, index) => {
        const price = currentProduct.priceBySize[size];
        const isChecked = index === 0 ? 'checked' : '';

        const sizeNames = {
            slice: 'Rebanada',
            full: 'Entero',
        };

        const sizeHTML = `
        <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="size" id="${size}" value="${price}" ${isChecked}>
            <label class="form-check-label" for="${size}">
                ${sizeNames[size]} - $${price}
            </label>
        </div>
        `;
        sizeContainer.innerHTML += sizeHTML;
    })
    const sizes = document.querySelectorAll('input[name="size"]')
    sizes.forEach(size => {
        size.addEventListener('change', () => updateTotalPriceDessert())
    })
}

function addOptionListeners() {
    const sizes = document.querySelectorAll('input[name="size"]')
    const milks = document.querySelectorAll('input[name="milk"]')
    const extras = document.querySelectorAll('input[name="extra"]')

    sizes.forEach(size => {
        size.addEventListener('change', () => updateTotalPrice())
    })
    milks.forEach(milk => {
        milk.addEventListener('change', () => updateTotalPrice())
    })
    extras.forEach(extra => {
        extra.addEventListener('change', () => updateTotalPrice())
    })
}

