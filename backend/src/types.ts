import { ROLES } from './models/user.model';
export type UserInfo = {
    email: string,
    name: string
}
export enum AUTH_SERVICES {
    GOOGLE = 'google',
    FACEBOOK = 'facebook'
}

export interface JWTUserPayload {
    id: number;
    role: ROLES
}

export enum MASTER_STATISTICS_FIELDS {
    ID = 'id',
    NAME = 'name',
    SMALL = 'small',
    MEDIUM = 'medium',
    BIG = 'big',
    COMPLETED = 'completed',
    NOT_COMPLETED = 'notCompleted',
    RATING = 'rating',
    EARNED = 'earned'
}