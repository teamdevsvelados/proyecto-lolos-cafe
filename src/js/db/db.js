
export const drinksWithCoffee = [
    {
        id: 1,
        name: "Affogato",
        priceByTemperature: {
            hot: { ch: "60.00" }, // Solo existe en chico
            rocks: { ch: "60.00" },
            frappe: null
        },
        description: "Bebida helada con crema de chocolate y café espresso.",
        image: "/public/images/basic-menu/with-coffee/affogato.webp",
        badge: "Nuevo"
    },
    {
        id: 2,
        name: "Americano",
        priceByTemperature: {
            hot: { ch: "40.00", md: "45.00", lg: "50.00" },
            rocks: { ch: "40.00", md: "45.00", lg: "50.00" },
            frappe: null
        },
        description: "Café espresso con agua caliente.",
        image: "/public/images/basic-menu/with-coffee/americano.webp",
        badge: "Nuevo"
    },
    {
        id: 3,
        name: "Americano Limón",
        priceByTemperature: {
            hot: { ch: "45.00", md: "50.00", lg: "55.00" },
            rocks: { ch: "45.00", md: "50.00", lg: "55.00" },
            frappe: null
        },
        description: "Un café americano que combina la intensidad del espresso con un toque cítrico de limón.",
        image: "/public/images/basic-menu/with-coffee/americanolimon.webp",
        badge: "Nuevo"
    },
    {
        id: 4,
        name: "Coldbrew",
        priceByTemperature: {
            hot: { ch: "60.00", md: "65.00", lg: "70.00" },
            rocks: { ch: "60.00", md: "65.00", lg: "70.00" },
            frappe: null
        },
        description: "Café frío preparado con granos molidos y agua fría durante varias horas.",
        image: "/public/images/basic-menu/with-coffee/coldbrew.webp",
        badge: "Nuevo"
    },
    {
        id: 5,
        name: "Dirty Chai",
        priceByTemperature: {
            hot: { ch: "70.00", md: "80.00", lg: "90.00" },
            rocks: { ch: "70.00", md: "80.00", lg: "90.00" },
            frappe: { md: "85.00", lg: "95.00" }
        },
        description: "Un café con leche y especias que combina la intensidad del espresso con un toque de sabor especial.",
        image: "/public/images/basic-menu/with-coffee/dirtychai.webp",
        badge: "Nuevo"
    },
    {
        id: 6,
        name: "Espresso",
        priceByTemperature: {
            hot: { ch: "30.00" },
            rocks: { ch: "30.00" },
            frappe: null
        },
        description: "Espresso puro y concentrado, servido en una taza pequeña.",
        image: "/public/images/basic-menu/with-coffee/espresso.webp",
        badge: "Nuevo"
    },
    {
        id: 7,
        name: "Latte Regular",
        priceByTemperature: {
            hot: { ch: "45.00", md: "50.00", lg: "60.00" },
            rocks: { ch: "45.00", md: "50.00", lg: "60.00" },
            frappe: { md: "65.00", lg: "75.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso.",
        image: "/public/images/basic-menu/with-coffee/latte.webp",
        badge: "Nuevo"
    },
    {
        id: 8,
        name: "Latte Avellana",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y avellanas.",
        image: "/public/images/basic-menu/with-coffee/latteavellana.webp",
        badge: "Nuevo"
    },
    {
        id: 9,
        name: "Latte Caramelo Machiatto",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y caramelo.",
        image: "/public/images/basic-menu/with-coffee/lattecaramelomachiatto.webp",
        badge: "Nuevo"
    },
    {
        id: 10,
        name: "Latte Coco",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y coco.",
        image: "/public/images/basic-menu/with-coffee/lattecoco.webp",
        badge: "Nuevo"
    },
    {
        id: 11,
        name: "Latte Crema de Avellanas",
        priceByTemperature: {
            hot: { ch: "55.00", md: "65.00", lg: "75.00" },
            rocks: { ch: "55.00", md: "65.00", lg: "75.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y crema de avellanas.",
        image: "/public/images/basic-menu/with-coffee/lattecremaavellana.webp",
        badge: "Nuevo"
    },
    {
        id: 12,
        name: "Latte Crema Irlandesa",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y crema irlandesa.",
        image: "/public/images/basic-menu/with-coffee/lattecremairlandesa.webp",
        badge: "Nuevo"
    },
    {
        id: 13,
        name: "Latte Miel Canela",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y miel de canela.",
        image: "/public/images/basic-menu/with-coffee/lattemielcanela.webp",
        badge: "Nuevo"
    },
    {
        id: 14,
        name: "Latte Moka",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y moka.",
        image: "/public/images/basic-menu/with-coffee/lattemoka.webp",
        badge: "Nuevo"
    },
    {
        id: 15,
        name: "Latte Moka Blanco",
        priceByTemperature: {
            hot: { ch: "55.00", md: "65.00", lg: "75.00" },
            rocks: { ch: "55.00", md: "65.00", lg: "75.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y moka blanco.",
        image: "/public/images/basic-menu/with-coffee/lattemokablanco.webp",
        badge: "Nuevo"
    },
    {
        id: 16,
        name: "Latte Tres Leches",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y tres leches.",
        image: "/public/images/basic-menu/with-coffee/lattetresleches.webp",
        badge: "Nuevo"
    },
    {
        id: 17,
        name: "Latte Vainilla",
        priceByTemperature: {
            hot: { ch: "55.00", md: "60.00", lg: "70.00" },
            rocks: { ch: "55.00", md: "60.00", lg: "70.00" },
            frappe: { md: "75.00", lg: "85.00" }
        },
        description: "Ideal para quienes buscan una bebida suave y cremosa con un toque de sabor intenso y vainilla.",
        image: "/public/images/basic-menu/with-coffee/lattevainilla.webp",
        badge: "Nuevo"
    }
]

export const drinksWithoutCoffee = [
    {
        id: 1,
        name: "Arándano Tónico",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "75.00" }
        },
        description: "Refrescante mezcla de arándanos y agua tónica, perfecta para revitalizar tus sentidos.",
        image: "/public/images/basic-menu/without-coffee/arandanotonico.webp",
        badge: "Nuevo"
    },
    {
        id: 2,
        name: "Chai Latte",
        priceByTemperature: {
            hot: { ch: "65.00", md: "75.00", lg: "85.00" },
            rocks: { ch: "65.00", md: "75.00", lg: "85.00" },
            frappe: { md: "85.00", lg: "95.00" }
        },
        description: "Cremoso queso con chocolate, caramelo y trozos de nuez pecana.",
        image: "/public/images/basic-menu/without-coffee/chailatte.webp",
        badge: "Nuevo"
    },
    {
        id: 3,
        name: "Chai sin Azúcar",
        priceByTemperature: {
            hot: { ch: "70.00", md: "85.00", lg: "100.00" },
            rocks: { ch: "70.00", md: "85.00", lg: "100.00" },
            frappe: { md: "90.00", lg: "110.00" }
        },
        description: "Cremoso queso con chocolate, caramelo y trozos de nuez pecana.",
        image: "/public/images/basic-menu/without-coffee/chaisinazucar.webp",
        badge: "Nuevo"
    },
    {
        id: 4,
        name: "Chai Vainilla",
        priceByTemperature: {
            hot: { ch: "65.00", md: "75.00", lg: "85.00" },
            rocks: { ch: "65.00", md: "75.00", lg: "85.00" },
            frappe: { md: "85.00", lg: "95.00" }
        },
        description: "Deliciosa mezcla de vainilla y chai.",
        image: "/public/images/basic-menu/without-coffee/chaivainilla.webp",
        badge: "Nuevo"
    },
    {
        id: 5,
        name: "Chili Mango",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "80.00", lg: "90.00" }
        },
        description: "Disfruta del sabor dulce y picante del mango con un toque de chile.",
        image: "/public/images/basic-menu/without-coffee/chilimango.webp",
        badge: "Nuevo"
    },
    {
        id: 6,
        name: "Chocolate Caliente",
        priceByTemperature: {
            hot: { ch: "60.00", md: "65.00", lg: "70.00" },
            rocks: { ch: "60.00", md: "65.00", lg: "70.00" },
            frappe: null
        },
        description: "Chocolate caliente perfecto para acompañar tu momento.",
        image: "/public/images/basic-menu/without-coffee/chocolatecaliente.webp",
        badge: "Nuevo"
    },
    {
        id: 7,
        name: "Ferrero",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "90.00", lg: "100.00" }
        },
        description: "Delciciosa bebida con avellanas inspirada en el famoso chocolate.",
        image: "/public/images/basic-menu/without-coffee/ferrero.webp",
        badge: "Nuevo"
    },
    {
        id: 8,
        name: "Fresas con Crema",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "70.00", lg: "80.00" }
        },
        description: "Fresas frescas con crema batida.",
        image: "/public/images/basic-menu/without-coffee/fresasconcrema.webp",
        badge: "Nuevo"
    },
    {
        id: 9,
        name: "Matcha",
        priceByTemperature: {
            hot: { ch: "65.00", md: "75.00", lg: "85.00" },
            rocks: { ch: "65.00", md: "75.00", lg: "85.00" },
            frappe: { md: "80.00", lg: "90.00" }
        },
        description: "Bebida tradicional japonesa hecha con polvo de té verde.",
        image: "/public/images/basic-menu/without-coffee/matcha.webp",
        badge: "Nuevo"
    },
    {
        id: 10,
        name: "Mazapán",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "70.00", lg: "80.00" }
        },
        description: "Inspirada en el dulce tradicional mexicano, esta bebida combina sabores de almendra y vainilla.",
        image: "/public/images/basic-menu/without-coffee/mazapan.webp",
        badge: "Nuevo"
    },
    {
        id: 11,
        name: "Oreo",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "70.00", lg: "80.00" }
        },
        description: "Bebida hecha con galletas Oreo trituradas, leche y un toque de chocolate.",
        image: "/public/images/basic-menu/without-coffee/oreo.webp",
        badge: "Nuevo"
    },
    {
        id: 12,
        name: "Pay de Limón",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "70.00", lg: "80.00" }
        },
        description: "El equilibrio ideal entre frescura cítrica y un toque dulce.",
        image: "/public/images/basic-menu/without-coffee/paydelimon.webp",
        badge: "Nuevo"
    },
    {
        id: 13,
        name: "Pica Fresa",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "80.00", lg: "90.00" }
        },
        description: "Disfruta del sabor dulce y picante del mango con un toque de chile.",
        image: "/public/images/basic-menu/without-coffee/picafresa.webp",
        badge: "Nuevo"
    },
    {
        id: 14,
        name: "Piña Colada",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "70.00", lg: "80.00" }
        },
        description: "Una refrescante combinación de piña y coco.",
        image: "/public/images/basic-menu/without-coffee/piñacolada.webp",
        badge: "Nuevo"
    },
    {
        id: 15,
        name: "Taro",
        priceByTemperature: {
            hot: { ch: "55.00", md: "65.00", lg: "75.00" },
            rocks: { ch: "55.00", md: "65.00", lg: "75.00" },
            frappe: { md: "70.00", lg: "80.00" }
        },
        description: "Una bebida refrescante hecha con taro y una pizca de limón.",
        image: "/public/images/basic-menu/without-coffee/taro.webp",
        badge: "Nuevo"
    },
    {
        id: 16,
        name: "Espresso Tónico",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "75.00" }
        },
        description: "El equilibrio ideal entre frescura cítrica y un toque dulce.",
        image: "/public/images/basic-menu/without-coffee/espressotonico.webp",
        badge: "Nuevo"
    },
    {
        id: 17,
        name: "Espresso Tónico con Limón",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { md: "75.00" }
        },
        description: "El equilibrio ideal entre frescura cítrica y un toque dulce.",
        image: "/public/images/basic-menu/without-coffee/espressotonicolimon.webp",
        badge: "Nuevo"
    },
    {
        id: 18,
        name: "Soda Arándano",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "Una bebida refrescante hecha con arándanos y una pizca de limón.",
        image: "/public/images/basic-menu/without-coffee/sodaarandano.webp",
        badge: "Nuevo"
    },
    {
        id: 19,
        name: "Soda Fresa",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "Una bebida refrescante hecha con fresas y una pizca de limón.",
        image: "/public/images/basic-menu/without-coffee/sodafresa.webp",
        badge: "Nuevo"
    },
    {
        id: 20,
        name: "Soda Kiwi",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "Una bebida refrescante hecha con kiwis y una pizca de limón.",
        image: "/public/images/basic-menu/without-coffee/sodakiwi.webp",
        badge: "Nuevo"
    },
    {
        id: 21,
        name: "Soda Kiwi Fresa",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "Una bebida refrescante hecha con kiwis y fresas.",
        image: "/public/images/basic-menu/without-coffee/sodakiwifresa.webp",
        badge: "Nuevo"
    },
    {
        id: 22,
        name: "Soda Lavanda",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "Una bebida refrescante hecha con lavanda y una pizca de limón.",
        image: "/public/images/basic-menu/without-coffee/sodalavanda.webp",
        badge: "Nuevo"
    },
    {
        id: 23,
        name: "Soda Rosas",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "Una bebida refrescante hecha con rosas y una pizca de limón.",
        image: "/public/images/basic-menu/without-coffee/sodarosas.webp",
        badge: "Nuevo"
    },
    {
        id: 24,
        name: "Tisana Azul",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "El equilibrio ideal entre frescura cítrica y un toque dulce.",
        image: "/public/images/basic-menu/without-coffee/tisanaazul.webp",
        badge: "Nuevo"
    },
    {
        id: 25,
        name: "Tisana Roja",
        priceByTemperature: {
            hot: null,
            rocks: null,
            frappe: { lg: "75.00" }
        },
        description: "El equilibrio ideal entre frescura cítrica y un toque dulce.",
        image: "/public/images/basic-menu/without-coffee/tisanaroja.webp",
        badge: "Nuevo"
    }
]

