import { validateCompleteForm, showValidationErrors } from './validators/validationMenu.js';
import { DrinkProduct, DessertProduct } from "./models/Product.js";

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

// Manejar envío del formulario
export async function handleFormSubmit(controller, editingProductId, onSuccess) {
  // Validar formulario
  const validation = validateCompleteForm();
  if (!validation.isValid) {
    showValidationErrors(validation.errors);
    return { success: false, editingProductId };
  }

  // Obtener tipo de producto
  const type = document.querySelector('input[name="product-type"]:checked').value;
  
  // Obtener imagen
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("previewImage");
  let imageData = "";
  
  if (imageInput.files[0]) {
    imageData = await readFileAsDataURL(imageInput.files[0]);
  } else {
    imageData = imagePreview.src.startsWith("blob:") ? "" : imagePreview.src;
  }

  // Procesar según el tipo
  if (type === "drink") {
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
    
  } else if (type === "dessert") {
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

  // Ejecutar callback de éxito
  if (onSuccess) {
    onSuccess();
  }

  return { success: true, editingProductId: null };
}

// Helper para leer archivo como DataURL
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Cargar producto en el modal para edición
export function loadProductIntoModal(product) {
  // Cargar datos básicos
  document.getElementById("product-title").value = product.title || "";
  document.getElementById("product-description").value = product.description || "";
  document.getElementById("prodPromo").checked = product.isPromo || false;
  document.getElementById("product-active").checked = product.isActive !== false;
  
  // Cargar imagen
  const imagePreview = document.getElementById("previewImage");
  const previewWrapper = document.getElementById("previewWrapper");
  const dropzoneContent = document.getElementById("dropzoneContent");
  
  if (product.image) {
    imagePreview.src = product.image;
    previewWrapper.classList.remove("d-none");
    dropzoneContent.classList.add("d-none");
  }
  
  // Determinar tipo de producto y cargar datos correspondientes
  const drinkSection = document.getElementById("drink-section");
  const dessertSection = document.getElementById('dessert-section');
  const drinkOptionsSection = document.querySelector('.container-fluid.pt-1.px-0');
  
  if (product.type === 'drink' || product instanceof DrinkProduct) {
    // Configurar como bebida
    const drinkRadio = document.querySelector('input[name="product-type"][value="drink"]');
    if (drinkRadio) {
      drinkRadio.checked = true;
      drinkSection.style.display = "block";
      if (dessertSection) dessertSection.style.display = "none";
      if (drinkOptionsSection) drinkOptionsSection.style.display = "block";
    }
    
    // Cargar sección
    const sectionSelect = document.getElementById("product-section");
    if (sectionSelect) sectionSelect.value = product.section || "Con café";
    
    // Cargar tamaños y precios
    const sizesMapping = {
      chico: { checkId: "size-ch", priceId: "price-ch" },
      mediano: { checkId: "size-m", priceId: "price-m" },
      grande: { checkId: "size-g", priceId: "price-g" }
    };
    
    Object.entries(sizesMapping).forEach(([sizeKey, { checkId, priceId }]) => {
      const check = document.getElementById(checkId);
      const priceInput = document.getElementById(priceId);
      
      if (check && priceInput && product.sizes && product.sizes[sizeKey]) {
        check.checked = true;
        priceInput.value = product.sizes[sizeKey];
        priceInput.classList.remove("d-none");
      }
    });
    
    // Cargar temperaturas
    if (product.temperatures) {
      document.querySelectorAll('input[name="temperatures[]"]').forEach(input => {
        input.checked = product.temperatures.includes(input.value);
      });
    }
    
    // Cargar tipos de leche
    if (product.milks) {
      document.querySelectorAll('input[name="milks[]"]').forEach(input => {
        input.checked = product.milks.includes(input.value);
      });
    }
    
    // Cargar extras
    if (product.extras) {
      document.querySelectorAll('input[name="extras[]"]').forEach(input => {
        input.checked = product.extras.includes(input.value);
      });
    }
    
  } else if (product.type === 'dessert' || product instanceof DessertProduct) {
    // Configurar como postre
    const dessertRadio = document.querySelector('input[name="product-type"][value="dessert"]');
    if (dessertRadio) {
      dessertRadio.checked = true;
      drinkSection.style.display = "none";
      if (dessertSection) dessertSection.style.display = "block";
      if (drinkOptionsSection) drinkOptionsSection.style.display = "none";
    }
    
    // Cargar categoría
    const categorySelect = document.getElementById("dessert-category");
    if (categorySelect) {
      categorySelect.value = product.category || "Postres";
    }
    
    // Cargar precios
    const priceInput = document.getElementById("dessert-price");
    const slicePriceInput = document.getElementById("dessert-slice-price");
    
    if (priceInput) {
      priceInput.value = product.price || 0;
    }
    
    if (slicePriceInput) {
      slicePriceInput.value = product.slicePrice || 0;
    }
  }
  
  return product.id;
}