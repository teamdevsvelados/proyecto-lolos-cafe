export class Product {
  constructor(id, title, description, image, isActive = true) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.isActive = isActive;
    this.createdAt = new Date().toISOString();
  }
}

export class DrinkProduct extends Product {
  constructor(
    id,
    title,
    description,
    image,
    isActive,
    section,
    sizes,
    temperatures,
    milks,
    toppings
  ) {
    super(id, title, description, image, isActive);
    this.section = section;       // "Con café" / "Sin café"
    this.sizes = sizes;           // { Chico: 45, Mediano: 55 }
    this.temperatures = temperatures; // ["Caliente", "Frío"]
    this.milks = milks;           // ["Regular", "Coco"]
    this.toppings = toppings;     // ["Tapioca", "Foam"]
  }
}

export class DessertProduct extends Product {
  constructor(
    id,
    title,
    description,
    image,
    isActive,
    unitPrice,
    slicePrice
  ) {
    super(id, title, description, image, isActive);
    this.unitPrice = unitPrice;   // number | null
    this.slicePrice = slicePrice; // number | null
  }
}