const VALID_MXN_BILLS = [20, 50, 100, 200, 500, 1000];

document.addEventListener('DOMContentLoaded', () => {
  const listaFinal = document.getElementById('listaFinal');
  const totalFinal = document.getElementById('totalFinal');
  const subtotalFinal = document.getElementById('subtotalFinal');

  const datos = localStorage.getItem('carrito_final');
  let totalAcumulado = 0;

  if (datos) {
    const productos = JSON.parse(datos);

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

  setupDeliveryForm(totalAcumulado);
});

function setupDeliveryForm(orderTotal) {
  const deliveryForm = document.getElementById('deliveryForm');
  if (!deliveryForm) return;

  const nombreInput = document.getElementById('inputNombreDelivery');
  const telInput = document.getElementById('inputTelDelivery');
  const direccionInput = document.getElementById('inputDireccionDelivery');
  const refInput = document.getElementById('inputRefDelivery');
  const pagoExactoRadio = document.getElementById('pagoExacto');
  const pagoBilleteRadio = document.getElementById('pagoBillete');
  const montoInput = document.getElementById('inputMontoPago');
  const montoError = document.getElementById('montoPagoError');
  const modalExitoEl = document.getElementById('modalExito');

  const resetValidation = (input) => {
    if (!input) return;
    input.classList.remove('is-invalid');
  };

  const setInvalid = (input) => {
    if (!input) return;
    input.classList.add('is-invalid');
  };

  const toggleAmountInput = () => {
    const isBill = pagoBilleteRadio?.checked;
    montoInput.disabled = !isBill;

    if (!isBill) {
      montoInput.value = '';
      montoInput.classList.remove('is-invalid');
      montoInput.removeAttribute('required');
    } else {
      montoInput.setAttribute('required', 'required');
    }
  };

  const clearAmountError = () => {
    montoInput.classList.remove('is-invalid');
    if (montoError) {
      montoError.innerText = 'Ingresa un billete válido.';
    }
  };

  const phonePattern = /^(\+?52)?\d{10}$/;

  [nombreInput, telInput, direccionInput].forEach((input) => {
    input?.addEventListener('input', () => resetValidation(input));
  });

  montoInput?.addEventListener('input', clearAmountError);
  pagoExactoRadio?.addEventListener('change', toggleAmountInput);
  pagoBilleteRadio?.addEventListener('change', toggleAmountInput);

  toggleAmountInput();

  deliveryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let isValid = true;

    const nombre = nombreInput.value.trim();
    const telefonoRaw = telInput.value.replace(/[\s()-]/g, '');
    const direccion = direccionInput.value.trim();
    const referencias = refInput.value.trim();

    if (!nombre) {
      setInvalid(nombreInput);
      isValid = false;
    }

    if (!telefonoRaw || !phonePattern.test(telefonoRaw)) {
      setInvalid(telInput);
      isValid = false;
    }

    if (!direccion) {
      setInvalid(direccionInput);
      isValid = false;
    }

    let paymentType = 'exacto';
    let paymentAmount = Number(orderTotal.toFixed(2));

    if (pagoBilleteRadio?.checked) {
      paymentType = 'billete';
      const monto = Number(montoInput.value);

      if (!VALID_MXN_BILLS.includes(monto)) {
        setInvalid(montoInput);
        if (montoError) {
          montoError.innerText = 'Solo se aceptan billetes de $20, $50, $100, $200, $500 o $1000.';
        }
        isValid = false;
      } else if (monto < orderTotal) {
        setInvalid(montoInput);
        if (montoError) {
          montoError.innerText = 'El monto debe ser mayor o igual al total del pedido.';
        }
        isValid = false;
      } else {
        paymentAmount = monto;
      }
    }

    if (!isValid) return;

    const checkoutData = {
      orderType: 'domicilio',
      customer: {
        name: nombre,
        phone: telefonoRaw,
        address: direccion,
        references: referencias
      },
      payment: {
        type: paymentType,
        amount: paymentAmount,
        currency: 'MXN'
      },
      orderTotal: Number(orderTotal.toFixed(2)),
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('checkout_delivery_data', JSON.stringify(checkoutData));

    if (window.bootstrap?.Modal && modalExitoEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalExitoEl);
      modal.show();
      return;
    }

    alert('Pedido confirmado con éxito');
  });
}
