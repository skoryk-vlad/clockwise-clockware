export type AuthInfo = {
    login: string,
    password: string
}

export interface JWTConfirmationPayload {
    orderId: number
}