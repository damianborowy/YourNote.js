import express from "express";
import noteController from "../controllers/NoteController";
import auth from "../middlewares/Authentication";
import fileUpload from "express-fileupload";
import { admin } from "../middlewares/Authorization";

const router = express.Router();

router.get("/public/:noteId", noteController.guestRead);

router.use(auth);

router.get("/", noteController.read);
router.post("/", noteController.create);
router.put("/", noteController.update);
router.delete("/:noteId", noteController.delete);

router.use(
    fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 }
    })
);

router.patch("/detach", noteController.detach);
router.post("/attach", noteController.attach);

router.use(admin);

router.get("/all", noteController.readAll);

export default router;
