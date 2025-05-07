import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../../utils/bcrypt";
import { validateStudent } from './studentValidator';
import { generateToken } from '../../utils/jwt';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: students
 *   description: Everything about your Students
 */
export default class StudentsController {

    /**
     * @swagger
     * /students:
     *  post:
     *    description: Create a new student
     *    parameters:
     *      - in: body
     *        name: student
     *        description: The student to register.
     *        schema:
     *          type: object
     *          required:
     *            - firstName
     *            - lastName
     *            - email
     *            - password
     *          properties:
     *            firstName:
     *              type: string
     *            lastName:
     *              type: string
     *            email:
     *              type: string
     *            password:
     *              type: string
     *    responses:
     *      201:
     *        description: User created successfully
     *      400:
     *        description: User already exists
     *      500:
     *        description: Internal Server Error
     */
    public static async createStudent(req: Request, res: Response) {
        try {
            const student = validateStudent(req.body);

            const existingStudent = await prisma.student.findUnique({
                where: {
                    email: student.email
                },
            });
            if (existingStudent) {
                return res.status(400).json({
                    message: "User with that email already exists",
                });
            }
            const newStudent = await prisma.student.create({
                data: {
                    ...student,
                    password: await hashPassword(student.password),
                },
            });

            res.status(201).json({
                success: true,
                student: newStudent,
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
    * /students/login:
    *  post:
    *    description: Login a student
    *    parameters:
    *      - in: body
    *        name: student
    *        description: The student to login.
    *        schema:
    *          type: object
    *          required:
    *            - email
    *            - password
    *          properties:
    *            email:
    *              type: string
    *            password:
    *              type: string
    *    responses:
    *      200:
    *        description: Login successful
    *      400:
    *        description: Invalid email or password
    *      500:
    *        description: Internal Server Error
    */
    public static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const student = await prisma.student.findUnique({
                where: {
                    email,
                },
            });
            if (!student) {
                return res.status(400).json({
                    message: "Invalid email or password",
                });
            }
            const isPasswordValid = await comparePassword(password, student.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    message: "Invalid email or password",
                });
            }

            const token = generateToken(student.id);

            res.setHeader("Authorization", `Bearer ${token}`);
            res.status(200).json({
                success: true,
                student,
                token
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
     * /students/logout:
     *  get:
     *    description: Logout a student
     *    responses:
     *      200:
     *        description: Logout successful
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    public static async logout(req: Request, res: Response) {
        try {
            res.setHeader("Authorization", `Bearer `);
            res.status(200).json({
                success: true,
                message: "Logout successful"
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
 * /students/me:
 *  get:
 *    description: Get currently logged in student
 *    responses:
 *      200:
 *        description: Student details
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Internal Server Error
 */
    public static async getStudent(req: Request, res: Response) {
        try {
            const student = await prisma.student.findUnique({
                where: {
                    // @ts-ignore
                    id: req.user
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            });

            res.status(200).json({
                success: true,
                user: student
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
}