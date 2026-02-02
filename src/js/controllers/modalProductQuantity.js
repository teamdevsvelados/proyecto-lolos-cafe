
/* This script implements **quantity selector logic**. 
It manages the interaction between two buttons (“plus” and “minus”) 
inside a modal and includes a safety check to ensure the quantity never drops below 1.
. */

document.addEventListener('DOMContentLoaded', function () {
    const btnMas = document.getElementById('btn-mas');
    const btnMenos = document.getElementById('btn-menos');
    const inputCantidad = document.getElementById('input-cantidad');

    // Función para aumentar
    btnMas.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        inputCantidad.value = valorActual + 1;
        // Aquí podrías llamar a una función para actualizar el precio total
    });

    // Función para disminuir
    btnMenos.addEventListener('click', function () {
        let valorActual = parseInt(inputCantidad.value);
        if (valorActual > 1) { // Evita que baje de 1
            inputCantidad.value = valorActual - 1;
            // Aquí podrías llamar a una función para actualizar el precio total
        }
    });
});


