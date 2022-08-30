export type City = {
    id: number,
    name: string
}
export type Master = {
    id: number,
    name: string,
    cities: number[]
}
export type Client = {
    id: number,
    name: string,
    email: string
}
export type Order = {
    id: number,
    client_id: number,
    master_id: number,
    city_id: number,
    watch_size: number,
    date: string,
    time: number,
    status_id: Status,
    rating: number
}
export type GetOrderResponse = {
    id: number,
    client: string,
    master: string,
    city: string,
    watch_size: number,
    date: string,
    time: number,
    status: string,
    rating: number
}
export type ChangeStatusOrderReq = {
    id: number,
    status_id: number,
    rating: number
}
export type Status = 1 | 2 | 3 | 4;

export type AuthInfo = {
    login: string,
    password: string
}
