const CART_ITEMS_STORAGE_KEY = 'carrito_final';
const CHECKOUT_DELIVERY_STORAGE_KEY = 'checkoutDeliveryData';

export function getFinalCart() {
  try {
    const finalCartRaw = localStorage.getItem(CART_ITEMS_STORAGE_KEY);
    if (!finalCartRaw) return [];

    const parsedCart = JSON.parse(finalCartRaw);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

export function saveCheckoutDeliveryData(checkoutData) {
  localStorage.setItem(CHECKOUT_DELIVERY_STORAGE_KEY, JSON.stringify(checkoutData));
}
