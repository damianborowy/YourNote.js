import express from "express";
import userController from "../controllers/UserController";
import auth from "../middlewares/Authentication";
import { admin } from "../middlewares/Authorization";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.use(auth);

router.get("/views", userController.getViews);
router.put("/views", userController.updateViews);
router.get("/isValidEmail/:email", userController.checkIfEmailExists);

router.use(admin);

router.get("/", userController.readAll);
router.post("/", userController.create);
router.put("/", userController.updateRole);
router.delete("/:email", userController.delete);

export default router;
