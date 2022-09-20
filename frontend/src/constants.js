export const ORDER_STATUSES = {
    AWAITING_CONFIRMATION: 'awaiting confirmation',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELED: 'canceled'
}
export const ORDER_STATUSES_TRANSLATE = {
    [ORDER_STATUSES.AWAITING_CONFIRMATION]: 'Ожидает подтверждения',
    [ORDER_STATUSES.CONFIRMED]: 'Подтвержден',
    [ORDER_STATUSES.COMPLETED]: 'Выполнен',
    [ORDER_STATUSES.CANCELED]: 'Отменен'
}

export const ORDER_MASTER_STATUSES = {
    NOT_COMPLETED: 'not completed',
    COMPLETED: 'completed'
}
export const ORDER_MASTER_STATUSES_TRANSLATE = {
    [ORDER_MASTER_STATUSES.NOT_COMPLETED]: 'Не закончен',
    [ORDER_MASTER_STATUSES.COMPLETED]: 'Закончен'
}

export const CLIENT_STATUSES = {
    NOT_CONFIRMED: 'not confirmed',
    CONFIRMED: 'confirmed'
}
export const CLIENT_STATUSES_TRANSLATE = {
    [CLIENT_STATUSES.NOT_CONFIRMED]: 'Не подтвержден',
    [CLIENT_STATUSES.CONFIRMED]: 'Подтвержден'
}

export const MASTER_STATUSES = {
    NOT_CONFIRMED: 'not confirmed',
    CONFIRMED: 'confirmed',
    APPROVED: 'approved'
}
export const MASTER_STATUSES_TRANSLATE = {
    [MASTER_STATUSES.NOT_CONFIRMED]: 'Не подтвержден',
    [MASTER_STATUSES.CONFIRMED]: 'Подтвержден',
    [MASTER_STATUSES.APPROVED]: 'Одобрен'
}

export const WATCH_SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    BIG: 'big'
}
export const WATCH_SIZES_TRANSLATE = {
    [WATCH_SIZES.SMALL]: 'Маленькие',
    [WATCH_SIZES.MEDIUM]: 'Средние',
    [WATCH_SIZES.BIG]: 'Большие'
}

export const ROLES = {
    ADMIN: 'admin',
    MASTER: 'master',
    CLIENT: 'client'
}