export const desserts = [
    {
        id: 1,
        name: "Brownie",
        priceBySize: { slice: "65.00", full: "105.00" },
        description: "Cremoso queso con chocolate, caramelo y trozos de nuez pecana.",
        image: "/public/images/basic-menu/desserts/brownie.webp",
        badge: "Nuevo"
    },
    {
        id: 2,
        name: "Cheesecake Vasco",
        priceBySize: { slice: "75.00", full: "105.00" },
        description: "Cremoso queso con chocolate, caramelo y trozos de nuez pecana.",
        image: "/public/images/basic-menu/desserts/cheesecakevasco.webp",
        badge: "Nuevo"
    },
    {
        id: 3,
        name: "Cheesecake de Queso",
        priceBySize: { slice: "75.00", full: "105.00" },
        description: "Cremoso queso con chocolate, caramelo y trozos de nuez pecana.",
        image: "/public/images/basic-menu/desserts/cheesecakequeso.webp",
        badge: "Nuevo"
    },
    {
        id: 4,
        name: "Cheesecake Tortuga",
        priceBySize: { slice: "65.00", full: "105.00" },
        description: "Cremoso queso con chocolate, caramelo y trozos de nuez pecana.",
        image: "/public/images/basic-menu/desserts/cheesecaketortuga.webp",
        badge: "Nuevo"
    },
    {
        id: 5,
        name: "Chocoflan",
        priceBySize: { slice: "65.00", full: "105.00" },
        description: "La combinación perfecta entre pastel de chocolate y flan napolitano.",
        image: "/public/images/basic-menu/desserts/chocoflan.webp",
        badge: "Nuevo"
    },
    {
        id: 6,
        name: "Galleta Red Velvet",
        priceBySize: { slice: "65.00", full: "105.00" },
        description: "Galleta de chocolate con crema de vainilla y trozos de nuez.",
        image: "/public/images/basic-menu/desserts/galletaredvelvet.webp",
        badge: "Nuevo"
    },
    {
        id: 7,
        name: "Pastel de Zanahoria",
        priceBySize: { slice: "65.00", full: "105.00" },
        description: "Esponjoso bizcocho especiado con betún de queso crema artesanal.",
        image: "/public/images/basic-menu/desserts/pastelzanahoria.webp",
        badge: "Nuevo"
    },
    {
        id: 8,
        name: "Pay de Limón",
        priceBySize: { slice: "75.00", full: "105.00" },
        description: "El equilibrio ideal entre frescura cítrica y un toque dulce.",
        image: "/public/images/basic-menu/desserts/paydelimon.webp",
        badge: "Nuevo"
    },
    {
        id: 9,
        name: "Pay Lotus",
        priceBySize: { slice: "75.00", full: "105.00" },
        description: "Crujiente base de galleta con el inconfundible toque acaramelado Lotus.",
        image: "/public/images/basic-menu/desserts/paylotus.webp",
        badge: "Nuevo"
    },
    {
        id: 10,
        name: "Rol con Topping",
        priceBySize: { slice: "75.00", full: "105.00" },
        description: "Crujiente base de galleta con el inconfundible toque acaramelado Lotus.",
        image: "/public/images/basic-menu/desserts/rolcontopping.webp",
        badge: "Nuevo"
    },
    {
        id: 11,
        name: "Rol de Canela",
        priceBySize: { slice: "75.00", full: "105.00" },
        description: "Crujiente base de galleta con el inconfundible toque acaramelado Lotus.",
        image: "/public/images/basic-menu/desserts/roldecanela.webp",
        badge: "Nuevo"
    },
    {
        id: 12,
        name: "Tres Leches",
        priceBySize: { slice: "65.00", full: "105.00" },
        description: "Clásico irresistible, suave y profundamente bañado en nuestra mezcla secreta.",
        image: "/public/images/basic-menu/desserts/tresleches.webp",
        badge: "Nuevo"
    },
]

