// Funciones de interfaz de usuario para administración

// ========== FUNCIONES DE GESTIÓN DE INTERFAZ ==========

// Configurar botones de categoría
export function setupCategoryButtons(container, controller, filterProductsByCategory) {
  const categoryButtons = document.querySelectorAll('.top-buttons .btn');
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remover clase activa de todos los botones
      categoryButtons.forEach(btn => {
        btn.classList.remove('active', 'btn-dark');
        btn.classList.add('btn-outline-dark');
      });
      
      // Agregar clase activa al botón clickeado
      button.classList.remove('btn-outline-dark');
      button.classList.add('active', 'btn-dark');
      
      // Actualizar título de sección
      const sectionTitle = button.textContent.trim();
      const titleElement = document.querySelector('.pt-5.px-0.pb-1 h4');
      if (titleElement) {
        titleElement.textContent = sectionTitle;
      }
      
      // Filtrar productos por categoría
      if (typeof filterProductsByCategory === 'function') {
        filterProductsByCategory(sectionTitle, container, controller);
      }
    });
  });
  
  // Activar 'POSTRES' por defecto si existe
  const postresBtn = Array.from(categoryButtons).find(btn => 
    btn.textContent.trim() === 'POSTRES'
  );
  if (postresBtn) {
    setTimeout(() => postresBtn.click(), 100);
  }
}

// Obtener categoría activa
export function getActiveCategory() {
  const activeButton = document.querySelector('.top-buttons .btn.active');
  return activeButton ? activeButton.textContent.trim() : 'POSTRES';
}

// Mostrar estado vacío
export function showEmptyState(category, container) {
  const emptyCol = document.createElement('div');
  emptyCol.className = 'col-12 text-center py-5';
  emptyCol.innerHTML = `
    <div class="mb-3">
      <i class="bi bi-emoji-frown fs-1 text-muted"></i>
    </div>
    <h5 class="text-muted mb-2">No hay productos en ${category}</h5>
    <p class="text-muted">Haz clic en "AGREGAR +" para agregar un nuevo producto</p>
  `;
  container.appendChild(emptyCol);
}

// ========== FUNCIONES DE FORMULARIO ==========

// Reiniciar formulario
export function resetForm() {
  const form = document.getElementById("product-form");
  if (!form) return;
  
  // Reiniciar formulario
  form.reset();
  
  // Reiniciar vista previa de imagen
  resetImagePreview();
  
  // Reiniciar checkboxes
  resetCheckboxes();
  
  // Mostrar campos de bebida por defecto
  showDrinkFieldsByDefault();
  
  // Reiniciar campos de postre
  resetDessertFields();
}

// Reiniciar vista previa de imagen
function resetImagePreview() {
  const imagePreview = document.getElementById("previewImage");
  const previewWrapper = document.getElementById("previewWrapper");
  const dropzoneContent = document.getElementById("dropzoneContent");
  const imageInput = document.getElementById("productImage");
  
  if (imagePreview && imagePreview.src.startsWith("blob:")) {
    URL.revokeObjectURL(imagePreview.src);
  }
  if (imagePreview) imagePreview.src = "";
  if (previewWrapper) previewWrapper.classList.add("d-none");
  if (dropzoneContent) dropzoneContent.classList.remove("d-none");
  if (imageInput) imageInput.value = "";
}

// Reiniciar checkboxes
function resetCheckboxes() {
  // Tamaños
  document.querySelectorAll('.size-check').forEach(check => {
    const input = document.getElementById(check.dataset.target);
    if (input) {
      input.classList.add('d-none');
      input.value = '';
      input.required = false;
      check.checked = false;
    }
  });
  
  // Temperaturas, leches y extras
  ['temperatures', 'milks', 'extras'].forEach(name => {
    document.querySelectorAll(`input[name="${name}[]"]`).forEach(input => {
      input.checked = false;
    });
  });
  
  // Establecer valores por defecto
  setDefaultCheckboxValues();
}

// Establecer valores por defecto para checkboxes
function setDefaultCheckboxValues() {
  const calienteCheck = document.getElementById("temp-caliente");
  const regularCheck = document.getElementById("milk-regular");
  
  if (calienteCheck) calienteCheck.checked = true;
  if (regularCheck) regularCheck.checked = true;
  // Extras: no default (ninguno marcado = sin extras)

}

// Mostrar campos de bebida por defecto
function showDrinkFieldsByDefault() {
  const drinkSection = document.getElementById("drink-only");
  const dessertSection = document.getElementById('dessert-only');
  const blockSection = document.getElementById("block-section");
  const drinkRadio = document.querySelector('input[name="product-type"][value="drink"]');
  
  if (drinkRadio) drinkRadio.checked = true;
  drinkSection?.classList.remove("d-none");
  dessertSection?.classList.add("d-none");
  blockSection?.classList.remove("d-none");
}

