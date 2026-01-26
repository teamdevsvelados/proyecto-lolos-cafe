// adminMenu.js — fix for editing desserts only
import { ProductsController } from "./controllers/productController.js";
import { DrinkProduct, DessertProduct } from "./models/Product.js";

const controller = new ProductsController();
let editingProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const modalEl = document.getElementById("modal-drink");
  const modal = new bootstrap.Modal(modalEl);
  const form = document.getElementById("product-form");
  
  // Specific fields
  const drinkSection = document.getElementById("drink-section");
  
  // Create dessert section dynamically
  let dessertSection = document.getElementById('dessert-section');
  if (!dessertSection) {
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
    
    // Insert after the product-type fieldset
    const typeFieldset = document.querySelector('fieldset.mb-4');
    if (typeFieldset) {
      typeFieldset.parentNode.insertBefore(dessertSection, drinkSection);
    }
  }
  
  // Hide drink options when dessert is selected
  const drinkOptionsSection = document.querySelector('.container-fluid.pt-1.px-0');
  
  // Image elements
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("previewImage");
  const dropzoneContent = document.getElementById("dropzoneContent");
  const previewWrapper = document.getElementById("previewWrapper");
  
  // Products container
  const container = document.querySelector(".row.g-4");

  // Modal buttons
  const modalFooter = document.querySelector('.modal .row.m-4');
  
  // LOAD FROM STORAGE
  controller.loadFromStorage();
  
  // Initialize by showing all products
  renderAllProducts();
  
  // Set up category buttons
  setupCategoryButtons();

  // Show/hide fields based on product type
  document.querySelectorAll('input[name="product-type"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "drink") {
        drinkSection.style.display = "block";
        if (dessertSection) dessertSection.style.display = "none";
        if (drinkOptionsSection) drinkOptionsSection.style.display = "block";
      } else {
        drinkSection.style.display = "none";
        if (dessertSection) dessertSection.style.display = "block";
        if (drinkOptionsSection) drinkOptionsSection.style.display = "none";
      }
    });
  });

  // Initialize: show drink fields by default
  if (drinkOptionsSection) {
    drinkOptionsSection.style.display = "block";
  }

  // SUBMIT FORM — adjusted to fix issues
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await handleFormSubmit();
  });

  // Function to handle form submission — fixed
  async function handleFormSubmit() {
    // Validate image
    const imageFile = imageInput.files[0];
    let imageData = "";
    
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imageData = e.target.result;
        processFormSubmission(imageData);
      };
      reader.readAsDataURL(imageFile);
    } else {
      // If there's an existing preview image (keep the same image)
      imageData = imagePreview.src.startsWith("blob:") ? "" : imagePreview.src;
      await processFormSubmission(imageData);
    }
  }

  async function processFormSubmission(imageData) {
    const title = document.getElementById("product-title").value.trim();
    const description = document.getElementById("product-description").value.trim();
    const isPromo = document.getElementById("prodPromo").checked;
    const isActive = document.getElementById("product-active").checked;
    const type = document.querySelector('input[name="product-type"]:checked').value;

    // Basic validations
    if (!title || !description) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // EDIT MODE - Main fix for desserts
    if (editingProductId) {
      // Find the existing product
      const existingProductIndex = controller.products.findIndex(p => p.id === editingProductId);
      
      if (existingProductIndex !== -1) {
        if (type === "drink") {
          // Update existing drink
          const section = document.getElementById("product-section").value;

          // Get sizes and prices
          const sizes = {};
          if (document.getElementById("size-ch").checked) {
            sizes.chico = parseFloat(document.getElementById("price-ch").value) || 0;
          }
          if (document.getElementById("size-m").checked) {
            sizes.mediano = parseFloat(document.getElementById("price-m").value) || 0;
          }
          if (document.getElementById("size-g").checked) {
            sizes.grande = parseFloat(document.getElementById("price-g").value) || 0;
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

          // Create new drink with the same ID
          const updatedDrink = new DrinkProduct(
            editingProductId,
            title,
            description,
            imageData,
            isActive,
            section,
            sizes,
            temperatures,
            milks,
            extras,
            isPromo
          );
          
          // Replace in the array
          controller.products[existingProductIndex] = updatedDrink;
          
        } else {
          // Update existing dessert — key fix here
          const category = document.getElementById("dessert-category").value;
          const price = parseFloat(document.getElementById("dessert-price").value) || 0;
          const slicePrice = parseFloat(document.getElementById("dessert-slice-price").value) || 0;
          
          // Validate price
          if (price <= 0) {
            alert("Debes ingresar un precio válido para el postre");
            return;
          }

          // If the existing product is a drink, create a new dessert
          // If it's already a dessert, update it
          const existingProduct = controller.products[existingProductIndex];
          
          if (existingProduct.type === 'drink' || existingProduct instanceof DrinkProduct) {
            // Change from drink to dessert — create new dessert
            const newDessert = new DessertProduct(
              editingProductId,
              title,
              description,
              imageData,
              isActive,
              price,
              isPromo,
              category,
              slicePrice
            );
            controller.products[existingProductIndex] = newDessert;
          } else {
            // Already a dessert — update properties
            existingProduct.title = title;
            existingProduct.description = description;
            existingProduct.image = imageData;
            existingProduct.isActive = isActive;
            existingProduct.isPromo = isPromo;
            existingProduct.price = price;
            existingProduct.category = category;
            existingProduct.slicePrice = slicePrice;
          }
        }
        
        // Save changes
        controller.saveToStorage();
        
        // Reload the current view
        const activeCategory = getActiveCategory();
        filterProductsByCategory(activeCategory);
        
        editingProductId = null;
        modal.hide();
        resetForm();
        updateModalButton();
      }
      return;
    }

    // CREATE NEW - Create new product
    if (type === "drink") {
      const section = document.getElementById("product-section").value;

      // Get sizes and prices
      const sizes = {};
      if (document.getElementById("size-ch").checked) {
        sizes.chico = parseFloat(document.getElementById("price-ch").value) || 0;
      }
      if (document.getElementById("size-m").checked) {
        sizes.mediano = parseFloat(document.getElementById("price-m").value) || 0;
      }
      if (document.getElementById("size-g").checked) {
        sizes.grande = parseFloat(document.getElementById("price-g").value) || 0;
      }

      // Validate at least one size is selected
      if (Object.keys(sizes).length === 0) {
        alert("Debes seleccionar al menos un tamaño para la bebida");
        return;
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

      controller.createDrink([
        title,
        description,
        imageData,
        isActive,
        section,
        sizes,
        temperatures,
        milks,
        extras,
        isPromo
      ]);
      
    } else {
      // Create new dessert
      const category = document.getElementById("dessert-category").value;
      const price = parseFloat(document.getElementById("dessert-price").value) || 0;
      const slicePrice = parseFloat(document.getElementById("dessert-slice-price").value) || 0;
      
      // Validate price
      if (price <= 0) {
        alert("Debes ingresar un precio válido para el postre");
        return;
      }

      controller.createDessert([
        title,
        description,
        imageData,
        isActive,
        price,
        isPromo,
        category,
        slicePrice
      ]);
    }

    // Reload current view
    const activeCategory = getActiveCategory();
    filterProductsByCategory(activeCategory);
    
    modal.hide();
    resetForm();
  }

  // Function to update the modal button
  function updateModalButton() {
    if (!modalFooter) return;
    
    const buttonContainer = modalFooter.querySelector('.d-flex');
    if (!buttonContainer) return;
    
    // Clear existing buttons
    buttonContainer.innerHTML = '';
    
    if (editingProductId) {
      // Update button when editing
      const updateBtn = document.createElement('button');
      updateBtn.className = 'btn btn-primary px-4';
      updateBtn.type = 'button';
      updateBtn.textContent = 'Actualizar producto';
      updateBtn.addEventListener('click', handleFormSubmit);
      
      // Cancel button
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-outline-secondary px-4 ms-2';
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.addEventListener('click', () => {
        editingProductId = null;
        modal.hide();
        resetForm();
        updateModalButton();
      });
      
      buttonContainer.appendChild(updateBtn);
      buttonContainer.appendChild(cancelBtn);
    } else {
      // Default Add button
      const addBtn = document.createElement('button');
      addBtn.className = 'btn btn-dark px-4';
      addBtn.type = 'button';
      addBtn.textContent = 'Agregar producto';
      addBtn.addEventListener('click', handleFormSubmit);
      
      buttonContainer.appendChild(addBtn);
    }
  }

  function resetForm() {
    form.reset();
    // Reset image preview
    if (imagePreview.src.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview.src);
    }
    imagePreview.src = "";
    previewWrapper.classList.add("d-none");
    dropzoneContent.classList.remove("d-none");
    imageInput.value = "";
    
    // Reset size checkboxes
    document.querySelectorAll('.size-check').forEach(check => {
      const input = document.getElementById(check.dataset.target);
      if (input) {
        input.classList.add('d-none');
        input.value = '';
        input.required = false;
        check.checked = false;
      }
    });
    
    // Reset temperature, milk, and extras checkboxes
    document.querySelectorAll('input[name="temperatures[]"]').forEach(input => {
      input.checked = false;
    });
    document.querySelectorAll('input[name="milks[]"]').forEach(input => {
      input.checked = false;
    });
    document.querySelectorAll('input[name="extras[]"]').forEach(input => {
      input.checked = false;
    });
    
    // Set 'Hot' and 'Regular' by default
    const calienteCheck = document.getElementById("temp-caliente");
    const regularCheck = document.getElementById("milk-regular");
    const sinExtrasCheck = document.getElementById("extra-no");
    
    if (calienteCheck) calienteCheck.checked = true;
    if (regularCheck) regularCheck.checked = true;
    if (sinExtrasCheck) sinExtrasCheck.checked = true;
    
    // Show drink fields by default
    const drinkRadio = document.querySelector('input[name="product-type"][value="drink"]');
    if (drinkRadio) {
      drinkRadio.checked = true;
    }
    drinkSection.style.display = "block";
    if (dessertSection) dessertSection.style.display = "none";
    if (drinkOptionsSection) drinkOptionsSection.style.display = "block";
    
    // Reset dessert fields
    const dessertPriceInput = document.getElementById("dessert-price");
    const dessertSlicePriceInput = document.getElementById("dessert-slice-price");
    const dessertCategoryInput = document.getElementById("dessert-category");
    
    if (dessertPriceInput) dessertPriceInput.value = '';
    if (dessertSlicePriceInput) dessertSlicePriceInput.value = '';
    if (dessertCategoryInput) dessertCategoryInput.value = "Postres";
    
    // Restore button to 'Add product'
    updateModalButton();
    
    // Reset edit variables
    editingProductId = null;
  }

  // Set up category buttons
  function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.top-buttons .btn');
    
    categoryButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        categoryButtons.forEach(btn => {
          btn.classList.remove('active', 'btn-dark');
          btn.classList.add('btn-outline-dark');
        });
        
        // Add active class to the clicked button
        button.classList.remove('btn-outline-dark');
        button.classList.add('active', 'btn-dark');
        
        // Update section title
        const sectionTitle = button.textContent.trim();
        const titleElement = document.querySelector('.pt-5.px-0.pb-1 h4');
        if (titleElement) {
          titleElement.textContent = sectionTitle;
        }
        
        // Filter products by category
        filterProductsByCategory(sectionTitle);
      });
    });
    
    // Activate 'POSTRES' by default
    const postresBtn = Array.from(categoryButtons).find(btn => 
      btn.textContent.trim() === 'POSTRES'
    );
    if (postresBtn) {
      postresBtn.click();
    }
  }

  function getActiveCategory() {
    const activeButton = document.querySelector('.top-buttons .btn.active');
    return activeButton ? activeButton.textContent.trim() : 'POSTRES';
  }

  function filterProductsByCategory(categoryName) {
    if (!container) return;
    
    // Clear container
    container.innerHTML = "";
    
    // Map button names to filter values
    const categoryMap = {
      'CON CAFÉ': 'Con café',
      'SIN CAFÉ': 'Sin café', 
      'POSTRES': 'Postres',
      'EXTRAS': 'Extras',
      'PROMOCIONES': 'Promociones'
    };
    
    const filterValue = categoryMap[categoryName] || categoryName;
    
    // Filter products
    const filteredProducts = controller.products.filter(product => {
      // If drink, check section
      if (product.type === 'drink' || product instanceof DrinkProduct) {
        return product.section === filterValue;
      }
      
      // If dessert, check category
      if (product.type === 'dessert' || product instanceof DessertProduct) {
        return product.category === filterValue || 
               (filterValue === 'Postres' && !product.category);
      }
      
      return false;
    });
    
    // Render filtered products
    if (filteredProducts.length === 0) {
      showEmptyState(filterValue);
    } else {
      filteredProducts.forEach(product => renderCard(product));
    }
  }

  function showEmptyState(category) {
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

  function renderAllProducts() {
    if (!container) return;
    
    container.innerHTML = "";
    
    if (controller.products.length === 0) {
      showEmptyState('esta sección');
    } else {
      controller.products.forEach(product => renderCard(product));
    }
  }

  // RENDER CARD - Keeping what works
  function renderCard(product) {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-4 col-md-3 mb-4";
    
    const card = document.createElement("div");
    card.className = "card h-100";
    card.style.cursor = "pointer";
    
    // If the product is inactive, make it opaque
    if (!product.isActive) {
      card.style.opacity = "0.6";
    }

    // Badge 'New' or 'Promo'
    if (product.isPromo) {
      const promoBadge = document.createElement("p");
      promoBadge.className = "new-drink col-12 text-center pt-1 pb-0 bg-warning text-dark";
      promoBadge.textContent = "PROMO";
      card.appendChild(promoBadge);
    } else if (isProductNew(product)) {
      const newBadge = document.createElement("p");
      newBadge.className = "new-drink col-12 text-center pt-1 pb-0";
      newBadge.textContent = "Nuevo";
      card.appendChild(newBadge);
    }

    // Image
    const imgContainer = document.createElement("div");
    imgContainer.className = "position-relative";
    
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.className = "card-img-top";
      img.alt = product.title;
      img.style.height = "180px";
      img.style.objectFit = "cover";
      imgContainer.appendChild(img);
    } else {
      // Placeholder based on type
      const placeholder = document.createElement("div");
      placeholder.className = "card-img-top d-flex align-items-center justify-content-center";
      placeholder.style.height = "180px";
      placeholder.style.backgroundColor = (product.type === 'drink') ? "#f8f9fa" : "#fff3cd";
      
      const icon = document.createElement("i");
      icon.className = (product.type === 'drink') ? "bi bi-cup-straw fs-1 text-muted" : "bi bi-cake fs-1 text-muted";
      placeholder.appendChild(icon);
      imgContainer.appendChild(placeholder);
    }
    
    card.appendChild(imgContainer);

    // Card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body row";

    const title = document.createElement("p");
    title.className = "card-title col-6";
    title.textContent = product.title || "Sin nombre";

    const price = document.createElement("p");
    price.className = "price col-6 text-end";
    
    // Calculate price
    if (product.type === 'drink' || product instanceof DrinkProduct) {
      if (product.sizes && Object.values(product.sizes).length > 0) {
        const prices = Object.values(product.sizes);
        price.textContent = `$${Math.min(...prices).toFixed(2)}`;
      } else {
        price.textContent = "$0.00";
      }
    } else {
      // For desserts, show 'From $price'
      price.textContent = product.slicePrice && product.slicePrice > 0 
        ? `Desde $${(product.price || 0).toFixed(2)}`
        : `$${(product.price || 0).toFixed(2)}`;
    }

    const description = document.createElement("p");
    description.className = "card-text";
    description.textContent = product.description || "Sin descripción";

    cardBody.appendChild(title);
    cardBody.appendChild(price);
    cardBody.appendChild(description);
    card.appendChild(cardBody);

    // Footer with action buttons
    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer card-actions p-2";
    
    const btnGroup = document.createElement("div");
    btnGroup.className = "d-flex justify-content-between";
    
    // Edit button
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-primary";
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loadProductIntoModal(product);
      modal.show();
    });
    
    // Activate/Deactivate button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = product.isActive 
      ? "btn btn-sm btn-outline-warning" 
      : "btn btn-sm btn-outline-success";
    toggleBtn.textContent = product.isActive ? "Desactivar" : "Activar";
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newState = controller.toggleActive(product.id);
      if (newState !== null) {
        // Update card visually
        card.style.opacity = newState ? "1" : "0.6";
        toggleBtn.textContent = newState ? "Desactivar" : "Activar";
        toggleBtn.className = newState 
          ? "btn btn-sm btn-outline-warning" 
          : "btn btn-sm btn-outline-success";
      }
    });
    
    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`¿Eliminar "${product.title}"? Esta acción no se puede deshacer.`)) {
        controller.deleteProduct(product.id);
        const activeCategory = getActiveCategory();
        filterProductsByCategory(activeCategory);
      }
    });
    
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(toggleBtn);
    btnGroup.appendChild(deleteBtn);
    cardFooter.appendChild(btnGroup);
    card.appendChild(cardFooter);

    // Open modal when clicking the card
    card.addEventListener("click", (e) => {
      if (!e.target.closest('button')) {
        loadProductIntoModal(product);
        modal.show();
      }
    });
    
    col.appendChild(card);
    container.appendChild(col);
  }

  function isProductNew(product) {
    // Logic to determine if a product is new (less than 7 days)
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  // Clear drink sizes when loading dessert
  document.querySelectorAll('.size-check').forEach(c => {
  c.checked = false;
  const input = document.getElementById(c.dataset.target);
  if (input) {
    input.classList.add('d-none');
    input.value = '';
    input.required = false;
  }
});

  function loadProductIntoModal(product) {
    editingProductId = product.id;
    
    // Load basic data
    document.getElementById("product-title").value = product.title || "";
    document.getElementById("product-description").value = product.description || "";
    document.getElementById("prodPromo").checked = product.isPromo || false;
    document.getElementById("product-active").checked = product.isActive !== false;
    
    // Load image
    if (product.image) {
      imagePreview.src = product.image;
      previewWrapper.classList.remove("d-none");
      dropzoneContent.classList.add("d-none");
    }
    
    // Determine product type and load corresponding data
    if (product.type === 'drink' || product instanceof DrinkProduct) {
      // Configure as drink
      const drinkRadio = document.querySelector('input[name="product-type"][value="drink"]');
      if (drinkRadio) {
        drinkRadio.checked = true;
        drinkSection.style.display = "block";
        if (dessertSection) dessertSection.style.display = "none";
        if (drinkOptionsSection) drinkOptionsSection.style.display = "block";
      }
      
      // Load section
      const sectionSelect = document.getElementById("product-section");
      if (sectionSelect) sectionSelect.value = product.section || "Con café";
      
      // Load sizes and prices
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
      
      // Load temperatures
      if (product.temperatures) {
        document.querySelectorAll('input[name="temperatures[]"]').forEach(input => {
          input.checked = product.temperatures.includes(input.value);
        });
      }
      
      // Load milk types
      if (product.milks) {
        document.querySelectorAll('input[name="milks[]"]').forEach(input => {
          input.checked = product.milks.includes(input.value);
        });
      }
      
      // Load extras
      if (product.extras) {
        document.querySelectorAll('input[name="extras[]"]').forEach(input => {
          input.checked = product.extras.includes(input.value);
        });
      }
      
    } else if (product.type === 'dessert' || product instanceof DessertProduct) {
      // Configure as dessert
      const dessertRadio = document.querySelector('input[name="product-type"][value="dessert"]');
      if (dessertRadio) {
        dessertRadio.checked = true;
        drinkSection.style.display = "none";
        if (dessertSection) dessertSection.style.display = "block";
        if (drinkOptionsSection) drinkOptionsSection.style.display = "none";
      }
      
      // Load category
      const categorySelect = document.getElementById("dessert-category");
      if (categorySelect) {
        categorySelect.value = product.category || "Postres";
      }
      
      // Load prices
      const priceInput = document.getElementById("dessert-price");
      const slicePriceInput = document.getElementById("dessert-slice-price");
      
      if (priceInput) {
        priceInput.value = product.price || 0;
      }
      
      if (slicePriceInput) {
        slicePriceInput.value = product.slicePrice || 0;
      }
    }
    
    // Update modal button to 'Update product'
    updateModalButton();
  }

  // Initialize modal button
  updateModalButton();

  // 'ADD +' button on the page
  const addNewBtn = document.querySelector('button[data-bs-target="#modal-drink"]');
  if (addNewBtn) {
    addNewBtn.addEventListener("click", () => {
      editingProductId = null;
      resetForm();
    });
  }
});