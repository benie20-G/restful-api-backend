import { z } from "zod";

export const bookSchema = z.object({
    name: z.string(),
    author: z.string(),
    publisher: z.string(),
    publicationYear:z.number().min(1000).max(2024),
    subject:z.string(),
});

export const validateBook = (data: any) => {
    const book = bookSchema.safeParse(data);
    if (!book.success) {
        throw new Error(book.error.errors[0].message);
    }
    return book.data;
};

export const validateBooks = (data: any) => {
    const books = z.array(bookSchema).safeParse(data);
    if (!books.success) {
        throw new Error(books.error.errors[0].message);
    }
    return books.data;
};