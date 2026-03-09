export class ProductModalController {
    constructor(model, viewDrinks, viewDesserts) {
        this.model = model;
        this.viewDrinks = viewDrinks;
        this.viewDesserts = viewDesserts;
        this.currentProduct = null;
    }

    init() {
        const modalDrinksEl = document.getElementById('modalDrinks');
        const modalPostresEl = document.getElementById('modalPostres');

        if (modalDrinksEl) {
            modalDrinksEl.addEventListener('show.bs.modal', (event) => this.handleDrinkModalOpen(event));
        }

        if (modalPostresEl) {
            modalPostresEl.addEventListener('show.bs.modal', (event) => this.handleDessertModalOpen(event));
        }

        if (this.viewDrinks.els) {
            this.viewDrinks.bindChangeEvents(() => this.calculateTotal(this.viewDrinks));
        }
        if (this.viewDesserts.els) {
            this.viewDesserts.bindChangeEvents(() => this.calculateTotal(this.viewDesserts));
        }
    }

    async handleDrinkModalOpen(event) {
        const card = event.relatedTarget;
        if (!card || !card.classList.contains('product-card')) return;

        this.viewDrinks.clearOptions();

        const productHTMLData = JSON.parse(card.dataset.product);
        const productId = parseInt(productHTMLData.id);

        const datasetCategory = document.querySelector("[data-category]")?.getAttribute('data-category');
        const category = datasetCategory === 'with-coffee' ? 'with-coffee' : 'without-coffee';

        try {
            const [productData, milks, extras] = await Promise.all([
                this.model.getProductById(productId, category),
                this.model.getMilks(),
                this.model.getExtras()
            ]);

            this.currentProduct = productData;

            this.viewDrinks.renderHeader(productHTMLData); // Usamos los datos HTML como en el original para texto

            this.viewDrinks.renderCoffeeType(productData);

            this.viewDrinks.renderTemperatures(productData, (selectedTemp) => {
                this.calculateTotal(this.viewDrinks);
            });

            this.viewDrinks.renderSizes(productData);

            this.viewDrinks.renderMilks(milks, productData.allowsMilk);
            this.viewDrinks.renderExtras(extras, productData.allowsExtras);

            this.calculateTotal(this.viewDrinks);

        } catch (error) {
            console.error("Error cargando detalles de la bebida: ", error);
        }
    }

    async handleDessertModalOpen(event) {
        const card = event.relatedTarget;
        if (!card || !card.classList.contains('product-card')) return;

        this.viewDesserts.clearOptions();

        const productHTMLData = JSON.parse(card.dataset.product);
        const productId = parseInt(productHTMLData.id);

        try {
            const productData = await this.model.getProductById(productId, "desserts");
            this.currentProduct = productData;

            this.viewDesserts.renderHeader(productHTMLData);
            this.viewDesserts.renderDessertSizes(productData);

            this.calculateTotal(this.viewDesserts);

        } catch (error) {
            console.error("Error cargando detalles del postre: ", error);
        }
    }

    calculateTotal(viewActiva) {
        if (!this.currentProduct) return;

        const selections = viewActiva.getSelections();

        const total = (selections.sizePrice + selections.milkPrice + selections.extraPrice) * selections.quantity;

        viewActiva.updateTotalDisplay(total);
    }
}
