import { ProductModel } from '../models/productModel.js';
import { ProductModalView } from './productModalView.js';
import { ProductModalController } from '../controllers/productModalController.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new ProductModel();

    const viewDrinks = new ProductModalView('modalDrinks');
    const viewDesserts = new ProductModalView('modalPostres');

    const controller = new ProductModalController(model, viewDrinks, viewDesserts);

    controller.init();
});
