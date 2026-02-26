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
  const pagoOtroRadio = document.getElementById('pagoOtro');
  const detallePagoInput = document.getElementById('inputDetallePago');
  const detallePagoMinimo = document.getElementById('detallePagoMinimo');
  const detallePagoError = document.getElementById('detallePagoError');
  const submitButton = deliveryForm.querySelector('button[type="submit"]');
  const modalExitoEl = document.getElementById('modalExito');
  const orderTotalRounded = Number(orderTotal.toFixed(2));

  if (detallePagoMinimo) {
    detallePagoMinimo.innerText = `$${orderTotalRounded.toFixed(2)}`;
  }

  if (detallePagoInput) {
    detallePagoInput.min = orderTotalRounded.toFixed(2);
  }

  const resetValidation = (input) => {
    if (!input) return;
    input.classList.remove('is-invalid');
  };

  const setInvalid = (input) => {
    if (!input) return;
    input.classList.add('is-invalid');
  };

  const getPaymentAmount = () => Number.parseFloat(detallePagoInput.value);

  const isPaymentAmountValid = () => {
    const amount = getPaymentAmount();
    return Number.isFinite(amount) && amount >= orderTotalRounded;
  };

  const syncSubmitButtonState = () => {
    if (!submitButton) return;
    submitButton.disabled = pagoOtroRadio?.checked ? !isPaymentAmountValid() : false;
  };

  const togglePaymentDetailInput = () => {
    const isOtherPayment = pagoOtroRadio?.checked;
    detallePagoInput.disabled = !isOtherPayment;

    if (!isOtherPayment) {
      detallePagoInput.value = '';
      detallePagoInput.classList.remove('is-invalid');
      detallePagoInput.removeAttribute('required');
      if (detallePagoError) {
        detallePagoError.innerText = 'Ingresa un monto válido.';
      }
    } else {
      detallePagoInput.setAttribute('required', 'required');
    }

    syncSubmitButtonState();
  };

  const validatePaymentDetailInput = () => {
    if (!pagoOtroRadio?.checked) {
      detallePagoInput.classList.remove('is-invalid');
      syncSubmitButtonState();
      return;
    }

    if (isPaymentAmountValid()) {
      detallePagoInput.classList.remove('is-invalid');
      if (detallePagoError) {
        detallePagoError.innerText = 'Ingresa un monto válido.';
      }
    } else {
      detallePagoInput.classList.add('is-invalid');
      if (detallePagoError) {
        detallePagoError.innerText = 'El monto debe ser mayor o igual al total del pedido.';
      }
    }

    syncSubmitButtonState();
  };

  const phonePattern = /^(\+?52)?\d{10}$/;

  [nombreInput, telInput, direccionInput].forEach((input) => {
    input?.addEventListener('input', () => resetValidation(input));
  });

  detallePagoInput?.addEventListener('input', validatePaymentDetailInput);
  pagoExactoRadio?.addEventListener('change', () => {
    togglePaymentDetailInput();
    validatePaymentDetailInput();
  });
  pagoOtroRadio?.addEventListener('change', () => {
    togglePaymentDetailInput();
    validatePaymentDetailInput();
  });

  togglePaymentDetailInput();
  validatePaymentDetailInput();

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
    let paymentDetail = 'Pago exacto';
    let paymentAmount = orderTotalRounded;

    if (pagoOtroRadio?.checked) {
      paymentType = 'otro';
      const pagoDetalle = getPaymentAmount();

      if (!isPaymentAmountValid()) {
        setInvalid(detallePagoInput);
        if (detallePagoError) {
          detallePagoError.innerText = 'El monto debe ser mayor o igual al total del pedido.';
        }
        isValid = false;
      } else {
        paymentDetail = `Monto con el que paga: $${pagoDetalle.toFixed(2)}`;
        paymentAmount = Number(pagoDetalle.toFixed(2));
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
        detail: paymentDetail,
        amount: paymentAmount,
        currency: 'MXN'
      },
      orderTotal: orderTotalRounded,
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
