import { desserts, drinksWithCoffee, drinksWithoutCoffee } from "../db/db.js";

function renderMenu() {
    let products
    const typeOfProducts = document.querySelector("[data-category]").getAttribute('data-category')

    if (typeOfProducts === "with-coffee" ) {
        products = drinksWithCoffee
    } else if (typeOfProducts === "without-coffee") {
        products = drinksWithoutCoffee
    } else {
        products = desserts
    }

    const contenedor = document.getElementById('products-container');

    if( typeOfProducts === "with-coffee" || typeOfProducts === "without-coffee" ) {
        contenedor.innerHTML = ''; 
        products.forEach(product => {
            const card = `
                <div class="col-6 col-md-4 col-lg-3 mb-4 drink">
                    <div class="card h-100 product-card"
                        data-product='{
                        "id": "${product.id}",
                        "name": "${product.name}",
                        "price": "${product.priceByTemperature.hot ? product.priceByTemperature.hot.ch : product.priceByTemperature.frappe.md}",
                        "description": "${product.description}",
                        "image": "${product.image}",
                        "badge": "${product.badge}"
                        }'
                        data-bs-toggle="modal" 
                        data-bs-target="#modalDrinks">
                        
                        <div class="p-2 text-end">
                            ${product.badge ? `<span class="badge bg-light text-dark fw-light">${product.badge}</span>` : ''}
                        </div>
                        
                        <div class="img-container">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        </div>
                        
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title mb-0 fw-bold">${product.name}</h6>
                                <span class="price fw-bold">$${ Number(product.priceByTemperature.hot?.ch || product.priceByTemperature.frappe?.md || product.priceByTemperature.frappe?.lg).toFixed(2)}</span>
                            </div>
                            <p class="card-text text-muted small">${product.description}</p>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += card;
        });
    } else {
        contenedor.innerHTML = ''; 
        products.forEach(product => {
            const card = `
                <div class="col-6 col-md-4 col-lg-3 mb-4 dessert">
                    <div class="card h-100 product-card"
                        data-product='{
                        "id": "${product.id}",
                        "name": "${product.name}",
                        "price": "${product.priceBySize.slice}",
                        "description": "${product.description}",
                        "image": "${product.image}",
                        "badge": "${product.badge}"
                        }'
                        data-bs-toggle="modal"
                        data-bs-target="#modalPostres">
                        <div class="p-2 text-end">
                            ${product.badge ? `<span class="badge bg-light text-dark fw-light">${product.badge}</span>` : ''}
                        </div>
                        
                        <div class="img-container">
                            <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        </div>
                        
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title mb-0 fw-bold">${product.name}</h6>
                                <span class="price fw-bold">$${ Number(product.priceBySize.slice).toFixed(2)}</span>
                            </div>
                            <p class="card-text text-muted small">${product.description}</p>
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += card;
        });
    }
}

renderMenu()