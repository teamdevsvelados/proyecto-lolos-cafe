import { getFinalCart } from '../core/storage/cartStorage.js';

export function calculateCartTotal() {
  const cart = getFinalCart();

  return cart.reduce((total, item) => {
    return total + item.precio * item.cantidad;
  }, 0);
}
