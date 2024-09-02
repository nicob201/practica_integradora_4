import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.js";
import * as ticketController from "../controllers/ticketController.js";

const router = Router();

// Rutas para GET
router.get("/:tid", isAuthenticated, ticketController.getTicketById);

// Rutas para POST
router.post("/:cid", isAuthenticated, ticketController.createTicket);

export default router;
