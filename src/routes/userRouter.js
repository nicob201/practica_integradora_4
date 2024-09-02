import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { uploader } from "../utils/utils.js";

const router = Router();

// Devuelve todos los usuarios
router.get("/", userController.getUsers);

// Devuelve un usuario por su id
router.get("/:uid", userController.getUserById);

// Crear usuario
router.post("/register", userController.createUser);

// Elimina un usuario dado su id
router.delete("/:uid", userController.deleteUserById);

// Modifica el rol del usuario
router.put("/premium/:uid", userController.changeUserRole);

// Permite subir archivos al usuario
router.post("/:uid/documents", uploader.array("documents", 3), userController.uploadDocuments);

export default router;