// Reiniciar campos de postre
function resetDessertFields() {
  const hasSlice = document.getElementById("has-slice-price");
  const slice = document.getElementById("slice-price");
  const hasWhole = document.getElementById("has-whole-price");
  const whole = document.getElementById("whole-price");

  if (hasSlice) hasSlice.checked = false;
  if (slice) { slice.value = ""; slice.classList.add("d-none"); slice.required = false; }
  if (hasWhole) hasWhole.checked = false;
  if (whole) { whole.value = ""; whole.classList.add("d-none"); whole.required = false; }
}

// ========== FUNCIÓN PARA CARGAR PRODUCTO EN MODAL (EDICIÓN) ==========

export function loadProductForEditing(product, modal) {
  if (!product) return null;
  
  // Cargar datos básicos
  const titleInput = document.getElementById("product-title");
  const descInput = document.getElementById("product-description");
  const promoCheck = document.getElementById("prodPromo");
  const activeCheck = document.getElementById("product-active");
  
  if (titleInput) titleInput.value = product.title || "";
  if (descInput) descInput.value = product.description || "";
  if (promoCheck) promoCheck.checked = product.isPromo || false;
  if (activeCheck) activeCheck.checked = product.isActive !== false;
  
  // Cargar imagen
  loadProductImage(product);
  
  // Determinar tipo de producto y cargar datos correspondientes
  if (product.type === 'drink' || (product.section && !product.category)) {
    // Configurar como bebida
    setupDrinkForm(product);
  } else {
    // Configurar como postre
    setupDessertForm(product);
  }
  
  // Mostrar modal si se proporciona
  if (modal && typeof modal.show === 'function') {
    modal.show();
  }
  
  return product.id;
}

// Cargar imagen del producto
function loadProductImage(product) {
  const imagePreview = document.getElementById("previewImage");
  const previewWrapper = document.getElementById("previewWrapper");
  const dropzoneContent = document.getElementById("dropzoneContent");
  
  if (product.image && imagePreview && previewWrapper && dropzoneContent) {
    imagePreview.src = product.image;
    previewWrapper.classList.remove("d-none");
    dropzoneContent.classList.add("d-none");
  }
}

// Configurar formulario para bebida
function setupDrinkForm(product) {
  const drinkRadio = document.querySelector('input[name="product-type"][value="drink"]');
  const drinkSection = document.getElementById("drink-only");
  const dessertSection = document.getElementById("dessert-only");
  const blockSection = document.getElementById("block-section");
  
  if (drinkRadio) drinkRadio.checked = true;
  drinkSection?.classList.remove("d-none");
  dessertSection?.classList.add("d-none");
  blockSection?.classList.remove("d-none");

  const sectionSelect = document.getElementById("product-section");
  if (sectionSelect) sectionSelect.value = product.section || "Con café";

  // Cargar tamaños y precios
  loadDrinkSizes(product);
  
  // Cargar opciones de bebida
  loadDrinkOptions(product);
  }
  


// Cargar tamaños de bebida
function loadDrinkSizes(product) {
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
      priceInput.required = true;
    }
  });
}

// Cargar opciones de bebida (temperaturas, leches, extras)
function loadDrinkOptions(product) {
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
}

// Configurar formulario para postre
function setupDessertForm(product) {
  const dessertRadio = document.querySelector('input[name="product-type"][value="dessert"]');
  const drinkSection = document.getElementById("drink-only");
  const dessertSection = document.getElementById("dessert-only");
  const blockSection = document.getElementById("block-section");
  
  if (dessertRadio) dessertRadio.checked = true;
  drinkSection?.classList.add("d-none");
  dessertSection?.classList.remove("d-none");
  blockSection?.classList.add("d-none"); 

  const hasWhole = document.getElementById("has-whole-price");
  const whole = document.getElementById("whole-price");
  const hasSlice = document.getElementById("has-slice-price");
  const slice = document.getElementById("slice-price");
  
  const wholeVal = Number(product.price ?? 0);
  if (whole && hasWhole) {
    hasWhole.checked = wholeVal > 0;
    whole.classList.toggle("d-none", !(wholeVal > 0));
    whole.required = wholeVal > 0;
    whole.value = wholeVal > 0 ? wholeVal : "";
  }

  const sliceVal = Number(product.slicePrice ?? 0);
  if (slice && hasSlice) {
    hasSlice.checked = sliceVal > 0;
    slice.classList.toggle("d-none", !(sliceVal > 0));
    slice.required = sliceVal > 0;
    slice.value = sliceVal > 0 ? sliceVal : "";
  }
}

// ========== FUNCIONES DE DROPZONE DE IMÁGENES ==========