export const extras = [
    {
        id: 0,
        price: "0.00",
        name: "Sin extras"
    },
    {
        id: 1,
        price: "8.00",
        name: "Espresso"
    },
    {
        id: 2,
        price: "8.00",
        name: "Saborizante"
    },
    {
        id: 3,
        price: "15.00",
        name: "Bobba/Tapioca"
    },
    {
        id: 4,
        price: "15.00",
        name: "Nieve de vainilla"
    },
    {
        id: 5,
        price: "20.00",
        name: "Cheese foam"
    },
    {
        id: 6,
        price: "15.00",
        name: "Foam - Fresa"
    },
    {
        id: 7,
        price: "15.00",
        name: "Foam - Coco"
    },
    {
        id: 8,
        price: "15.00",
        name: "Foam - Vainilla"
    },
    {
        id: 9,
        price: "15.00",
        name: "Foam - Miel"
    },
]

export const milks = [
    {
        id: 1,
        name: "Regular",
        price: "0.00"
    },
    {
        id: 2,
        name: "Deslactosada",
        price: "8.00"
    },
    {
        id: 3,
        name: "Light",
        price: "8.00"
    },
    {
        id: 4,
        name: "Almendras",
        price: "10.00"
    },
    {
        id: 5,
        name: "Avena",
        price: "17.00"
    },
    {
        id: 6,
        name: "Soya",
        price: "10.00"
    },
    {
        id: 7,
        name: "Coco",
        price: "10.00"
    },
]