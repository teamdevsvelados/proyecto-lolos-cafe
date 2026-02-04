
/* This script implements **quantity selector logic**. 
It manages the interaction between two buttons (“plus” and “minus”) 
inside a modal and includes a safety check to ensure the quantity never drops below 1.
It also updates the total price dynamically based on quantity changes.
*/

let basePrice = 0;

function updateTotalPrice() {
    const inputCantidad = document.getElementById('input-cantidad');
    const modalTotalDinamico = document.getElementById('modal-total-dinamico');
    const mPrecio = document.getElementById('m-precio');
    
    if (!inputCantidad || !modalTotalDinamico) return;
    
    if (basePrice === 0 && mPrecio) {
        const precioText = mPrecio.textContent.replace(/[^0-9.]/g, '');
        basePrice = Number(precioText) || 0;
    }
    
    const cantidad = parseInt(inputCantidad.value) || 1;
    const total = basePrice * cantidad;
    modalTotalDinamico.textContent = `$ ${total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const btnMas = document.getElementById('btn-mas');
    const btnMenos = document.getElementById('btn-menos');
    const inputCantidad = document.getElementById('input-cantidad');
    const mPrecio = document.getElementById('m-precio');
    
    if (mPrecio) {
        const precioText = mPrecio.textContent.replace(/[^0-9.]/g, '');
        basePrice = Number(precioText) || 0;
    }

    // Función para aumentar
    btnMas.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        inputCantidad.value = valorActual + 1;
        updateTotalPrice();
    });

    // Función para disminuir
    btnMenos.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        if (valorActual > 1) { // Evita que baje de 1
            inputCantidad.value = valorActual - 1;
            updateTotalPrice();
        }
    });
});

const modalPostres = document.getElementById('modalPostres');
if (modalPostres) {
    modalPostres.addEventListener('show.bs.modal', function () {
        basePrice = 0;
        updateTotalPrice();
    });
}


