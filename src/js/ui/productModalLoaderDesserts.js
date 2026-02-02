/* This script dynamically populates a Bootstrap modal when it is opened.
It detects which card triggered the modal, extracts data from data-* attributes, 
injects that data into the modal (name, price, description, image), and resets
 quantity and total values each time the modal is shown. */


const modalPostres = document.getElementById('modalPostres');

modalPostres.addEventListener('show.bs.modal', function (event) {
    // 1. Identificar qué card disparó el evento
    const card = event.relatedTarget;

    // 2. Extraer los datos de los atributos data- de la card
    const nombre = card.getAttribute('data-nombre');
    const precio = card.getAttribute('data-precio');
    const descripcion = card.getAttribute('data-descripcion');
    const imagen = card.getAttribute('data-imagen');

    // 3. Inyectar los datos en los elementos del modal
    document.getElementById('m-header-titulo').textContent = `Personaliza tu ${nombre}`;
    document.getElementById('m-nombre').textContent = nombre;
    document.getElementById('m-precio').textContent = `$${precio}`;
    document.getElementById('m-descripcion').textContent = descripcion;
    document.getElementById('m-imagen').src = imagen;

    // 4. Resetear la cantidad a 1 y el total al precio base al abrir
    document.getElementById('input-cantidad').value = 1;
    document.getElementById('modal-total-dinamico').textContent = `$${precio}`;
});