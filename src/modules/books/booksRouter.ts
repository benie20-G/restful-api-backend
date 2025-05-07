import { Router } from "express";
import BooksController from "./booksController";
const router = Router();

router.post("/", BooksController.createBook);
router.post("/multiple", BooksController.createMultipleBooks)
router.get("/", BooksController.getBooks);
router.put("/:id", BooksController.updateBook);
router.delete("/:id", BooksController.deleteBook);



const booksRouter = router;
export default booksRouter;