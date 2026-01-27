// /src/js/productRenderer.js

import { DrinkProduct, DessertProduct } from "./models/Product.js";

// Determinar si un producto es nuevo
function isProductNew(product) {
  if (!product.createdAt) return false;
  const createdDate = new Date(product.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

// Crear badge para producto
function createProductBadge(product) {
  if (product.isPromo) {
    const promoBadge = document.createElement("p");
    promoBadge.className = "new-drink col-12 text-center pt-1 pb-0 bg-warning text-dark";
    promoBadge.textContent = "PROMO";
    return promoBadge;
  } else if (isProductNew(product)) {
    const newBadge = document.createElement("p");
    newBadge.className = "new-drink col-12 text-center pt-1 pb-0";
    newBadge.textContent = "Nuevo";
    return newBadge;
  }
  return null;
}

// Crear contenedor de imagen
function createImageContainer(product) {
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
    // Placeholder basado en tipo
    const placeholder = document.createElement("div");
    placeholder.className = "card-img-top d-flex align-items-center justify-content-center";
    placeholder.style.height = "180px";
    placeholder.style.backgroundColor = (product.type === 'drink') ? "#f8f9fa" : "#fff3cd";
    
    const icon = document.createElement("i");
    icon.className = (product.type === 'drink') ? "bi bi-cup-straw fs-1 text-muted" : "bi bi-cake fs-1 text-muted";
    placeholder.appendChild(icon);
    imgContainer.appendChild(placeholder);
  }
  
  return imgContainer;
}

// Crear cuerpo de la tarjeta
function createCardBody(product) {
  const cardBody = document.createElement("div");
  cardBody.className = "card-body row";

  const title = document.createElement("p");
  title.className = "card-title col-6";
  title.textContent = product.title || "Sin nombre";

  const price = document.createElement("p");
  price.className = "price col-6 text-end";
  
  // Calcular precio
  if (product.type === 'drink' || product instanceof DrinkProduct) {
    if (product.sizes && Object.values(product.sizes).length > 0) {
      const prices = Object.values(product.sizes);
      price.textContent = `$${Math.min(...prices).toFixed(2)}`;
    } else {
      price.textContent = "$0.00";
    }
  } else {
    // Para postres, mostrar 'Desde $precio' si hay precio por rebanada
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
  
  return cardBody;
}

// Crear acciones de la tarjeta
function createCardActions(product, onEdit, onToggle, onDelete) {
  const cardFooter = document.createElement("div");
  cardFooter.className = "card-footer card-actions p-2";
  
  const btnGroup = document.createElement("div");
  btnGroup.className = "d-flex justify-content-between";
  
  // Botón Editar
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-sm btn-outline-primary";
  editBtn.textContent = "Editar";
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onEdit(product);
  });
  
  // Botón Activar/Desactivar
  const toggleBtn = document.createElement("button");
  toggleBtn.className = product.isActive 
    ? "btn btn-sm btn-outline-warning" 
    : "btn btn-sm btn-outline-success";
  toggleBtn.textContent = product.isActive ? "Desactivar" : "Activar";
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onToggle(product);
  });
  
  // Botón Eliminar
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-outline-danger";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    onDelete(product);
  });
  
  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(toggleBtn);
  btnGroup.appendChild(deleteBtn);
  cardFooter.appendChild(btnGroup);
  
  return cardFooter;
}

// Renderizar tarjeta de producto
export function renderProductCard(product, container, controller, onCardClick) {
  const col = document.createElement("div");
  col.className = "col-6 col-sm-4 col-md-3 mb-4";
  
  const card = document.createElement("div");
  card.className = "card h-100";
  card.style.cursor = "pointer";
  
  // Si el producto está inactivo, hacerlo opaco
  if (!product.isActive) {
    card.style.opacity = "0.6";
  }

  // Badge 'Nuevo' o 'Promo'
  const badge = createProductBadge(product);
  if (badge) {
    card.appendChild(badge);
  }

  // Imagen
  const imgContainer = createImageContainer(product);
  card.appendChild(imgContainer);

  // Cuerpo de la tarjeta
  const cardBody = createCardBody(product);
  card.appendChild(cardBody);

  // Acciones
  const cardActions = createCardActions(
    product,
    (p) => onCardClick(p), // onEdit
    (p) => {
      const newState = controller.toggleActive(p.id);
      if (newState !== null) {
        // Actualizar visualmente la tarjeta
        card.style.opacity = newState ? "1" : "0.6";
        const toggleBtn = card.querySelector('.card-actions .btn:nth-child(2)');
        if (toggleBtn) {
          toggleBtn.textContent = newState ? "Desactivar" : "Activar";
          toggleBtn.className = newState 
            ? "btn btn-sm btn-outline-warning" 
            : "btn btn-sm btn-outline-success";
        }
      }
    }, // onToggle
    (p) => {
      if (confirm(`¿Eliminar "${p.title}"? Esta acción no se puede deshacer.`)) {
        controller.deleteProduct(p.id);
        // Recargar vista
        const activeCategory = document.querySelector('.top-buttons .btn.active')?.textContent.trim() || 'POSTRES';
        // Necesitarías pasar la función de filtrado aquí
      }
    } // onDelete
  );
  card.appendChild(cardActions);

  // Abrir modal al hacer clic en la tarjeta
  card.addEventListener("click", (e) => {
    if (!e.target.closest('button')) {
      onCardClick(product);
    }
  });
  
  col.appendChild(card);
  container.appendChild(col);
}