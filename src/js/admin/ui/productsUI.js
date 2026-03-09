/**
 * Renderiza productos filtrados por categoría
 */
export function renderProductsByCategory({
  categoryName,
  controller,
  container,
  handlers
}) {
  if (!container || !controller) return;

  container.innerHTML = "";

  const categoryMap = {
    "CON CAFÉ": "Con café",
    "SIN CAFÉ": "Sin café",
    "POSTRES": "Postres",
    "EXTRAS": "Extras",
    "PROMOCIONES": "Promociones"
  };

  const filterValue = categoryMap[categoryName] || categoryName;

  const filtered = controller.products.filter(product => {
    if (product.type === "drink") {
      return product.section === filterValue;
    }
    if (product.type === "dessert") {
      return product.category === filterValue;
    }
    return false;
  });

  if (filtered.length === 0) {
    showEmptyState(filterValue, container);
    return;
  }

  filtered.forEach(product =>
    renderProductCard(product, container, handlers)
  );
}

/**
 * Renderiza todos los productos
 */
export function renderAllProducts(controller, container, handlers) {
  if (!container || !controller) return;

  container.innerHTML = "";

  if (controller.products.length === 0) {
    showEmptyState("esta sección", container);
    return;
  }

  controller.products.forEach(product =>
    renderProductCard(product, container, handlers)
  );
}

/**
 * Renderiza una card de producto
 */
export function renderProductCard(product, container, handlers = {}) {
  const {
    onEdit,
    onToggle,
    onDelete
  } = handlers;

  const col = document.createElement("div");
  col.className = "col-6 col-sm-4 col-md-3 mb-4";

  const card = document.createElement("div");
  card.className = "card h-100";
  card.style.cursor = "pointer";
  if (!product.isActive) card.style.opacity = "0.6";

  // Badge promo
  if (product.isPromo) {
    const badge = document.createElement("p");
    badge.className = "new-drink text-center bg-warning text-dark mb-0";
    badge.textContent = "PROMO";
    card.appendChild(badge);
  }

  // Imagen
  const imgContainer = document.createElement("div");
  imgContainer.className = "position-relative";

  if (product.image) {
    const img = document.createElement("img");
    img.src = product.image;
    img.className = "card-img-top";
    img.style.height = "180px";
    img.style.objectFit = "cover";
    imgContainer.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className =
      "card-img-top d-flex align-items-center justify-content-center";
    placeholder.style.height = "180px";
    placeholder.style.backgroundColor =
      product.type === "drink" ? "#f8f9fa" : "#fff3cd";

    const icon = document.createElement("i");
    icon.className =
      product.type === "drink"
        ? "bi bi-cup-straw fs-1 text-muted"
        : "bi bi-cake fs-1 text-muted";

    placeholder.appendChild(icon);
    imgContainer.appendChild(placeholder);
  }

  card.appendChild(imgContainer);

  // Body
  const body = document.createElement("div");
  body.className = "card-body row";

  const title = document.createElement("p");
  title.className = "card-title col-6";
  title.textContent = product.title || "Sin nombre";

  const price = document.createElement("p");
  price.className = "price col-6 text-end";

  if (product.type === "drink" && product.sizes) {
    const prices = Object.values(product.sizes);
    price.textContent = prices.length
      ? `$${Math.min(...prices).toFixed(2)}`
      : "$0.00";
  } else {
    price.textContent = `$${(product.price || 0).toFixed(2)}`;
  }

  const desc = document.createElement("p");
  desc.className = "card-text";
  desc.textContent = product.description || "Sin descripción";

  body.append(title, price, desc);
  card.appendChild(body);

  // Footer actions
  const footer = document.createElement("div");
  footer.className = "card-footer p-2";

  const actions = document.createElement("div");
  actions.className = "d-flex justify-content-between";

  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-sm btn-outline-primary";
  editBtn.textContent = "Editar";
  editBtn.onclick = e => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const toggleBtn = document.createElement("button");
  toggleBtn.className = product.isActive
    ? "btn btn-sm btn-outline-warning"
    : "btn btn-sm btn-outline-success";
  toggleBtn.textContent = product.isActive ? "Desactivar" : "Activar";
  toggleBtn.onclick = e => {
    e.stopPropagation();
    onToggle?.(product);
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-sm btn-outline-danger";
  deleteBtn.textContent = "Eliminar";
  deleteBtn.onclick = e => {
    e.stopPropagation();
    onDelete?.(product);
  };

  actions.append(editBtn, toggleBtn, deleteBtn);
  footer.appendChild(actions);
  card.appendChild(footer);

  card.onclick = () => onEdit?.(product);

  col.appendChild(card);
  container.appendChild(col);
}

/**
 * Estado vacío
 */
export function showEmptyState(category, container) {
  container.innerHTML = `
    <div class="col-12 text-center py-5">
      <i class="bi bi-emoji-frown fs-1 text-muted"></i>
      <h5 class="text-muted mb-2">No hay productos en ${category}</h5>
      <p class="text-muted">Haz clic en "AGREGAR +" para agregar uno</p>
    </div>
  `;
}

// This code has a preliminar version so it's not complete or defintive, commentaries on spanish must be changed