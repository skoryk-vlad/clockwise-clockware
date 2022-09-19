import { ROLES } from './models/user.model';
export type AuthInfo = {
    email: string,
    password: string
}
export interface JWTRolePayload {
    role: ROLES
}