// Validación para bebidas
export function validateDrinkForm() {
  const type = document.querySelector('input[name="product-type"]:checked').value;
  
  if (type !== "drink") return { isValid: true, errors: [] };
  
  let isValid = true;
  let errors = [];
  
  // 1. Validar temperaturas (al menos una seleccionada)
  const temperatureChecks = document.querySelectorAll('input[name="temperatures[]"]:checked');
  if (temperatureChecks.length === 0) {
    isValid = false;
    errors.push("Selecciona al menos una temperatura");
  }
  
  // 2. Validar tamaños y precios
  const sizeCheckboxes = ['size-ch', 'size-m', 'size-g'];
  let hasValidSize = false;
  let hasSizeSelected = false;
  
  sizeCheckboxes.forEach(sizeId => {
    const check = document.getElementById(sizeId);
    const priceInput = document.getElementById(check?.dataset.target);
    
    if (check?.checked) {
      hasSizeSelected = true;
      const price = parseFloat(priceInput?.value);
      
      if (!priceInput || isNaN(price)) {
        isValid = false;
        if (!errors.includes("Debes indicar el precio correspondiente al tamaño de la bebida")) {
          errors.push("Debes indicar el precio correspondiente al tamaño de la bebida");
        }
      } else if (price < 0) {
        isValid = false;
        errors.push("El precio no puede ser menor que 0");
      } else if (price > 0) {
        hasValidSize = true;
      }
    }
  });
  
  if (hasSizeSelected && !hasValidSize && !errors.includes("Debes indicar el precio correspondiente al tamaño de la bebida")) {
    isValid = false;
    errors.push("Debes indicar el precio correspondiente al tamaño de la bebida");
  }
  
  if (!hasValidSize && !hasSizeSelected) {
    isValid = false;
    errors.push("Selecciona al menos un tamaño con precio válido, (mayor que 0)");
  }
  
  // 3. Validar tipos de leche
  const milkChecks = document.querySelectorAll('input[name="milks[]"]:checked');
  if (milkChecks.length === 0) {
    isValid = false;
    errors.push("Selecciona al menos un tipo de leche");
  }
  
  
  return { isValid, errors };
}

// Validación para postres
export function validateDessertForm() {
  const errors = [];

  const wholeEl = document.getElementById("whole-price");
  const sliceEl = document.getElementById("slice-price");

  const whole = parseFloat(wholeEl?.value) || 0;
  const slice = parseFloat(sliceEl?.value) || 0;

  // whole is required
  if (!wholeEl) errors.push("Falta el input de precio pieza completa");
  else if (whole <= 0) errors.push("Ingresa un precio válido para pieza completa.");

  // slice is optional, but if exists must be >= 0
  if (sliceEl && slice < 0) errors.push("El precio por rebanada no puede ser negativo.");

  return { isValid: errors.length === 0, errors };
}

// Validación básica para ambos tipos
export function validateBasicForm() {
  let isValid = true;
  let errors = [];
  
  const title = document.getElementById("product-title").value.trim();
  const description = document.getElementById("product-description").value.trim();
  
  if (!title) {
    isValid = false;
    errors.push("El nombre del producto es obligatorio");
  }
  
  if (!description) {
    isValid = false;
    errors.push("La descripción del producto es obligatoria");
  }
  
  return { isValid, errors };
}

// Función principal de validación
export function validateCompleteForm() {
  const type = document.querySelector('input[name="product-type"]:checked').value;
  const basicValidation = validateBasicForm();
  let typeValidation;
  
  if (type === "drink") {
    typeValidation = validateDrinkForm();
  } else if (type === "dessert") {
    typeValidation = validateDessertForm();
  } else {
    return { isValid: false, errors: ["Tipo de producto no válido"] };
  }
  
  const isValid = basicValidation.isValid && typeValidation.isValid;
  const errors = [...basicValidation.errors, ...typeValidation.errors];
  
  return { isValid, errors };
}

// Mostrar errores
export function showValidationErrors(errors) {
  if (errors.length > 0) {
    alert("Errores en el formulario:\n\n" + errors.join("\n"));
  }
}