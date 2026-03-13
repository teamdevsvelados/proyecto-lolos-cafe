export function initPaymentInputUI({
  orderTotal,
  paymentExactRadio,
  paymentOtherRadio,
  paymentDetailInput,
  paymentMinimumEl,
  paymentErrorEl,
  submitButton,
  setValidationState
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
        paymentErrorEl.innerText = 'Ingresa un monto valido.';
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
        : 'Ingresa un monto valido.';
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
