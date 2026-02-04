
        document.addEventListener('DOMContentLoaded', () => {
  // Obtenemos los datos guardados
  const datos = localStorage.getItem('carrito_final');

  if (datos) {
    const productosParaPagar = JSON.parse(datos);
    console.log("Datos recibidos con éxito:", productosParaPagar);
    
    // Ahora puedes usar 'productosParaPagar' para llenar tu nueva interfaz
  } else {
    console.error("No se encontraron productos en el carrito.");
  }
});