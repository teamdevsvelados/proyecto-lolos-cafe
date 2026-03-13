//new version to match the new db model
import { drinks, desserts } from "../db/db.js";

function getProductsByCategory(type) {

    if (type === "with-coffee") {
        return drinks.filter(d => d.category === "coffee");
    }

    if (type === "without-coffee") {
        return drinks.filter(d => d.category === "no-coffee");
    }

    return desserts;
}

function getBasePrice(product) {
    const firstSize = product.sizes[0];
    return product.priceBySize[firstSize];
}

function renderMenu() {

    const category = document.querySelector("[data-category]").getAttribute("data-category");
    const products = getProductsByCategory(category);

    const container = document.getElementById("products-container");
    container.innerHTML = "";

    products.forEach(product => {

        const price = getBasePrice(product);

        const modalTarget =
            product.category === "dessert"
                ? "#modalPostres"
                : "#modalDrinks";

        const card = `
        <div class="col-6 col-md-4 col-lg-3 mb-4 product">
            <div class="card h-100 product-card"
                data-product='${JSON.stringify(product)}'
                data-bs-toggle="modal"
                data-bs-target="${modalTarget}">

                <div class="p-2 text-end">
                    ${product.badge ? `<span class="badge bg-light text-dark fw-light">${product.badge}</span>` : ""}
                </div>

                <div class="img-container">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                </div>

                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title mb-0 fw-bold">${product.name}</h6>
                        <span class="price fw-bold">$${price.toFixed(2)}</span>
                    </div>

                    <p class="card-text text-muted small">${product.description}</p>
                </div>
            </div>
        </div>
        `;

        container.innerHTML += card;
    });
}

renderMenu();