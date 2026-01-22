import { ProductsController } from "./controllers/productController.js";
import { DrinkProduct, DessertProduct } from "./models/Product.js";

const controller = new ProductsController();
let editingProductId = null;

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTOS
  const modal = document.getElementById("product-modal");
  const openBtn = document.getElementById("open-modal");
  const closeBtn = document.getElementById("close-modal");

  const form = document.getElementById("product-form");
  const container = document.getElementById("products-container");

  const drinkFields = document.getElementById("drink-fields");
  const dessertFields = document.getElementById("dessert-fields");

  const imageInput = document.getElementById("product-image-input");
  const imagePreview = document.getElementById("product-image-preview");

  // CARGAR DESDE STORAGE
  controller.loadFromStorage();
  controller.products.forEach((product) => renderCard(product));

  // MODAL
  openBtn.addEventListener("click", () => modal.showModal());
  closeBtn.addEventListener("click", () => {
    editingProductId = null;
    modal.close();
    form.reset();
    imagePreview.src = "";
    imagePreview.style.display = "none";
  });

  // Mostrar campos según tipo
  document.querySelectorAll('input[name="product-type"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "drink") {
        drinkFields.style.display = "block";
        dessertFields.style.display = "none";
      } else {
        drinkFields.style.display = "none";
        dessertFields.style.display = "block";
      }
    });
  });

  dessertFields.style.display = "none";

  // Preview de imagen
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.src = "";
      imagePreview.style.display = "none";
    }
  });

  // SUBMIT FORM
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("product-title").value;
    const description = document.getElementById("product-description").value;
    const image = imagePreview.src || "";
    const isActive = document.getElementById("product-active").checked;

    // EDIT MODE (solo se editan campos generales)
    if (editingProductId) {
      controller.updateProduct(editingProductId, { title, description, image, isActive });

      container.innerHTML = "";
      controller.products.forEach((p) => renderCard(p));

      editingProductId = null;
      modal.close();
      form.reset();
      imagePreview.src = "";
      imagePreview.style.display = "none";
      return;
    }

    const type = document.querySelector('input[name="product-type"]:checked').value;

    let product;

    if (type === "drink") {
      const section = document.getElementById("product-section").value;

      const sizes = {};
      document.querySelectorAll("[data-size]").forEach((input) => {
        if (input.value) sizes[input.dataset.size] = Number(input.value);
      });

      const temperatures = Array.from(
        document.querySelectorAll('input[name="temperature"]:checked')
      ).map((t) => t.value);

      const milks = Array.from(document.querySelectorAll('input[name="milk"]:checked')).map(
        (m) => m.value
      );

      const toppings = Array.from(
        document.querySelectorAll('input[name="toppings"]:checked')
      ).map((t) => t.value);

      product = controller.createDrink([
        title,
        description,
        image,
        isActive,
        section,
        sizes,
        temperatures,
        milks,
        toppings,
      ]);
    } else {
      const unitPrice = document.getElementById("unit-price").value;
      const slicePrice = document.getElementById("slice-price").value;

      product = controller.createDessert([
        title,
        description,
        image,
        isActive,
        unitPrice ? Number(unitPrice) : null,
        slicePrice ? Number(slicePrice) : null,
      ]);
    }

    renderCard(product);
    form.reset();
    imagePreview.src = "";
    imagePreview.style.display = "none";
    modal.close();
  });

  // RENDER CARD
  function renderCard(product) {
    const card = document.createElement("div");
    card.className = "card mb-3";

    if (!product.isActive) card.style.opacity = "0.5";

    // Imagen
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.className = "card-img-top";
      img.alt = product.title;
      card.appendChild(img);
    }

    // Body
    const body = document.createElement("div");
    body.className = "card-body";

    const titleEl = document.createElement("h4");
    titleEl.className = "card-title";
    titleEl.textContent = product.title;

    const desc = document.createElement("p");
    desc.className = "card-text";
    desc.textContent = product.description;

    body.appendChild(titleEl);
    body.appendChild(desc);
    card.appendChild(body);

    // Footer
    const footer = document.createElement("div");
    footer.className = "card-footer d-flex justify-content-between align-items-center";

    // Precio
    const price = document.createElement("small");
    price.className = "text-muted";

    let basePrice = "N/A";
    if (product instanceof DrinkProduct) {
      const prices = Object.values(product.sizes);
      if (prices.length) basePrice = `$${Math.min(...prices)}`;
    }
    if (product instanceof DessertProduct) {
      const dessertBase = product.unitPrice ?? product.slicePrice;
      basePrice = dessertBase ? `$${dessertBase}` : "N/A";
    }

    price.textContent = `Desde ${basePrice}`;
    footer.appendChild(price);

    // Botones
    const btnContainer = document.createElement("div");

    // Editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.className = "btn btn-primary btn-sm me-2";
    editBtn.addEventListener("click", () => {
      editingProductId = product.id;

      document.getElementById("product-title").value = product.title;
      document.getElementById("product-description").value = product.description;
      document.getElementById("product-active").checked = product.isActive;

      imagePreview.src = product.image || "";
      imagePreview.style.display = product.image ? "block" : "none";

      modal.showModal();
    });
    btnContainer.appendChild(editBtn);

    // Activar / Desactivar (FIX: no doble toggle)
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = product.isActive ? "Desactivar" : "Activar";
    toggleBtn.className = "btn btn-warning btn-sm me-2";
    toggleBtn.addEventListener("click", () => {
      const newIsActive = controller.toggleActive(product.id);
      if (newIsActive === null) return;

      card.style.opacity = newIsActive ? "1" : "0.5";
      toggleBtn.textContent = newIsActive ? "Desactivar" : "Activar";
    });
    btnContainer.appendChild(toggleBtn);

    // Eliminar
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.addEventListener("click", () => {
      if (!confirm(`¿Eliminar "${product.title}"?`)) return;
      controller.deleteProduct(product.id);
      card.remove();
    });
    btnContainer.appendChild(deleteBtn);

    footer.appendChild(btnContainer);
    card.appendChild(footer);

    container.appendChild(card);
  }
});


