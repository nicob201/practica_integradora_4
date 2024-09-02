import cartModel from "../dao/models/cartModel.js";
import userModel from "../dao/models/userModel.js";

// Devuelve los carritos
async function getCartsService() {
  return await cartModel.find().populate("products.product");
}

// Devuelve un carrito dado su ID
async function getCartByIdService(cid, userId) {
  const cart = await cartModel.findOne({ _id: cid, user: userId }).populate("products");
  return cart;
}

// Crea un nuevo carrito
async function createCartService(userId, productId, units = 1) {
  let cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    cart = await cartModel.create({
      user: userId,
      products: [{ product: productId, units }],
    });
    await cart.save();
    await userModel.findByIdAndUpdate(userId, {
      $push: { cart: { id: cart._id } },
    });
    return { message: "Success adding product to cart!" };
  }
  // Si ya existe el producto en el carrito, se agrega una unidad adicional a la cantidad que ya tenia
  const existingProduct = cart.products.find((item) => item.product._id.toString() === productId);
  if (existingProduct) {
    existingProduct.units += parseInt(units);
  } else {
    cart.products.push({ product: productId, units });
  }
  await cart.save();
  return { message: "Success adding product to cart!" };
}

// Borra un carrito
async function deleteCartService(cid) {
  return await cartModel.deleteOne({ _id: cid });
}

// Renderiza carritos
async function renderCartsService() {
  return await cartModel.find().populate("products.product").lean();
}

// Borra un producto determinado de un carrito
async function deleteProductFromCartService(cid, pid) {
  // primero se busca el carrito
  const cart = await cartModel.findById(cid);
  if (!cart) {
    throw new Error("Cart not found!");
  }
  // si se encuentra el carrito y el id del producto, se lo borra del carrito
  cart.products = cart.products.filter((product) => product.product._id != pid);
  await cart.save();
  return { message: "Success removing product from cart!" };
}

// Actualiza las cantidades de un producto en un carrito
async function updateProductUnitsService(cid, pid, units) {
  const cart = await cartModel.findById(cid);
  if (!cart) {
    throw new Error("Cart not found!");
  }

  const existingProduct = cart.products.find((item) => item.product._id.toString() === pid);
  if (existingProduct) {
    existingProduct.units += parseInt(units);
  } else {
    cart.products.push({ product: pid, units });
  }

  await cart.save();
  return { message: "Success updating product units in cart!" };
}

export {
  getCartsService,
  getCartByIdService,
  createCartService,
  deleteCartService,
  renderCartsService,
  deleteProductFromCartService,
  updateProductUnitsService
};