// js/admin/main.js - Punto de entrada principal para admin/productos
import { ProductsController } from "../controllers/productController.js";
import { handleFormSubmit as handleServiceSubmit } from "../services/productService.js";
import { initAdminUI, setupCategoryButtons, resetForm, loadProductForEditing, updateModalButton, getActiveCategory  } from "../ui/adminUI.js";

let editingProductId = null;
let controller = null;
let modal = null;

// Inicializar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    initAdmin();
});

async function initAdmin() {
    try {
        controller = new ProductsController();
        controller.loadFromStorage();
        
        const modalEl = document.getElementById("modal-drink");
        if (!modalEl) return;
        modal = new bootstrap.Modal(modalEl);
        
        // ✅ Esto ya configura todo el UI
        await initAdminUI();
        
        setupEventListeners();
        loadInitialProducts();
        
        console.log("Admin panel inicializado correctamente");
    } catch (error) {
        console.error("Error al inicializar admin:", error);
    }
}


async function onFormSubmit(e) {
    e.preventDefault();

    const result = await handleServiceSubmit(
        controller,
        editingProductId,
        null //no render aquí
    );

    // if (result?.success) {
    //     editingProductId = null;
    //     modal?.hide();
    //     resetForm();
    //     updateModalButton();

    //     const activeCategory = getActiveCategory(); //render
    //     filterProductsByCategory(activeCategory);
    // }

    if (result?.success) {
        editingProductId = null;
        modal.hide();
        resetForm();

        updateModalButton(null, onFormSubmit);

        const activeCategory = getActiveCategory();
        filterProductsByCategory(activeCategory);
    }
}

function setupEventListeners() {
    // Formulario de producto
    const form = document.getElementById("product-form");
    if (form) {
        // form.addEventListener("submit", handleFormSubmit);
        form.addEventListener("submit", onFormSubmit);
    }
    
    // Botón Agregar +
    const addNewBtn = document.querySelector('button[data-bs-target="#modal-drink"]');
    if (addNewBtn) {
        addNewBtn.addEventListener("click", () => {
            editingProductId = null;
            resetForm();

            updateModalButton(
                null,
                onFormSubmit
            );
        });
    }
    
    // Configurar botones de categoría
    const container = document.querySelector(".row.g-4");
    if (container) {
        setupCategoryButtons(container, controller, filterProductsByCategory);
    }
}


function loadInitialProducts() {
    const container = document.querySelector(".row.g-4");
    if (!container) return;
    
    // Activar categoría POSTRES por defecto
    const postresBtn = [...document.querySelectorAll('.top-buttons .btn')]
    .find(btn => btn.textContent.trim().toUpperCase() === 'POSTRES') || 
    Array.from(document.querySelectorAll('.top-buttons .btn')).find(btn => btn.textContent.includes('POSTRES'));
    
    if (postresBtn) {
        postresBtn.click();
    } else {
        // Si no encuentra el botón, renderizar todos los productos
        renderAllProducts();
    }
}

function renderAllProducts() {
    const container = document.querySelector(".row.g-4");
    if (!container || !controller) return;
    
    container.innerHTML = "";
    
    if (controller.products.length === 0) {
        showEmptyState('esta sección', container);
    } else {
        controller.products.forEach(product => renderProductCard(product, container));
    }
}

function renderProductCard(product, container) {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-4 col-md-3 mb-4";
    
    const card = document.createElement("div");
    card.className = "card h-100";
    card.style.cursor = "pointer";
    
    if (!product.isActive) {
        card.style.opacity = "0.6";
    }
    
    // Badge
    if (product.isPromo) {
        const promoBadge = document.createElement("p");
        promoBadge.className = "new-drink col-12 text-center pt-1 pb-0 bg-warning text-dark";
        promoBadge.textContent = "PROMO";
        card.appendChild(promoBadge);
    }
    
    // Imagen
    const imgContainer = document.createElement("div");
    imgContainer.className = "position-relative";
    
    if (product.image) {
        const img = document.createElement("img");
        img.src = product.image;
        img.className = "card-img-top";
        img.alt = product.title;
        img.style.height = "180px";
        img.style.objectFit = "cover";
        imgContainer.appendChild(img);
    } else {
        const placeholder = document.createElement("div");
        placeholder.className = "card-img-top d-flex align-items-center justify-content-center";
        placeholder.style.height = "180px";
        placeholder.style.backgroundColor = product.type === 'drink' ? "#f8f9fa" : "#fff3cd";
        
        const icon = document.createElement("i");
        icon.className = product.type === 'drink' ? "bi bi-cup-straw fs-1 text-muted" : "bi bi-cake fs-1 text-muted";
        placeholder.appendChild(icon);
        imgContainer.appendChild(placeholder);
    }
    
    card.appendChild(imgContainer);
    
    // Cuerpo de la tarjeta
    const cardBody = document.createElement("div");
    cardBody.className = "card-body row";
    
    const title = document.createElement("p");
    title.className = "card-title col-6";
    title.textContent = product.title || "Sin nombre";
    
    const price = document.createElement("p");
    price.className = "price col-6 text-end";
    
    if (product.type === 'drink' && product.sizes && Object.values(product.sizes).length > 0) {
        const prices = Object.values(product.sizes);
        price.textContent = `$${Math.min(...prices).toFixed(2)}`;
    } else if (product.type === 'dessert') {
        price.textContent = product.slicePrice && product.slicePrice > 0 
            ? `Desde $${(product.price || 0).toFixed(2)}`
            : `$${(product.price || 0).toFixed(2)}`;
    } else {
        price.textContent = "$0.00";
    }
    
    const description = document.createElement("p");
    description.className = "card-text";
    description.textContent = product.description || "Sin descripción";
    
    cardBody.appendChild(title);
    cardBody.appendChild(price);
    cardBody.appendChild(description);
    card.appendChild(cardBody);
    
    // Botones de acción
    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer card-actions p-2";
    
    const btnGroup = document.createElement("div");
    btnGroup.className = "d-flex justify-content-between";
    
    // Botón Editar
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-primary";
    editBtn.textContent = "Editar";
    // editBtn.addEventListener("click", (e) => {
    //     e.stopPropagation();
    //     editingProductId = product.id;
    //     loadProductForEditing(product, modal);
    // });

    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        editingProductId = product.id;
        loadProductForEditing(product, modal);
        
        updateModalButton(
            editingProductId,
            onFormSubmit,
            () => {
                editingProductId = null;
                modal.hide();
                resetForm();
                updateModalButton(null, onFormSubmit);
            }
        );
    });

    
    // Botón Activar/Desactivar
    const toggleBtn = document.createElement("button");
    toggleBtn.className = product.isActive ? "btn btn-sm btn-outline-warning" : "btn btn-sm btn-outline-success";
    toggleBtn.textContent = product.isActive ? "Desactivar" : "Activar";
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const newState = controller.toggleActive(product.id);
        if (newState !== null) {
            card.style.opacity = newState ? "1" : "0.6";
            toggleBtn.textContent = newState ? "Desactivar" : "Activar";
            toggleBtn.className = newState ? "btn btn-sm btn-outline-warning" : "btn btn-sm btn-outline-success";
        }
    });
    
    // Botón Eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`¿Eliminar "${product.title}"? Esta acción no se puede deshacer.`)) {
            controller.deleteProduct(product.id);
            const activeCategory = getActiveCategory();
            filterProductsByCategory(activeCategory);
        }
    });
    
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(toggleBtn);
    btnGroup.appendChild(deleteBtn);
    cardFooter.appendChild(btnGroup);
    card.appendChild(cardFooter);
    
    // Click en la tarjeta
    card.addEventListener("click", (e) => {
        if (!e.target.closest('button')) {
            editingProductId = product.id;
            loadProductForEditing(product, modal);
        }
    });
    
    col.appendChild(card);
    container.appendChild(col);
}

