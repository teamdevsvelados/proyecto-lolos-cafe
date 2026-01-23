// controllers/productController.js
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
      // Si tiene la propiedad "type" (nueva versión)
      if (p.type === "drink") {
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
          p.extras,
          p.isPromo || false
        );
      } else if (p.type === "dessert") {
        return new DessertProduct(
          p.id,
          p.title,
          p.description,
          p.image,
          p.isActive,
          p.price || p.unitPrice || 0,
          p.isPromo || false,
          p.category || "Postres",
          p.slicePrice || 0
        );
      }
      
      // Para compatibilidad con versiones anteriores (sin propiedad type)
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
          p.extras,
          p.isPromo || false
        );
      }

      // Asumir que es un postre antiguo
      return new DessertProduct(
        p.id,
        p.title,
        p.description,
        p.image,
        p.isActive,
        p.unitPrice || p.slicePrice || 0,
        p.isPromo || false,
        "Postres",
        p.slicePrice || 0
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

  // MÉTODO ACTUALIZADO PARA MANEJAR CAMBIOS DE TIPO
  updateProduct(id, newProductData) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    // Reemplazar el producto completo
    this.products[index] = newProductData;
    this.saveToStorage();
    
    return this.products[index];
  }

  // NUEVO MÉTODO: Verificar si un producto existe
  getProductById(id) {
    return this.products.find(p => p.id === id);
  }
}
