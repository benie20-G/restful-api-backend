import { compare, hash } from "bcrypt";

/**
 *  A function to hash a password with bcrypt
 * @param password The password to hash
 * @returns 
 */
export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await hash(password, 10);
    return hashedPassword;
};


/**
 * a function to compare a password with an encrypted password
 * @param password  The password to compare
 * @param encryptedPassword  The encrypted password to compare with
 * @returns  A boolean value 
 */
export const comparePassword = async (password: string, encryptedPassword?: string): Promise<Boolean> => {
    if (!encryptedPassword) return false;
    return await compare(password, encryptedPassword);
}
