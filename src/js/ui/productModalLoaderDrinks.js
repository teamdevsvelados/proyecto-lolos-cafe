const modal = document.getElementById('modalDrinks');
let basePrice = 0;

function updateModalTotal() {
  const inputCantidad = modal.querySelector('#input-cantidad');
  const cartTotalEl = modal.querySelector('#cartTotal') || modal.querySelector('#modal-total-dinamico');
  if (!inputCantidad || !cartTotalEl) return;
  
  const cantidad = parseInt(inputCantidad.value) || 1;
  const total = basePrice * cantidad;
  cartTotalEl.textContent = `$ ${total.toFixed(2)}`;
}

modal.addEventListener('show.bs.modal', (event) => {
  const card = event.relatedTarget;

  if (!card || !card.classList.contains('product-card')) return;

  const product = JSON.parse(card.dataset.product);
  basePrice = Number(product.price);

  const modalImg = modal.querySelector('#modalImg');
  const modalTitle = modal.querySelector('#modalTitle');
  const modalPrice = modal.querySelector('#modalPrice');
  const modalDescription = modal.querySelector('#modalDescription');
  const modalBadge = modal.querySelector('#modalBadge');
  const cartTotalEl = modal.querySelector('#cartTotal') || modal.querySelector('#modal-total-dinamico');
  const inputCantidad = modal.querySelector('#input-cantidad');

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
  updateModalTotal();
});

// Use event delegation for quantity buttons
modal.addEventListener('click', (e) => {
  if (e.target.closest('#btn-mas') || e.target.closest('#btn-menos')) {
    setTimeout(updateModalTotal, 10);
  }
});

