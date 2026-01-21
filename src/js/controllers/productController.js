import { Product } from "../models/Product.js"

const getMenu = () => {}
const saveMenu = () => {}


export const addItem = (productName, productPrice, productCategory, productDescription) => {
    const newProduct = new Product(productName, productPrice, productCategory, productDescription)
    localStorage.setItem('menu-products', JSON.stringify(newProduct))
    alert('Producto agregado al menú')
}

export const editItem = id => {

}

export const deleteItem = id => {

}