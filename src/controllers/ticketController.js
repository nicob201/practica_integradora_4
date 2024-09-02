import {
  createTicketService,
  getTicketByIdService,
} from "../services/ticketService.js";

// Crear un ticket a partir del carrito del user
async function createTicket(req, res) {
  const { cid } = req.params;
  try {
    const ticket = await createTicketService(cid);
    if (!ticket) {
      return res
        .status(404)
        .send({ status: "error", error: "Cart not found!" });
    }
    res.send({ status: "success", payload: ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res
      .status(500)
      .send({ status: "error", error: "Failed to create ticket!" });
  }
}

// Devuelve un ticket por id
async function getTicketById(req, res) {
  const { tid } = req.params;
  try {
    const ticket = await getTicketByIdService(tid);
    if (!ticket) {
      return res
        .status(404)
        .send({ status: "error", error: "Ticket not found!" });
    }
    res.send({ status: "success", payload: ticket });
  } catch (error) {
    console.error("Error getting ticket:", error);
    res.status(500).send({ status: "error", error: "Failed to get ticket!" });
  }
}

export { createTicket, getTicketById };
