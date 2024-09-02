// Errores al registrar usuarios
export const generateUserErrorInfo = (user) => {
  return `Una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    * first_name debe ser un string, recibido: ${user.first_name}
    * last_name debe ser un string, recibido: ${user.last_name}
    * email debe ser un string, recibido: ${user.email}
    `;
};

// Errores al generar un producto o actualizarlo
export const generateProductErrorInfo = (product) => {
  return `Una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    * title debe ser un string, recibido: ${product.title}
    * price debe ser un number, recibido: ${product.price}
    * stock debe ser un number, recibido: ${product.stock}
    `;
};

// Errores relacionados al carrito
export const generateCartErrorInfo = (cart) => {
  return `Una o mas propiedades estan incompletas o no son validas.
    Lista de propiedades requeridas:
    * productId debe ser un string, recibido: ${cart.productId}
    * units debe ser un number, recibido: ${cart.units}
    `;
};
