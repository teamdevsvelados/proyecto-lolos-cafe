import { DrinkProduct, DessertProduct } from "../models/Product.js";

const PRODUCTS_KEY = "products";
const ID_KEY = "currentId";

export class ProductsController {
  constructor() {
    this.products = [];
    this.currentId = 0;
  }

  addProduct(product) {
    this.products.push(product);
    this.saveToStorage();
  }

  createDrink(data) {
    this.currentId++;
    const drink = new DrinkProduct(this.currentId, ...data);
    this.addProduct(drink);
    return drink;
  }

  createDessert(data) {
    this.currentId++;
    const dessert = new DessertProduct(this.currentId, ...data);
    this.addProduct(dessert);
    return dessert;
  }

  getActiveProducts() {
    return this.products.filter(p => p.isActive);
  }

  saveToStorage() {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(this.products));
    localStorage.setItem(ID_KEY, String(this.currentId));
  }

  loadFromStorage() {
    const storedProducts = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
    const storedId = Number(localStorage.getItem(ID_KEY)) || 0;

    this.currentId = storedId;

    this.products = storedProducts.map(p => {
      // Drinks have "section"
      if (p.section !== undefined) {
        return new DrinkProduct(
          p.id,
          p.title,
          p.description,
          p.image,
          p.isActive,
          p.section,
          p.sizes,
          p.temperatures,
          p.milks,
          p.toppings
        );
      }

      return new DessertProduct(
        p.id,
        p.title,
        p.description,
        p.image,
        p.isActive,
        p.unitPrice,
        p.slicePrice
      );
    });
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.saveToStorage();
  }

  toggleActive(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) return null;
    product.isActive = !product.isActive;
    this.saveToStorage();
    return product.isActive;
  }

  updateProduct(id, newData) {
    const product = this.products.find(p => p.id === id);
    if (!product) return;
    Object.assign(product, newData); 
    this.saveToStorage();
  }
}
