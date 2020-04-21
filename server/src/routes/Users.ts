import express from "express";
import userController from "../controllers/UserController";
import auth from "../middlewares/Authentication";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.use(auth);

router.get("/isValidEmail/:email", userController.checkIfEmailExists);

export default router;
