import { addItem } from "./controllers/productController.js";

const alertMessage = document.querySelector('#alert-message')

document.addEventListener('DOMContentLoaded', () => {
    const addItemBtn = document.querySelector('#addItem')
    if(addItemBtn) addItemBtn.addEventListener('click', (e) => btnAddItem(e))

})

function btnAddItem(e) {
    e.preventDefault()

    const productName = document.querySelector('#product-name').value.trim()
    const productPrice = document.querySelector('#product-price').value.trim()
    const productCategory = document.querySelector('#product-category').value.trim()
    const productDescription = document.querySelector('#product-description').value.trim()

    if(productName === '' || productPrice === '' || productCategory === '' || productDescription === '') {
        alertMessage.style.display = 'block'
        alertMessage.text = 'Todos los campos son obligatorios'
        setTimeout(() => {
            alertMessage.style.display = 'none'
        }, 3000);
        return
    }

    addItem(productName, productPrice, productCategory, productDescription)
}