function filterProductsByCategory(categoryName) {
    const container = document.querySelector(".row.g-4");
    if (!container || !controller) return;
    
    container.innerHTML = "";
    
    const categoryMap = {
        'CON CAFÉ': 'Con café',
        'SIN CAFÉ': 'Sin café', 
        'POSTRES': 'Postres',
        'EXTRAS': 'Extras',
        'PROMOCIONES': 'Promociones'
    };
    
    const filterValue = categoryMap[categoryName] || categoryName;
    
    const filteredProducts = controller.products.filter(product => {
        if (product.type === 'drink') {
            return product.section === filterValue;
        } else if (product.type === 'dessert') {
            return product.category === filterValue;
        }
        return false;
    });
    
    if (filteredProducts.length === 0) {
        showEmptyState(filterValue, container);
    } else {
        filteredProducts.forEach(product => renderProductCard(product, container));
    }
}

function showEmptyState(category, container) {
    const emptyCol = document.createElement('div');
    emptyCol.className = 'col-12 text-center py-5';
    emptyCol.innerHTML = `
        <div class="mb-3">
            <i class="bi bi-emoji-frown fs-1 text-muted"></i>
        </div>
        <h5 class="text-muted mb-2">No hay productos en ${category}</h5>
        <p class="text-muted">Haz clic en "AGREGAR +" para agregar un nuevo producto</p>
    `;
    container.appendChild(emptyCol);
}

// function getActiveCategory() {
//     const activeButton = document.querySelector('.top-buttons .btn.active');
//     return activeButton ? activeButton.textContent.trim() : 'POSTRES';
// }

// function updateModalButton() {
//     const modalFooter = document.querySelector('.modal .row.m-4');
//     if (!modalFooter) return;
    
//     const buttonContainer = modalFooter.querySelector('.d-flex');
//     if (!buttonContainer) return;
    
//     buttonContainer.innerHTML = '';
    
//     const form = document.getElementById("product-form");
    
//     if (editingProductId) {
//         // Botón Actualizar
//         const updateBtn = document.createElement('button');
//         updateBtn.className = 'btn btn-primary px-4';
//         updateBtn.type = 'button';
//         updateBtn.textContent = 'Actualizar producto';
//         updateBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             // handleFormSubmit(e);
//             onFormSubmit(e);
//         });

        
//         // Botón Cancelar
//         const cancelBtn = document.createElement('button');
//         cancelBtn.className = 'btn btn-outline-secondary px-4 ms-2';
//         cancelBtn.type = 'button';
//         cancelBtn.textContent = 'Cancelar';
//         cancelBtn.addEventListener('click', () => {
//             editingProductId = null;
//             if (modal) modal.hide();
//             resetForm();
//             updateModalButton();
//         });
        
//         buttonContainer.appendChild(updateBtn);
//         buttonContainer.appendChild(cancelBtn);
//     } else {
//         // Botón Agregar
//         const addBtn = document.createElement('button');
//         addBtn.className = 'btn btn-dark px-4';
//         addBtn.type = 'button';
//         addBtn.textContent = 'Agregar producto';
//         addBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             // handleFormSubmit(e);
//             onFormSubmit(e);
//         });

        
//         buttonContainer.appendChild(addBtn);
//     }
// }

// Hacer disponible globalmente para debugging
window.adminModule = {
    initAdmin,
    controller,
    filterProductsByCategory,
    getActiveCategory
};