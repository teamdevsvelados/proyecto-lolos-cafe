document.addEventListener('DOMContentLoaded', () => {
  const listaFinal = document.getElementById('listaFinal');
  const totalFinal = document.getElementById('totalFinal');
  const subtotalFinal = document.getElementById('subtotalFinal');

  const datos = localStorage.getItem('carrito_final');

  if (datos) {
    const productos = JSON.parse(datos);
    let totalAcumulado = 0;

    listaFinal.innerHTML = '';

    productos.forEach(item => {
      const subtotalItem = item.precio * item.cantidad;
      totalAcumulado += subtotalItem;

      const detalles = [
        item.size,
        item.temperatura,
        item.leche,
        item.extra
      ].filter(v => v && v.trim() !== '' && v !== 'Sin extras');

      listaFinal.innerHTML += `
        <div class="d-flex align-items-center justify-content-between py-3 border-bottom">
          <div class="d-flex align-items-center gap-3">
            <img src="${item.imagen}" alt="${item.nombre}"
              style="width: 70px; height: 70px; object-fit: contain;"
              class="rounded bg-light">

            <div>
              <h6 class="mb-0 fw-bold">${item.nombre}</h6>

              <small class="text-muted">
                ${detalles.length ? detalles.join(' · ') : 'Porción'} · x${item.cantidad}
              </small>

              ${item.notas ? `<p class="mb-0 small text-muted fst-italic">Nota: ${item.notas}</p>` : ''}
            </div>
          </div>

          <div class="text-end">
            <span class="fw-bold">$${subtotalItem.toFixed(2)}</span>
          </div>
        </div>
      `;
    });

    subtotalFinal.innerText = `$${totalAcumulado.toFixed(2)}`;
    totalFinal.innerText = `$${totalAcumulado.toFixed(2)}`;

  } else {
    listaFinal.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-cart-x fs-1 text-muted"></i>
        <p class="mt-2">No encontramos productos en tu orden.</p>
        <a href="index.html" class="btn btn-outline-dark btn-sm">Volver al menú</a>
      </div>
    `;
  }
});

function procesarPago() {
  alert("¡Pedido procesado con éxito!");
  // localStorage.removeItem('carrito_final');
}
