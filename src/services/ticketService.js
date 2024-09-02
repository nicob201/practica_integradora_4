import ticketModel from "../dao/models/ticketModel.js";
import cartModel from "../dao/models/cartModel.js";
import emailService from "../services/emailService.js";
import { nanoid } from "nanoid";
import config from "../config/config.js";

const { sendEmailTicket } = emailService;

// Crea un ticket a partir del carrito
async function createTicketService(cid) {

  const cart = await cartModel.findById(cid).populate("products.product");

  const products = cart.products.map(item => ({
    product: item.product._id,
    title: item.product.title,
    units: item.units,
    price: item.product.price,
    total: item.units * item.product.price
  }));

  const totalAmount = products.reduce((acc, item) => acc + item.total, 0);

  const ticket = await ticketModel.create({
    amount: totalAmount,
    purchaser: cart.user,
    code: nanoid(10),
    products: products
  });

  // Detalle de los productos en formato HTML para el email
  const productDetails = products.map(item => `
          <tr>
            <td>${item.title}</td>
            <td>${item.units}</td>
            <td>${item.price}</td>
            <td>${item.total}</td>
          </tr>
        `).join("");

  const emailHTML = `
          <h1>Detalle de tu compra</h1>
          <p>Gracias por tu compra! Detalle de los productos:</p>
          <p><strong>Número de Orden:</strong> ${ticket.code}</p>
          <table border="1">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productDetails}
            </tbody>
          </table>
          <p>Total: $ ${totalAmount}</p>
        `;

  // Enviar email al comprador
  await sendEmailTicket(config.MAILING_EMAIL, "Detalle de tu compra", "", emailHTML);

  return ticket;
}

// Devuelve el ticket dado su id
async function getTicketByIdService(tid) {
  const ticket = await ticketModel.findById(tid).populate("products.product");
  if (!ticket) {
    throw new Error("Ticket not found!");
  }
  return ticket;
}

export {
  createTicketService,
  getTicketByIdService
};
