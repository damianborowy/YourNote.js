import express from "express";
import userController from "../controllers/UserController";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/isValidEmail/:email", userController.checkIfEmailExists);

export default router;
