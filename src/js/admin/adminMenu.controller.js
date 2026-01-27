// adminMenu.controller.js - Versión modular final
// admin/adminMenu.controller.js - Versión simplificada
import { ProductsController } from "../controllers/productController.js";
import { ProductService } from "../services/productService.js";
import { 
  validateDrinkForm, 
  validateDessertForm, 
  validateBasicForm,
  showValidationErrors 
} from "../validators/menuValidators.js";
import { 
  setupCategoryButtons, 
  getActiveCategory, 
  showEmptyState,
  resetForm 
} from "../ui/adminUI.js";

const controller = new ProductsController();
let editingProductId = null;

export function initAdminMenu() {
  document.addEventListener("DOMContentLoaded", () => {
    // Inicializar controlador
    controller.loadFromStorage();
    
    // Configurar elementos
    const modalEl = document.getElementById("modal-drink");
    const modal = modalEl ? new bootstrap.Modal(modalEl) : null;
    const form = document.getElementById("product-form");
    const container = document.querySelector(".row.g-4");
    
    if (!form || !container) return;
    
    // Configurar UI
    setupCategoryButtons(container, controller, filterProductsByCategory);
    
    // Configurar eventos
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleFormSubmit(modal, container);
    });
    
    // Renderizar productos iniciales
    renderProducts(controller.products, container);
    
    // Configurar botón "AGREGAR +"
    const addNewBtn = document.querySelector('button[data-bs-target="#modal-drink"]');
    if (addNewBtn) {
      addNewBtn.addEventListener("click", () => {
        editingProductId = null;
        resetForm();
        updateModalButton();
      });
    }
  });
}

async function handleFormSubmit(modal, container) {
  // Validar formulario
  if (!validateForm()) return;
  
  // Procesar datos
  const success = await processFormData();
  if (!success) return;
  
  // Actualizar UI
  updateAfterSubmit(modal, container);
}

function validateForm() {
  const type = document.querySelector('input[name="product-type"]:checked')?.value;
  const basicValidation = validateBasicForm();
  
  let typeValidation;
  if (type === "drink") {
    typeValidation = validateDrinkForm();
  } else if (type === "dessert") {
    typeValidation = validateDessertForm();
  } else {
    showValidationErrors(["Tipo de producto no válido"]);
    return false;
  }
  
  const isValid = basicValidation.isValid && typeValidation.isValid;
  const errors = [...basicValidation.errors, ...typeValidation.errors];
  
  if (!isValid) {
    showValidationErrors(errors);
    return false;
  }
  
  return true;
}

async function processFormData() {
  try {
    const type = document.querySelector('input[name="product-type"]:checked').value;
    const imageData = await getImageData();
    
    if (type === "drink") {
      return await processDrinkForm(imageData);
    } else if (type === "dessert") {
      return await processDessertForm(imageData);
    }
  } catch (error) {
    console.error("Error procesando formulario:", error);
    return false;
  }
}

async function getImageData() {
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("previewImage");
  
  if (imageInput.files[0]) {
    return await ProductService.readFileAsDataURL(imageInput.files[0]);
  } else {
    return imagePreview.src.startsWith("blob:") ? "" : imagePreview.src;
  }
}

async function processDrinkForm(imageData) {
  const drinkData = ProductService.getDrinkFormData(imageData);
  
  if (editingProductId) {
    const updatedDrink = ProductService.createDrinkProduct(editingProductId, drinkData);
    controller.updateProduct(editingProductId, updatedDrink);
  } else {
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
  
  return true;
}

async function processDessertForm(imageData) {
  const dessertData = ProductService.getDessertFormData(imageData);
  
  if (editingProductId) {
    const updatedDessert = ProductService.createDessertProduct(editingProductId, dessertData);
    controller.updateProduct(editingProductId, updatedDessert);
  } else {
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
  
  return true;
}

function updateAfterSubmit(modal, container) {
  const activeCategory = getActiveCategory();
  filterProductsByCategory(activeCategory, container, controller);
  
  editingProductId = null;
  if (modal) modal.hide();
  resetForm();
  updateModalButton();
}

function filterProductsByCategory(categoryName, container, controller) {
  if (!container) return;
  
  container.innerHTML = "";
  
  const categoryMap = {
    'CON CAFÉ': 'Con café',
    'SIN CAFÉ': 'Sin café', 
    'POSTRES': 'Postres',
    'EXTRAS': 'Extras',
    'PROMOCIONES': 'Promociones'
  };
  
  const filterValue = categoryMap[categoryName] || categoryName;
  
  const filteredProducts = controller.products.filter(product => {
    if (product.type === 'drink') {
      return product.section === filterValue;
    } else if (product.type === 'dessert') {
      return product.category === filterValue;
    }
    return false;
  });
  
  if (filteredProducts.length === 0) {
    showEmptyState(filterValue, container);
  } else {
    renderProducts(filteredProducts, container);
  }
}

function renderProducts(products, container) {
  container.innerHTML = "";
  
  products.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

function createProductCard(product) {
  // ... implementar creación de tarjeta de producto ...
}

function updateModalButton() {
  // ... implementar actualización de botones del modal ...
}

// Exportar para uso en HTML
window.initAdminMenu = initAdminMenu;