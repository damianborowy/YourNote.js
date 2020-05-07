import express from "express";
import noteController from "../controllers/NoteController";
import auth from "../middlewares/Authentication";
import { admin } from "../middlewares/Authorization";
import fileUpload from "express-fileupload";

const router = express.Router();

router.get("/public/:noteId", noteController.guestRead);

router.use(auth);

router.get("/", noteController.read);
router.post("/", noteController.create);
router.put("/", noteController.update);
router.delete("/:noteId", noteController.delete);

router.use(admin);

router.get("/:email", noteController.adminRead);

router.use(
    fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 }
    })
);

router.post("/attach", noteController.attach);

export default router;
