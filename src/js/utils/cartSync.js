// Sync cart counter and modal functionality across all pages
function updateCartCounterGlobal() {
    const cartData = localStorage.getItem('carrito_temporal');
    const cart = cartData ? JSON.parse(cartData) : [];
    const cartCountEl = document.getElementById('cartCount');
    
    if (cartCountEl) {
        cartCountEl.innerText = cart.length;
    }
}

// Render cart items in the modal
function renderCartModal() {
    const cartData = localStorage.getItem('carrito_temporal');
    const cart = cartData ? JSON.parse(cartData) : [];
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
                        <div class="small text-muted">${detalles.length ? detalles.join(' · ') : 'Porción'} · x${item.cantidad}</div>
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
}

// Open cart modal when clicking the cart button
function attachCartButtonListener() {
    const btnOpenCart = document.getElementById('btnOpenCart');
    if (btnOpenCart) {
        btnOpenCart.addEventListener('click', (e) => {
            e.preventDefault();
            const modalCarritoEl = document.getElementById('modalCarrito');
            if (modalCarritoEl) {
                renderCartModal();
                bootstrap.Modal.getOrCreateInstance(modalCarritoEl).show();
            }
        });
    }
}

// Listen for modal show event to render cart
function attachModalShowListener() {
    const modalCarrito = document.getElementById('modalCarrito');
    if (modalCarrito) {
        modalCarrito.addEventListener('show.bs.modal', () => {
            renderCartModal();
        });
    }
}

// Update counter when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounterGlobal();
    setTimeout(() => {
        attachCartButtonListener();
        attachModalShowListener();
    }, 500);
});

// Also update when localStorage changes (e.g., in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito_temporal') {
        updateCartCounterGlobal();
    }
});

// Event delegation for delete buttons and finalize button
document.addEventListener('click', (e) => {
    // Handle remove button click
    const removeBtn = e.target.closest('[data-remove-index]');
    if (removeBtn) {
        e.preventDefault();
        const cartData = localStorage.getItem('carrito_temporal');
        const cart = cartData ? JSON.parse(cartData) : [];
        const idx = Number(removeBtn.getAttribute('data-remove-index'));
        if (!Number.isNaN(idx)) {
            cart.splice(idx, 1);
            localStorage.setItem('carrito_temporal', JSON.stringify(cart));
            updateCartCounterGlobal();
            renderCartModal();
        }
        return;
    }

    // Handle finalize button click
    const finalizeBtn = e.target.closest('#btnFinalizarPedido');
    if (finalizeBtn) {
        e.preventDefault();
        
        const cartData = localStorage.getItem('carrito_temporal');
        const cart = cartData ? JSON.parse(cartData) : [];
        
        if (cart.length === 0) {
            alert("Agrega al menos un producto para continuar.");
            return;
        }
        
        // Save cart as final and clear temporary cart
        localStorage.setItem('carrito_final', JSON.stringify(cart));
        localStorage.removeItem('carrito_temporal');
        updateCartCounterGlobal();
        
        // Redirect to delivery method
        window.location.href = '/menu/delivery-method.html';
    }
});

// Retry if header not loaded yet
setTimeout(() => {
    updateCartCounterGlobal();
    attachCartButtonListener();
    attachModalShowListener();
}, 500);

