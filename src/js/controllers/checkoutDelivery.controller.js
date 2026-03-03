import { getFinalCart, saveCheckoutDeliveryData } from '../services/cartStorage.service.js';
import { renderCheckoutSummary, renderEmptyCheckoutSummary } from '../ui/checkoutSummary.ui.js';
import { validateDeliveryForm } from '../validators/delivery.validator.js';

function setValidationState(input, isInvalid) {
  if (!input) return;
  input.classList.toggle('is-invalid', isInvalid);
}

function setupPaymentInput({
  orderTotal,
  paymentExactRadio,
  paymentOtherRadio,
  paymentDetailInput,
  paymentMinimumEl,
  paymentErrorEl,
  submitButton
}) {
  const orderTotalRounded = Number(orderTotal.toFixed(2));

  if (paymentMinimumEl) {
    paymentMinimumEl.innerText = `$${orderTotalRounded.toFixed(2)}`;
  }

  if (paymentDetailInput) {
    paymentDetailInput.min = orderTotalRounded.toFixed(2);
  }

  const getPaymentAmount = () => Number.parseFloat(paymentDetailInput?.value || '');

  const isPaymentAmountValid = () => {
    const amount = getPaymentAmount();
    return Number.isFinite(amount) && amount >= orderTotalRounded;
  };

  const syncSubmitButtonState = () => {
    if (!submitButton) return;
    submitButton.disabled = paymentOtherRadio?.checked ? !isPaymentAmountValid() : false;
  };

  const togglePaymentInput = () => {
    const usesOtherAmount = Boolean(paymentOtherRadio?.checked);
    if (!paymentDetailInput) return;

    paymentDetailInput.disabled = !usesOtherAmount;

    if (!usesOtherAmount) {
      paymentDetailInput.value = '';
      setValidationState(paymentDetailInput, false);
      paymentDetailInput.removeAttribute('required');
      if (paymentErrorEl) {
        paymentErrorEl.innerText = 'Ingresa un monto válido.';
      }
    } else {
      paymentDetailInput.setAttribute('required', 'required');
    }

    syncSubmitButtonState();
  };

  const validatePaymentInput = () => {
    if (!paymentOtherRadio?.checked || !paymentDetailInput) {
      setValidationState(paymentDetailInput, false);
      syncSubmitButtonState();
      return;
    }

    const isInvalid = !isPaymentAmountValid();
    setValidationState(paymentDetailInput, isInvalid);

    if (paymentErrorEl) {
      paymentErrorEl.innerText = isInvalid
        ? 'El monto debe ser mayor o igual al total del pedido.'
        : 'Ingresa un monto válido.';
    }

    syncSubmitButtonState();
  };

  paymentDetailInput?.addEventListener('input', validatePaymentInput);
  paymentExactRadio?.addEventListener('change', () => {
    togglePaymentInput();
    validatePaymentInput();
  });
  paymentOtherRadio?.addEventListener('change', () => {
    togglePaymentInput();
    validatePaymentInput();
  });

  togglePaymentInput();
  validatePaymentInput();

  return {
    getPaymentAmount,
    isPaymentAmountValid
  };
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

  const paymentControls = setupPaymentInput({
    orderTotal,
    paymentExactRadio,
    paymentOtherRadio,
    paymentDetailInput,
    paymentMinimumEl,
    paymentErrorEl,
    submitButton
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
