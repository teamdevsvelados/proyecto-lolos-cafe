export class Product {
  constructor(id, title, description, image, isActive = true) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.isActive = isActive;
    this.isNew = true; // Podrías cambiar esto a false después de X tiempo
    this.createdAt = new Date().toISOString();
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
  constructor(id, title, description, image, isActive, unitPrice, slicePrice, isPromo = false) {
    super(id, title, description, image, isActive);
    this.unitPrice = unitPrice || 0;
    this.slicePrice = slicePrice || 0;
    this.isPromo = isPromo;
    this.type = "dessert";
  }
}