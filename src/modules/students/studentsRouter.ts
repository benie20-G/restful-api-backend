import { Router } from "express";
import StudentsController from "./studentsController";
import isAuthenticated from "../../middlewares/auth";

const router = Router();

router.post("/register", StudentsController.createStudent);
router.post("/login", StudentsController.login);
router.get("/me", isAuthenticated, StudentsController.getStudent);
router.get("/logout", isAuthenticated, StudentsController.logout);

const studentsRouter = router;
export default studentsRouter;