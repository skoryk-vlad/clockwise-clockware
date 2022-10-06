import { ROLES } from './models/user.model';
export type AuthInfo = {
    email: string,
    password: string
}

export interface JWTUserPayload {
    id: number;
    role: ROLES
}

export type TableColumn = {
    value: string;
    columnTitle: string;
}
