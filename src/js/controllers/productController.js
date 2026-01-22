import { Product, DrinkProduct, DessertProduct } from "../models/Product.js"
const STORAGE_KEY = 'menu-products'

const getMenu = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Error al obtener menú:', error)
        return []
    }
}
const saveMenu = () => {}


export const addDrinkProduct = (
    name,
    description,
    image,
    price,
    category, // ej: "Café", "Sin café"
    sizes = ['pequeño', 'mediano', 'grande'],
    temperatures = ['fría', 'caliente'],
    milks = ['leche deslactosada', 'leche entera', 'leche de almendra', 'leche de soya'],
    toppings = []
) => {
    try {
        const menu = getMenu()
        // aqui si no hay nada en el menú devuelve un arreglo vacío
        
        const newDrink = new DrinkProduct(
            null, // null para que se use el id de date.now()
            name,
            description,
            image,
            price,
            true,
            category,
            sizes,
            temperatures,
            milks,
            toppings
        )
        menu.push(newDrink)
        saveMenu(menu)
        return { success: true, message: 'Bebida agregada al menú' }
    } catch (error) {
        return { success: false, message: error.message }
    }
}