/* This script manages a client-side shopping cart. It allows adding products 
from a modal, merging duplicates by increasing quantity, rendering cart items, 
calculating subtotals and the total amount, updating the cart counter, 
removing items, and opening/closing Bootstrap modals using event delegation.
 */
export const cart = [];

function safeText(el) {
    return el ? el.innerText.trim() : '';
}

function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.innerText = cart.length;
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems || !cartTotal) return;


    cartItems.innerHTML = '';
    let totalGeneral = 0;

    cart.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        totalGeneral += subtotal;
    
    
    const detalles = [
  item.size,
  item.temperatura,
  item.leche,
  item.extra
].filter(v => v && v.trim() !== '' && v !== 'Sin extras');

        cartItems.innerHTML += `
        <div class="d-flex align-items-center gap-3 border-bottom pb-3">
            <img src="${item.imagen}" alt="${item.nombre}" style="width: 65px; height: 65px; object-fit: contain;" class="bg-light rounded">
            
            <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                <strong class="d-block">${item.nombre}</strong>
                <div class="small text-muted">${detalles.length ? detalles.join(' · ') : 'Porción'} · x${item.cantidad}     </div>

                ${item.notas ? `<div class="small text-info mt-1 italic">"${item.notas}"</div>` : ''}
                </div>
                <button class="btn btn-sm text-danger p-0" data-remove-index="${index}">
                <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="fw-bold mt-1">$${subtotal.toFixed(2)}</div>
            </div>
        </div>
        `;
    });

    cartTotal.innerText = `$${totalGeneral.toFixed(2)}`;
    updateCartCount();
}

/* ======= Event delegation para abrir carrito y remover ======= */
document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('#btnOpenCart');
    if (openBtn) {
        e.preventDefault();
        const modalCarritoEl = document.getElementById('modalCarrito');
        if (modalCarritoEl) bootstrap.Modal.getOrCreateInstance(modalCarritoEl).show();
        return;
    }

    const removeBtn = e.target.closest('[data-remove-index]');
    if (removeBtn) {
        const idx = Number(removeBtn.getAttribute('data-remove-index'));
        if (!Number.isNaN(idx)) {
            cart.splice(idx, 1);
            renderCart();
        }
    }
});

/* ======= Agregar producto desde modalPostres ======= */
document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('#btnAgregarCarrito');
    if (!addBtn) return;

    e.preventDefault();

    const modal = addBtn.closest('.modal');
    

    // Recolecta datos usando los IDs que pusimos anteriormente
    const nombre = safeText(modal.querySelector('#m-nombre, #modalTitle')) || 'Producto';
    const precioText = safeText(modal.querySelector('#m-precio, #modalPrice')) || '$0.00';
    const precio = Number(precioText.replace(/[^0-9.]/g, '')) || 0;


    // CAPTURA DE IMAGEN Y CANTIDAD
    const imagen = modal.querySelector('#m-imagen, #modalImg')?.src || '';

    const cantidad = parseInt(modal.querySelector('#input-cantidad')?.value) || 1;



    // Captura la presentación (Rebanada/Entero)
    const sizeLabel = modal.querySelector('input[name="size"]:checked')
        ?.nextElementSibling?.innerText || '';


    const notas =     modal.querySelector('textarea')?.value || '';
    
    const temperatura = modal.querySelector('input[name="temp"]:checked')
  ?.nextElementSibling?.innerText || null;

const leche = modal.querySelector('input[name="milk"]:checked')
  ?.nextElementSibling?.innerText || null;

const extra = modal.querySelector('input[name="extra"]:checked')
  ?.nextElementSibling?.innerText || null;




    const producto = {
        nombre,
  precio,
  imagen,
  cantidad,
  size: sizeLabel,
  temperatura,
  leche,
  extra,
  notas

    };

    const existente = cart.find(item =>
    item.nombre === producto.nombre &&
  item.size === producto.size &&
  item.temperatura === producto.temperatura &&
  item.leche === producto.leche &&
  item.extra === producto.extra &&
  item.notas === producto.notas
);

if (existente) {
    existente.cantidad += producto.cantidad;
} else {
    cart.push(producto);
}


    renderCart();

    // Cerrar modal y abrir carrito
    bootstrap.Modal.getOrCreateInstance(modal).hide();


    const modalCarritoEl = document.getElementById('modalCarrito');
    if (modalCarritoEl) bootstrap.Modal.getOrCreateInstance(modalCarritoEl).show();
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});