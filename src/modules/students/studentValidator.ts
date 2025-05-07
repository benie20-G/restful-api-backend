import { z } from "zod";

export const studentSchema = z.object({
    firstName: z.string().min(2),
    lastName:z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export const validateStudent = (data: any) => {
    const user = studentSchema.safeParse(data);
    if (!user.success) {
        throw new Error(user.error.errors[0].message);
    }
    return user.data;
}

