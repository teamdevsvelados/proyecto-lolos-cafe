function getStringDetail(value) {
  if (typeof value !== 'string') return '';
  const trimmedValue = value.trim();
  if (!trimmedValue || trimmedValue === 'Sin extras') return '';
  return trimmedValue;
}

function getProductDetails(item) {
  return [
    getStringDetail(item.size),
    getStringDetail(item.temperatura),
    getStringDetail(item.leche),
    getStringDetail(item.extra)
  ].filter(Boolean);
}

function getProductQuantity(item) {
  const quantity = Number(item.cantidad);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function getProductPrice(item) {
  const price = Number(item.precio);
  return Number.isFinite(price) && price >= 0 ? price : 0;
}

export function renderCheckoutSummary({ containerEl, totalEl, products }) {
  if (!containerEl || !totalEl) return 0;

  containerEl.innerHTML = '';

  let orderTotal = 0;

  products.forEach((item) => {
    const itemPrice = getProductPrice(item);
    const itemQuantity = getProductQuantity(item);
    const itemSubtotal = itemPrice * itemQuantity;
    const details = getProductDetails(item);

    orderTotal += itemSubtotal;

    containerEl.innerHTML += `
      <div class="d-flex align-items-center justify-content-between py-3 border-bottom">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.imagen}" alt="${item.nombre}"
            style="width: 70px; height: 70px; object-fit: contain;"
            class="rounded bg-light">

          <div>
            <h6 class="mb-0 fw-bold">${item.nombre}</h6>

            <small class="text-muted">
              ${details.length ? details.join(' · ') : 'Porción'} · Cantidad: ${itemQuantity}
            </small>

            ${item.notas ? `<p class="mb-0 small text-muted fst-italic">Nota: ${item.notas}</p>` : ''}
          </div>
        </div>

        <div class="text-end">
          <span class="fw-bold">$${itemSubtotal.toFixed(2)}</span>
        </div>
      </div>
    `;
  });

  totalEl.innerText = `$${orderTotal.toFixed(2)}`;
  return orderTotal;
}

export function renderEmptyCheckoutSummary(containerEl, totalEl) {
  if (!containerEl || !totalEl) return;

  containerEl.innerHTML = `
    <div class="text-center py-5">
      <i class="bi bi-cart-x fs-1 text-muted"></i>
      <p class="mt-2">No encontramos productos en tu orden.</p>
      <a href="/UI/menu.html" class="btn btn-outline-dark btn-sm">Volver al menú</a>
    </div>
  `;

  totalEl.innerText = '$0.00';
}
