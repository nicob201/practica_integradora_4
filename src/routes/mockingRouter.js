import { Router } from "express";
import { getMockProducts } from "../controllers/mockingController.js";

const router = Router();

router.get("/mockingproducts", getMockProducts);

export default router;