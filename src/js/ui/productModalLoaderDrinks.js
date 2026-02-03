const modal = document.getElementById('modalDrinks');

modal.addEventListener('show.bs.modal', (event) => {
  // 👇 ESTE es el elemento que disparó el modal
  const card = event.relatedTarget;

  if (!card || !card.classList.contains('product-card')) return;

  const product = JSON.parse(card.dataset.product);

  const modalImg = modal.querySelector('#modalImg');
  const modalTitle = modal.querySelector('#modalTitle');
  const modalPrice = modal.querySelector('#modalPrice');
  const modalDescription = modal.querySelector('#modalDescription');
  const modalBadge = modal.querySelector('#modalBadge');
  const modalTotal = modal.querySelector('#modalTotal');
  const qtyValue = modal.querySelector('#qtyValue');

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

  qtyValue.textContent = '1';
  modalTotal.textContent = `Total: $${Number(product.price).toFixed(2)}`;
  modalTotal.dataset.basePrice = product.price;
});

