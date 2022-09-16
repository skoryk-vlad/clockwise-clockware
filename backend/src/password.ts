import bcrypt from 'bcrypt';

export const generatePassword = (): string => {
    const chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array(8 + Math.floor(Math.random() * 5)).fill(chars[0])
        .map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
};
export const encryptPassword = (password: string) => {
    const saltRounds: number = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
};