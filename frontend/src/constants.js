export const ORDER_STATUSES = {
    AWAITING_PAYMENT: 'awaiting payment',
    PAID: 'paid',
    COMPLETED: 'completed',
    CANCELED: 'canceled'
}
export const ORDER_STATUSES_TRANSLATE = {
    [ORDER_STATUSES.AWAITING_PAYMENT]: 'Ожидает оплаты',
    [ORDER_STATUSES.PAID]: 'Оплачен',
    [ORDER_STATUSES.COMPLETED]: 'Выполнен',
    [ORDER_STATUSES.CANCELED]: 'Отменен'
}

export const ORDER_MASTER_STATUSES = {
    NOT_COMPLETED: 'not completed',
    COMPLETED: 'completed',
    CANCELED: 'canceled'
}
export const ORDER_MASTER_STATUSES_TRANSLATE = {
    [ORDER_MASTER_STATUSES.NOT_COMPLETED]: 'Не выполнен',
    [ORDER_MASTER_STATUSES.COMPLETED]: 'Выполнен',
    [ORDER_MASTER_STATUSES.CANCELED]: 'Отменен'
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

export const supportedLanguages = {
    en: 'English',
    ru: 'Русский'
}

export const CITY_COORDINATES = {
    'default': {
        longitude: 35.04809494722167,
        latitude: 49.46348409567955
    },
    'Киев': {
        longitude: 30.526615346572157,
        latitude: 50.44956127700263
    },
    'Полтава': {
        longitude: 34.55431380214435,
        latitude: 49.58985501886275
    },
    'Ужгород': {
        longitude: 22.305025190395895,
        latitude: 48.62144484727884
    },
    'Днепр': {
        longitude: 35.04809494722167,
        latitude: 48.46348409567955
    }
}
