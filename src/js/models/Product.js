// models/Product.js
export class Product {
  constructor(id, title, description, image, isActive = true) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.isActive = isActive;
    this.createdAt = new Date().toISOString();
    this.type = "product"; // Por defecto
  }
}

export class DrinkProduct extends Product {
  constructor(id, title, description, image, isActive, section, sizes, temperatures, milks, extras, isPromo = false) {
    super(id, title, description, image, isActive);
    this.section = section;
    this.sizes = sizes || {};
    this.temperatures = temperatures || [];
    this.milks = milks || [];
    this.extras = extras || [];
    this.isPromo = isPromo;
    this.type = "drink";
  }
}

export class DessertProduct extends Product {
  constructor(id, title, description, image, isActive, price, isPromo = false, category = "Postres", slicePrice = 0) {
    super(id, title, description, image, isActive);
    this.price = price || 0; // Precio por pieza completa
    this.isPromo = isPromo;
    this.category = category; // Postres, Extras, Promociones
    this.slicePrice = slicePrice || 0; // Precio por rebanada (opcional)
    this.type = "dessert";
  }
}