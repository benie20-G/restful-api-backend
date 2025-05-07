import { validateBook, validateBooks } from './bookValidator';
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prismaClient = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: books
 *   description: Everything about your Books
 */
export default class BooksController {

    /**
 * @swagger
 * /books:
 *  post:
 *    tags:
 *      - books
 *    description: Create a new book
 *    parameters:
 *      - in: body
 *        name: book
 *        description: The book to create.
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - author
 *            - publisher
 *            - publicationYear
 *            - subject
 *          properties:
 *            name:
 *              type: string
 *            author:
 *              type: string
 *            publisher:
 *              type: string
 *            publicationYear:
 *              type: integer
 *            subject:
 *              type: string
 *    responses:
 *      201:
 *        description: Book created successfully
 *      404:
 *        description: Invalid Body
 *      500:
 *        description: Internal Server Error
 */
    public static async createBook(req: Request, res: Response) {
        try {
            const book = validateBook(req.body);

            const newBook = await prismaClient.book.create({
                data: book
            });

            res.status(201).json({
                success: true,
                book: newBook
            })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    /**
   * @swagger
   * /books/multiple:
   *  post:
   *    tags:
   *     - books
   *    description: Create multiple books
   *    requestBody:
   *      content:
   *        application/json:
   *          schema:
   *            type: array
   *            items:
   *              type: object
   *              required:
   *                - name
   *                - author
   *                - publisher
   *                - publicationYear
   *                - subject
   *              properties:
   *                name:
   *                  type: string
   *                author:
   *                  type: string
   *                publisher:
   *                  type: string
   *                publicationYear:
   *                  type: integer
   *                subject:
   *                  type: string
   *    responses:
   *      201:
   *        description: Books created successfully
   *      404:
   *        description: Invalid Body
   *      500:
   *        description: Internal Server Error
   */
    public static async createMultipleBooks(req: Request, res: Response) {
        try {
            const books = validateBooks(req.body);
            const newBooks = await prismaClient.book.createMany({
                data: books
            });
            res.status(201).json({
                success: true,
                books: newBooks
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    /**
  * @swagger
  * /books:
  *  get:
  *    tags:
  *    - books
  *    description: Get all Books
  *    responses:
  *      200:
  *        description: List of books
  *      500:
  *        description: Internal Server Error
  */
    public static async getBooks(req: Request, res: Response) {
        try {
            const books = await prismaClient.book.findMany();
            res.status(200).json({
                success: true,
                books
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    /**
 * @swagger
 * /books/{id}:
 *  put:
 *    tags:
 *     - books
 *    description: Update a book
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID of the book to update
 *      - in: body
 *        name: book
 *        description: The book data to update.
 *        schema:
 *          type: object
 *          required:
 *            - name
 *            - author
 *            - publisher
 *            - publicationYear
 *            - subject
 *          properties:
 *            name:
 *              type: string
 *            author:
 *              type: string
 *            publisher:
 *              type: string
 *            publicationYear:
 *              type: integer
 *            subject:
 *              type: string
 *    responses:
 *      200:
 *        description: Book updated successfully
 *      404:
 *        description: Book not found
 *      500:
 *        description: Internal Server Error
 */
    public static async updateBook(req: Request, res: Response) {
        try {
            const bookId = req.params.id;
            const book = validateBook(req.body);

            const existingBook = await prismaClient.book.findUnique({
                where: {
                    id: parseInt(bookId)
                }
            });
            if (!existingBook) {
                return res.status(404).json({
                    message: "Book not found"
                })
            }
            const updatedBook = await prismaClient.book.update({
                where: {
                    id: parseInt(bookId),
                },
                data: book
            });

            res.status(200).json({
                success: true,
                book: updatedBook
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }

    /**
  * @swagger
  * /books/{id}:
  *  delete:
  *    tags:
  *     - books
  *    description: Delete a book
  *    parameters:
  *      - in: path
  *        name: id
  *        schema:
  *          type: string
  *        required: true
  *        description: ID of the book to delete
  *    responses:
  *      200:
  *        description: Book deleted successfully
  *      404:
  *        description: Book not found
  *      500:
  *        description: Internal Server Error
  */
    public static async deleteBook(req: Request, res: Response) {
        try {
            const bookId = req.params.id;

            const book = await prismaClient.book.delete({
                where: {
                    id: parseInt(bookId),
                }
            });
            if (!book) {
                return res.status(404).json({
                    message: "Product not found"
                })
            }
            res.status(200).json({
                success: true,
                book
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
}