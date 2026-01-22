export class Product {
    constructor(id, name, description, category, image, isActive = true) {
        this.id = id || Date.now();
        this.name = name;
        this.description = description;
        this.category = category;
        this.image = image;
        this.price = price;
        this.isActive = isActive;
        this.createdAt = new Date();
    }
}

// HIJO: BEBIDA
export class DrinkProduct extends Product {
    constructor(
        id,
        name,
        description,
        image,
        price,
        isActive,
        sizes = ['pequeño', 'mediano', 'grande'],
        temperatures = ['fría', 'caliente'],
        milks = ['leche deslactosada', 'leche entera', 'leche de almendra', 'leche de soya'],
        toppings = []
    ) {
        super(id, name, description, category, image, price, isActive);
        this.sizes = sizes;
        this.temperatures = temperatures;
        this.milks = milks;
        this.toppings = toppings;
    }
}


// HIJO: POSTRE
export class DessertProduct extends Product {
    constructor(
        id,
        name,
        description,
        image,
        isActive,
        slicePrice = null
    ) {
        super(id, name, description, category, image, slicePrice, isActive);
        this.slicePrice = slicePrice;
    }
}