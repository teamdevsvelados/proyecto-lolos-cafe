/* This script listens for click events on the document and detects when the “Finalize Order” button is clicked.
When triggered, it checks whether the cart contains items:
If the cart is empty, it shows an alert.
If it has items, it saves the cart in localStorage and redirects the user to the delivery method page.*/

import { cart } from './cartManagerDesserts.js';

document.addEventListener('click', (e) => {
  const btnFinalizar = e.target.closest('#btnFinalizarPedido');
  if (!btnFinalizar) return;

  e.preventDefault();

  console.log('Carrito real:', cart);

  if (cart.length === 0) {
    alert("Agrega al menos un producto para continuar.");
    return;
  }

  localStorage.setItem('carrito_final', JSON.stringify(cart));
  window.location.href = 'delivery-method.html';
});

