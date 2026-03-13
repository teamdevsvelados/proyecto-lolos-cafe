import { getFinalCart, saveCheckoutDeliveryData } from '../core/storage/cartStorage.js';
import { renderCheckoutSummary, renderEmptyCheckoutSummary } from '../ui/checkoutSummary.ui.js';
import { initPaymentInputUI } from '../ui/paymentInput.ui.js';
import { validateDeliveryForm } from '../validators/delivery.validator.js';

function setValidationState(input, isInvalid) {
  if (!input) return;
  input.classList.toggle('is-invalid', isInvalid);
}

export function initCheckoutDeliveryPage() {
  const summaryContainer = document.getElementById('listaFinal');
  const totalEl = document.getElementById('totalFinal');
  const modalSuccessEl = document.getElementById('modalExito');
  const deliveryForm = document.getElementById('deliveryForm');

  if (!summaryContainer || !totalEl || !deliveryForm) return;

  const finalCart = getFinalCart();

  if (!finalCart.length) {
    renderEmptyCheckoutSummary(summaryContainer, totalEl);
    return;
  }

  const orderTotal = renderCheckoutSummary({
    containerEl: summaryContainer,
    totalEl,
    products: finalCart
  });

  const nameInput = document.getElementById('inputNombreDelivery');
  const phoneInput = document.getElementById('inputTelDelivery');
  const addressInput = document.getElementById('inputDireccionDelivery');
  const referencesInput = document.getElementById('inputRefDelivery');
  const paymentExactRadio = document.getElementById('pagoExacto');
  const paymentOtherRadio = document.getElementById('pagoOtro');
  const paymentDetailInput = document.getElementById('inputDetallePago');
  const paymentMinimumEl = document.getElementById('detallePagoMinimo');
  const paymentErrorEl = document.getElementById('detallePagoError');
  const submitButton = deliveryForm.querySelector('button[type="submit"]');

  const paymentControls = initPaymentInputUI({
    orderTotal,
    paymentExactRadio,
    paymentOtherRadio,
    paymentDetailInput,
    paymentMinimumEl,
    paymentErrorEl,
    submitButton,
    setValidationState
  });

  [nameInput, phoneInput, addressInput].forEach((input) => {
    input?.addEventListener('input', () => setValidationState(input, false));
  });

  deliveryForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value || '';
    const address = addressInput?.value.trim() || '';
    const references = referencesInput?.value.trim() || '';

    const paymentType = paymentOtherRadio?.checked ? 'other' : 'exact';
    const enteredAmount = paymentControls?.getPaymentAmount() || 0;
    const paymentAmount = paymentType === 'other' ? enteredAmount : Number(orderTotal.toFixed(2));

    const validation = validateDeliveryForm({
      name,
      phone,
      address,
      payment: {
        type: paymentType,
        amount: paymentAmount,
        orderTotal
      }
    });

    setValidationState(nameInput, Boolean(validation.errors.name));
    setValidationState(phoneInput, Boolean(validation.errors.phone));
    setValidationState(addressInput, Boolean(validation.errors.address));
    setValidationState(paymentDetailInput, Boolean(validation.errors.paymentAmount));

    if (paymentErrorEl && validation.errors.paymentAmount) {
      paymentErrorEl.innerText = validation.errors.paymentAmount;
    }

    if (!validation.ok || (paymentType === 'other' && !paymentControls?.isPaymentAmountValid())) {
      return;
    }

    const finalPaymentAmount = Number(paymentAmount.toFixed(2));

    const checkoutData = {
      orderType: 'delivery',
      customer: {
        name,
        phone: validation.normalizedData.phone,
        address,
        references
      },
      payment: {
        type: paymentType,
        detail: paymentType === 'other'
          ? `Monto con el que paga: $${finalPaymentAmount.toFixed(2)}`
          : 'Pago exacto',
        amount: finalPaymentAmount,
        currency: 'MXN'
      },
      orderTotal: Number(orderTotal.toFixed(2)),
      createdAt: new Date().toISOString()
    };

    saveCheckoutDeliveryData(checkoutData);

    if (window.bootstrap?.Modal && modalSuccessEl) {
      const modal = window.bootstrap.Modal.getOrCreateInstance(modalSuccessEl);
      modal.show();
      return;
    }

    alert('Pedido confirmado con éxito');
  });
}
