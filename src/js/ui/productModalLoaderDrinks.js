const modal = document.getElementById('modalDrinks');
let basePrice = 0;

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
  const cartTotalEl = modal.querySelector('#cartTotal');
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

function updateModalTotal() {
  const inputCantidad = modal.querySelector('#input-cantidad');
  const cartTotalEl = modal.querySelector('#cartTotal');
  const cantidad = parseInt(inputCantidad.value) || 1;
  const total = basePrice * cantidad;
  cartTotalEl.textContent = `$ ${total.toFixed(2)}`;
}

const btnMas = modal.querySelector('#btn-mas');
const btnMenos = modal.querySelector('#btn-menos');

if (btnMas) btnMas.addEventListener('click', updateModalTotal);
if (btnMenos) btnMenos.addEventListener('click', updateModalTotal);

