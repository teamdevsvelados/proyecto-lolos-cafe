import { DrinkProduct, DessertProduct } from "../models/Product.js";
import { 
  validateBasicForm, 
  validateDrinkForm, 
  validateDessertForm,
  showValidationErrors 
} from "../validators/validationMenu.js";

// Extraer datos del formulario para bebidas
export function getDrinkFormData(imageData) {
  const title = document.getElementById("product-title").value.trim();
  const description = document.getElementById("product-description").value.trim();
  const isPromo = document.getElementById("prodPromo").checked;
  const isActive = document.getElementById("product-active").checked;
  const section = document.getElementById("product-section").value;

  // Obtener tamaños y precios
  const sizes = {};
  if (document.getElementById("size-ch").checked) {
    const price = parseFloat(document.getElementById("price-ch").value) || 0;
    sizes.chico = price;
  }
  if (document.getElementById("size-m").checked) {
    const price = parseFloat(document.getElementById("price-m").value) || 0;
    sizes.mediano = price;
  }
  if (document.getElementById("size-g").checked) {
    const price = parseFloat(document.getElementById("price-g").value) || 0;
    sizes.grande = price;
  }

  // Temperatures
  const temperatures = Array.from(
    document.querySelectorAll('input[name="temperatures[]"]:checked')
  ).map((t) => t.value);

  // Milks
  const milks = Array.from(
    document.querySelectorAll('input[name="milks[]"]:checked')
  ).map((m) => m.value);

  // Extras
  const extras = Array.from(
    document.querySelectorAll('input[name="extras[]"]:checked')
  ).map((t) => t.value);

  return {
    title,
    description,
    imageData,
    isActive,
    isPromo,
    section,
    sizes,
    temperatures,
    milks,
    extras
  };
}

// Extraer datos del formulario para postres
export function getDessertFormData(imageData) {
  const title = document.getElementById("product-title").value.trim();
  const description = document.getElementById("product-description").value.trim();
  const isPromo = document.getElementById("prodPromo").checked;
  const isActive = document.getElementById("product-active").checked;
  const category = document.getElementById("dessert-category").value;
  const price = parseFloat(document.getElementById("dessert-price").value) || 0;
  const slicePrice = parseFloat(document.getElementById("dessert-slice-price").value) || 0;

  return {
    title,
    description,
    imageData,
    isActive,
    isPromo,
    category,
    price,
    slicePrice
  };
}

// Validar formulario completo
function validateCompleteForm() {
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

// Manejar envío del formulario

export async function handleFormSubmit(controller, editingProductId, onSuccess) {
  // 1. Validar formulario
  const validation = validateCompleteForm();
  if (!validation.isValid) {
    showValidationErrors(validation.errors);
    return { success: false, editingProductId };
  }

  // 2. Tipo de producto
  const type = document.querySelector('input[name="product-type"]:checked').value;

  // 3. Imagen
  const imageData = await getImageData();

  // 4. Procesar según tipo
  if (type === "drink") {
    await processDrinkForm(controller, imageData, editingProductId);
  } else if (type === "dessert") {
    await processDessertForm(controller, imageData, editingProductId);
  }

  // 5. Callback de éxito (UI)
  if (onSuccess) onSuccess();

  return { success: true, editingProductId: null };
}
  
// Obtener datos de imagen
async function getImageData() {
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("previewImage");
  
  if (imageInput.files[0]) {
    return await readFileAsDataURL(imageInput.files[0]);
  } else {
    return imagePreview.src.startsWith("blob:") ? "" : imagePreview.src;
  }
}

// Procesar formulario de bebida
async function processDrinkForm(controller, imageData, editingProductId) {
  const drinkData = getDrinkFormData(imageData);
  
  if (editingProductId) {
    // Actualizar bebida existente
    const updatedDrink = new DrinkProduct(
      editingProductId,
      drinkData.title,
      drinkData.description,
      drinkData.imageData,
      drinkData.isActive,
      drinkData.section,
      drinkData.sizes,
      drinkData.temperatures,
      drinkData.milks,
      drinkData.extras,
      drinkData.isPromo
    );
    
    controller.updateProduct(editingProductId, updatedDrink);
  } else {
    // Crear nueva bebida
    controller.createDrink([
      drinkData.title,
      drinkData.description,
      drinkData.imageData,
      drinkData.isActive,
      drinkData.section,
      drinkData.sizes,
      drinkData.temperatures,
      drinkData.milks,
      drinkData.extras,
      drinkData.isPromo
    ]);
  }
}

// Procesar formulario de postre
async function processDessertForm(controller, imageData, editingProductId) {
  const dessertData = getDessertFormData(imageData);
  
  if (editingProductId) {
    // Actualizar postre existente
    const updatedDessert = new DessertProduct(
      editingProductId,
      dessertData.title,
      dessertData.description,
      dessertData.imageData,
      dessertData.isActive,
      dessertData.price,
      dessertData.isPromo,
      dessertData.category,
      dessertData.slicePrice
    );
    
    controller.updateProduct(editingProductId, updatedDessert);
  } else {
    // Crear nuevo postre
    controller.createDessert([
      dessertData.title,
      dessertData.description,
      dessertData.imageData,
      dessertData.isActive,
      dessertData.price,
      dessertData.isPromo,
      dessertData.category,
      dessertData.slicePrice
    ]);
  }
}

// Helper para leer archivo como DataURL
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}