export function initImageDropzone() {
  const dropzone = document.getElementById("imageDropzone");
  const input = document.getElementById("productImage");
  
  if (!dropzone || !input) return;
  
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  const VALID_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const content = document.getElementById("dropzoneContent");
  const previewW = document.getElementById("previewWrapper");
  const preview = document.getElementById("previewImage");
  const errBox = document.getElementById("imageError");
  const changeBtn = document.getElementById("changeImageBtn");
  const removeBtn = document.getElementById("removeImageBtn");
  
  function showError(msg) {
    if (errBox) {
      errBox.textContent = msg;
      errBox.classList.remove("d-none");
      dropzone.classList.add("is-invalid", "border-danger");
    }
  }
  
  function clearError() {
    if (errBox) {
      errBox.textContent = "";
      errBox.classList.add("d-none");
      dropzone.classList.remove("is-invalid", "border-danger");
    }
  }
  
  function toPreview(file) {
    clearError();
    const url = URL.createObjectURL(file);
    if (preview) preview.src = url;
    if (content) content.classList.add("d-none");
    if (previewW) previewW.classList.remove("d-none");
  }
  
  function resetPreview() {
    if (input) input.value = "";
    if (preview && preview.src) URL.revokeObjectURL(preview.src);
    if (preview) preview.removeAttribute("src");
    if (previewW) previewW.classList.add("d-none");
    if (content) content.classList.remove("d-none");
    clearError();
  }
  
  function validate(file) {
    if (!file) return false;
    if (!VALID_TYPES.includes(file.type)) {
      showError("Formato no soportado. Usa JPG, PNG, GIF o WEBP.");
      return false;
    }
    if (file.size > MAX_SIZE) {
      showError("El archivo supera 5 MB. Selecciona una imagen más ligera.");
      return false;
    }
    return true;
  }
  
  function handleFiles(files) {
    const file = files && files[0];
    if (!file) return;
    if (!validate(file)) return;
    toPreview(file);
  }
  
  // Click en dropzone abre el input de archivo
  if (dropzone) {
    dropzone.addEventListener("click", () => {
      if (input) input.click();
    });
  }
  
  // Accesibilidad: Enter/Space activan
  if (dropzone) {
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (input) input.click();
      }
    });
  }
  
  // Cambios desde el selector de archivos
  if (input) {
    input.addEventListener("change", (e) => handleFiles(e.target.files));
  }
  
  // Drag & drop
  if (dropzone) {
    ["dragenter", "dragover"].forEach((evt) =>
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("dragover");
      })
    );
    
    ["dragleave", "drop"].forEach((evt) =>
      dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("dragover");
      })
    );
    
    dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      if (!dt || !dt.files) return;
      handleFiles(dt.files);
    });
  }
  
  // Botones de acción
  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      if (input) input.click();
    });
  }
  
  if (removeBtn) {
    removeBtn.addEventListener("click", resetPreview);
  }
}

// ========== FUNCIÓN PARA ACTUALIZAR BOTONES DEL MODAL ==========

export function updateModalButton(editingProductId, onSubmit, onCancel) {
  const modalFooter = document.querySelector('.modal .row.m-4');
  if (!modalFooter) return;
  
  const buttonContainer = modalFooter.querySelector('.d-flex');
  if (!buttonContainer) return;
  
  // Limpiar botones existentes
  buttonContainer.innerHTML = '';
  
  if (editingProductId) {
    // Botón Actualizar cuando se está editando
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn-primary px-4';
    updateBtn.type = 'button';
    updateBtn.textContent = 'Actualizar producto';
    updateBtn.addEventListener('click', onSubmit);
    
    // Botón Cancelar
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-outline-secondary px-4 ms-2';
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.addEventListener('click', onCancel);
    
    buttonContainer.appendChild(updateBtn);
    buttonContainer.appendChild(cancelBtn);
  } else {
    // Botón Agregar por defecto
    const addBtn = document.createElement('button');
    addBtn.className = 'btn btn-dark px-4';
    addBtn.type = 'button';
    addBtn.textContent = 'Agregar producto';
    addBtn.addEventListener('click', onSubmit);
    
    buttonContainer.appendChild(addBtn);
  }
}

// ========== INICIALIZACIÓN DE EVENTOS ==========

export function setupProductTypeToggle() {
  const drinkSection = document.getElementById("drink-only");
  const dessertSection = document.getElementById("dessert-only");
  const blockSection = document.getElementById("block-section");

  if (!drinkSection || !dessertSection || !blockSection) return;

  document.querySelectorAll('input[name="product-type"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        const isDrink = e.target.value === "drink";
        drinkSection.classList.toggle("d-none", !isDrink);
        dessertSection.classList.toggle("d-none", isDrink);

        blockSection.classList.toggle("d-none", !isDrink);
    });
  });
}

