import express from "express";
import noteController from "../controllers/NoteController";
import auth from "../middlewares/Authentication";

var router = express.Router();

router.use(auth);

router.get("/", noteController.read);
router.get("/public/:noteId", noteController.guestRead);
router.post("/", noteController.create);
router.put("/", noteController.update);
router.delete("/:noteId", noteController.delete);

export default router;
