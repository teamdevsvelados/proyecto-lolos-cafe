function sanitizePhone(phone) {
  return String(phone || '').replace(/[\s()-]/g, '');
}

function normalizePhone(phone) {
  const withoutPlus = phone.replace('+', '');

  if (withoutPlus.startsWith('52') && withoutPlus.length === 12) {
    return withoutPlus.slice(2);
  }

  return withoutPlus;
}

export function validateDeliveryForm({ name, phone, address, payment }) {
  const errors = {};

  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  }

  const sanitizedPhone = sanitizePhone(phone);
  const phonePattern = /^(\+?52)?\d{10}$/;

  if (!sanitizedPhone || !phonePattern.test(sanitizedPhone)) {
    errors.phone = 'Ingresa un número de teléfono válido.';
  }

  if (!address) {
    errors.address = 'La dirección es obligatoria.';
  }

  if (payment?.type === 'other') {
    const amount = Number(payment.amount);
    const orderTotal = Number(payment.orderTotal);

    if (!Number.isFinite(amount) || amount < orderTotal) {
      errors.paymentAmount = 'El monto debe ser mayor o igual al total del pedido.';
    }
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    normalizedData: {
      name,
      phone: normalizePhone(sanitizedPhone),
      address
    }
  };
}