// Configurar eventos de checkboxes de tamaño
export function setupSizeCheckboxes() {
  document.querySelectorAll('.size-check').forEach(check => {
    check.addEventListener('change', function () {
      const input = document.getElementById(this.dataset.target);
      if (!input) return;
      
      if (this.checked) {
        input.classList.remove('d-none');
        input.required = true;
      } else {
        input.classList.add('d-none');
        input.value = '';
        input.required = false;
      }
    });
  });
}

export function setupDessertPriceToggles() {
  const hasSlice = document.getElementById("has-slice-price");
  const sliceInput = document.getElementById("slice-price");

  const hasWhole = document.getElementById("has-whole-price");
  const wholeInput = document.getElementById("whole-price");

  function bindToggle(check, input) {
    if (!check || !input) return;
    check.addEventListener("change", () => {
      input.classList.toggle("d-none", !check.checked);
      input.required = check.checked;
      if (!check.checked) input.value="";
    });
  }

  bindToggle(hasSlice, sliceInput);
  bindToggle(hasWhole, wholeInput);
}

// ========== INICIALIZACIÓN COMPLETA ==========

export function initAdminUI() {
  console.log("Inicializando Admin UI...");
  
  try {
    // Inicializar dropzone de imágenes
    initImageDropzone();
    
    // Crear sección de postres dinámicamente si no existe
    // createDessertSectionIfNeeded();

    // Configurar toggle de tipo de producto
    setupProductTypeToggle();

    setupDessertPriceToggles();
    
    // Configurar checkboxes de tamaño
    setupSizeCheckboxes();
    
    // Configurar navegación de barra lateral
    setupSidebarNavigation();
    
    console.log("Admin UI inicializado correctamente");
    return true;
  } catch (error) {
    console.error("Error inicializando Admin UI:", error);
    return false;
  }
}

// Crear sección de postres si no existe
/* function createDessertSectionIfNeeded() {
  let dessertSection = document.getElementById('dessert-section');
  if (dessertSection) return; // Ya existe
  
  // Buscar drink-only como referencia
  const drinkSection = document.getElementById("drink-only");
  if (!drinkSection) return;
  
  // Crear sección de postres
  dessertSection = document.createElement('div');
  dessertSection.id = 'dessert-section';
  dessertSection.style.display = 'none';
  dessertSection.innerHTML = `
    <div class="mb-3">
      <label class="form-label"><strong>Sección</strong></label>
      <select id="dessert-category" class="form-select mb-3">
        <option value="Postres">Postres</option>
        <option value="Extras">Extras</option>
        <option value="Promociones">Promociones</option>
      </select>
    </div>
    
    <div class="mb-3">
      <label for="dessert-price" class="form-label"><strong>Precio por pieza completa</strong></label>
      <input type="number" id="dessert-price" class="form-control" placeholder="$0.00" min="0" step="0.01" required>
    </div>
    
    <div class="mb-3">
      <label for="dessert-slice-price" class="form-label"><strong>Precio por rebanada (opcional)</strong></label>
      <input type="number" id="dessert-slice-price" class="form-control" placeholder="$0.00" min="0" step="0.01">
    </div>
  `;

  // Insertar después de drink-only
  drinkSection.parentNode.insertBefore(dessertSection, drinkSection.nextSibling);
}
*/

// Configurar navegación de barra lateral
function setupSidebarNavigation() {
  const links = document.querySelectorAll('.nav-admin-sidebar .nav-link');
  if (links.length === 0) return;
  
  links.forEach(a => {
    a.addEventListener('click', () => {
      links.forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    });
  });
}

// ========== FUNCIONES AUXILIARES ==========

// Verificar si un elemento existe
export function elementExists(selector) {
  return document.querySelector(selector) !== null;
}

// Mostrar notificación
export function showNotification(message, type = 'info') {
  const types = {
    'info': { class: 'alert-info', icon: 'info-circle' },
    'success': { class: 'alert-success', icon: 'check-circle' },
    'warning': { class: 'alert-warning', icon: 'exclamation-triangle' },
    'error': { class: 'alert-danger', icon: 'x-circle' }
  };
  
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;
  
  const alert = document.createElement('div');
  alert.className = `alert ${types[type].class} alert-dismissible fade show`;
  alert.innerHTML = `
    <i class="bi bi-${types[type].icon} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  alertContainer.appendChild(alert);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 5000);
}

// Verificar si todos los elementos necesarios existen
export function validateRequiredElements() {
  const requiredElements = [
    '#product-form',
    '#product-title',
    '#product-description',
    '#drink-only',
    '.row.g-4',
    '#modal-product'
  ];
  
  const missingElements = [];
  
  requiredElements.forEach(selector => {
    if (!elementExists(selector)) {
      missingElements.push(selector);
    }
  });
  
  if (missingElements.length > 0) {
    console.error('Elementos faltantes:', missingElements);
    return false;
  }
  
  return true;
}