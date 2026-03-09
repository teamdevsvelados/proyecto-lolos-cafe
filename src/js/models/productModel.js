import { desserts, drinks, extras, milks } from "../db/db.js";

export class ProductModel {

    async getProductById(id, category) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let productList = [];
                if (category === 'with-coffee') {
                    productList = drinks.filter(d => d.category === 'coffee');
                } else if (category === 'without-coffee') {
                    productList = drinks.filter(d => d.category === 'no-coffee');
                } else {
                    productList = desserts;
                }

                const product = productList.find(p => p.id === id);
                if (product) {
                    resolve(product);
                } else {
                    reject(new Error("Producto no encontrado"));
                }
            }, 100);
        });
    }
    async getMilks() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(milks);
            }, 50);
        });
    }

    async getExtras() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(extras);
            }, 50);
        });
    }
}
