import { ProductsController } from "./controllers/productController.js";
import { DrinkProduct, DessertProduct } from "./models/Product.js";

const controller = new ProductsController();
let editingProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS
  const modalEl = document.getElementById("modal-drink");
  const modal = new bootstrap.Modal(modalEl);
  const form = document.getElementById("product-form");
  
  // Campos específicos
  const drinkSection = document.getElementById("drink-section");
  const dessertSection = document.getElementById("dessert-section"); // Necesitaremos crearlo
  
  // Elementos de la imagen
  const imageInput = document.getElementById("productImage");
  const imagePreview = document.getElementById("previewImage");
  const dropzoneContent = document.getElementById("dropzoneContent");
  const previewWrapper = document.getElementById("previewWrapper");
  
  // Contenedor de productos (necesita existir en HTML)
  const container = document.querySelector(".row.g-4"); // Contenedor de las cards existentes

  // CARGAR DESDE STORAGE
  controller.loadFromStorage();
  controller.products.forEach((product) => renderCard(product));

  // Mostrar/ocultar campos según tipo de producto
  document.querySelectorAll('input[name="product-type"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "drink") {
        drinkSection.style.display = "block";
        // Ocultar sección de postres si existe
        if (dessertSection) dessertSection.style.display = "none";
      } else {
        drinkSection.style.display = "none";
        // Mostrar sección de postres si existe
        if (dessertSection) dessertSection.style.display = "block";
      }
    });
  });

  // SUBMIT FORM
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validar imagen
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
      // Si hay imagen existente en preview
      imageData = imagePreview.src.startsWith("blob:") ? "" : imagePreview.src;
      processFormSubmission(imageData);
    }
  });

  function processFormSubmission(imageData) {
    const title = document.getElementById("product-title").value;
    const description = document.getElementById("product-description").value;
    const isPromo = document.getElementById("prodPromo").checked;
    const isActive = document.getElementById("product-active").checked;
    const type = document.querySelector('input[name="product-type"]:checked').value;

    // EDIT MODE
    if (editingProductId) {
      controller.updateProduct(editingProductId, { 
        title, 
        description, 
        image: imageData, 
        isActive,
        isPromo 
      });

      container.innerHTML = "";
      controller.products.forEach((p) => renderCard(p));

      editingProductId = null;
      modal.hide();
      resetForm();
      return;
    }

    // CREATE NEW
    let product;

    if (type === "drink") {
      const section = document.getElementById("product-section").value;

      // Obtener tamaños y precios
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

      // Temperaturas
      const temperatures = Array.from(
        document.querySelectorAll('input[name="temperatures[]"]:checked')
      ).map((t) => t.value);

      // Leches
      const milks = Array.from(
        document.querySelectorAll('input[name="milks[]"]:checked')
      ).map((m) => m.value);

      // Extras
      const extras = Array.from(
        document.querySelectorAll('input[name="extras[]"]:checked')
      ).map((t) => t.value);

      product = controller.createDrink([
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
      // POSTRES - necesitarías crear campos específicos
      const unitPrice = 0; // Placeholder - necesitarías agregar este campo
      const slicePrice = 0; // Placeholder - necesitarías agregar este campo

      product = controller.createDessert([
        title,
        description,
        imageData,
        isActive,
        unitPrice,
        slicePrice,
        isPromo
      ]);
    }

    renderCard(product);
    modal.hide();
    resetForm();
  }

  function resetForm() {
    form.reset();
    // Resetear preview de imagen
    if (imagePreview.src.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview.src);
    }
    imagePreview.src = "";
    previewWrapper.classList.add("d-none");
    dropzoneContent.classList.remove("d-none");
    imageInput.value = "";
    
    // Resetear checkboxes de tamaños
    document.querySelectorAll('.size-check').forEach(check => {
      const input = document.getElementById(check.dataset.target);
      input.classList.add('d-none');
      input.value = '';
    });
    
    // Mostrar campos de bebida por defecto
    drinkSection.style.display = "block";
    if (dessertSection) dessertSection.style.display = "none";
  }

  // RENDER CARD (adaptado a tu HTML)
  function renderCard(product) {
    const col = document.createElement("div");
    col.className = "col-6 col-sm-4 col-md-3 mb-4 drink";
    
    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";
    card.setAttribute("data-bs-toggle", "modal");
    card.setAttribute("data-bs-target", "#modal-drink");
    
    // Evento para cargar datos en modal al hacer clic
    card.addEventListener("click", (e) => {
      if (e.target.closest('.card-actions')) return; // Evitar si se hace clic en botones
      loadProductIntoModal(product);
    });

    // Nuevo badge
    if (product.isNew) {
      const newBadge = document.createElement("p");
      newBadge.className = "new-drink col-12 text-center pt-1 pb-0";
      newBadge.textContent = "Nuevo";
      card.appendChild(newBadge);
    }

    // Imagen
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.className = "card-img-top";
      img.alt = product.title;
      card.appendChild(img);
    }

    // Card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body row";

    const title = document.createElement("p");
    title.className = "card-title col-6";
    title.textContent = product.title;

    const price = document.createElement("p");
    price.className = "price col-6 text-end";
    
    // Calcular precio mínimo
    let minPrice = "N/A";
    if (product instanceof DrinkProduct && Object.values(product.sizes).length > 0) {
      minPrice = `$${Math.min(...Object.values(product.sizes)).toFixed(2)}`;
    } else if (product instanceof DessertProduct) {
      const dessertPrice = product.unitPrice || product.slicePrice;
      minPrice = dessertPrice ? `$${dessertPrice.toFixed(2)}` : "N/A";
    }
    price.textContent = minPrice;

    const description = document.createElement("p");
    description.className = "card-text";
    description.textContent = product.description;

    cardBody.appendChild(title);
    cardBody.appendChild(price);
    cardBody.appendChild(description);
    
    // Botones de acción (footer)
    const cardFooter = document.createElement("div");
    cardFooter.className = "card-footer card-actions d-flex justify-content-between p-2";
    
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-primary";
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loadProductIntoModal(product);
      modal.show();
    });
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.textContent = "Eliminar";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`¿Eliminar "${product.title}"?`)) {
        controller.deleteProduct(product.id);
        col.remove();
      }
    });
    
    cardFooter.appendChild(editBtn);
    cardFooter.appendChild(deleteBtn);
    
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    col.appendChild(card);
    
    // Si el producto está inactivo, opacarlo
    if (!product.isActive) {
      card.style.opacity = "0.5";
    }
    
    container.appendChild(col);
  }

  function loadProductIntoModal(product) {
    editingProductId = product.id;
    
    // Cargar datos básicos
    document.getElementById("product-title").value = product.title;
    document.getElementById("product-description").value = product.description;
    document.getElementById("prodPromo").checked = product.isPromo || false;
    document.getElementById("product-active").checked = product.isActive;
    
    // Cargar imagen
    if (product.image) {
      imagePreview.src = product.image;
      previewWrapper.classList.remove("d-none");
      dropzoneContent.classList.add("d-none");
    }
    
    // Configurar tipo de producto
    if (product instanceof DrinkProduct) {
      document.querySelector('input[name="product-type"][value="drink"]').checked = true;
      drinkSection.style.display = "block";
      if (dessertSection) dessertSection.style.display = "none";
      
      // Cargar sección
      document.getElementById("product-section").value = product.section || "Con café";
      
      // Cargar tamaños y precios
      if (product.sizes.chico) {
        document.getElementById("size-ch").checked = true;
        document.getElementById("price-ch").value = product.sizes.chico;
        document.getElementById("price-ch").classList.remove("d-none");
      }
      if (product.sizes.mediano) {
        document.getElementById("size-m").checked = true;
        document.getElementById("price-m").value = product.sizes.mediano;
        document.getElementById("price-m").classList.remove("d-none");
      }
      if (product.sizes.grande) {
        document.getElementById("size-g").checked = true;
        document.getElementById("price-g").value = product.sizes.grande;
        document.getElementById("price-g").classList.remove("d-none");
      }
      
      // Cargar temperaturas (necesitas IDs correspondientes)
      if (product.temperatures) {
        // Implementar lógica para marcar checkboxes
      }
      
    } else if (product instanceof DessertProduct) {
      document.querySelector('input[name="product-type"][value="dessert"]').checked = true;
      drinkSection.style.display = "none";
      if (dessertSection) dessertSection.style.display = "block";
      
      // Cargar campos específicos de postres
      // Necesitarás implementar esto
    }
  }

  // Botón "Agregar producto" en el modal
  const addBtn = document.querySelector('.modal .btn-dark');
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      form.dispatchEvent(new Event('submit'));
    });
  }

  // Botón "AGREGAR +" en la página
  const addNewBtn = document.querySelector('button[data-bs-target="#modal-drink"]');
  if (addNewBtn) {
    addNewBtn.addEventListener("click", () => {
      editingProductId = null;
      resetForm();
    });
  }
});