import { WatchSizesTranslate, OrderStatusesTranslate, OrderAttributes, OrderReportAttributes, OrderReportType, OrderTableColumn, WATCH_SIZES, ORDER_STATUSES } from './models/order.model';
import XLSX from 'xlsx';

const tableColumns: OrderTableColumn[] = [
    { value: 'id', columnTitle: 'id' },
    { value: 'watchSize', columnTitle: 'Размер часов' },
    { value: 'status', columnTitle: 'Статус' },
    { value: 'date', columnTitle: 'Дата' },
    { value: 'time', columnTitle: 'Время начала' },
    { value: 'endTime', columnTitle: 'Время окончания' },
    { value: 'city', columnTitle: 'Город' },
    { value: 'client', columnTitle: 'Клиент' },
    { value: 'master', columnTitle: 'Мастер' },
    { value: 'price', columnTitle: 'Цена' },
    { value: 'rating', columnTitle: 'Рейтинг' },
    { value: 'review', columnTitle: 'Отзыв' }
]

const defaultOrderFormatted: OrderReportType = {
    id: null,
    watchSize: WatchSizesTranslate[WATCH_SIZES.SMALL],
    status: OrderStatusesTranslate[ORDER_STATUSES.AWAITING_PAYMENT],
    date: '',
    time: null,
    endTime: null,
    city: '',
    client: '',
    master: '',
    price: null,
    rating: null,
    review: ''
}

export const createOrderReport = async (orders: OrderAttributes[]): Promise<Buffer> => {
    const workbook = XLSX.utils.book_new();

    const columns: OrderReportAttributes[] = tableColumns.map(column => column.value);

    const ordersFormatted = orders.map((order) => {
        return columns.reduce((acc: OrderReportType, currentValue: OrderReportAttributes) => {
            switch (currentValue) {
                case 'watchSize': {
                    acc[currentValue] = WatchSizesTranslate[order[currentValue]];
                    break;
                }
                case 'status': {
                    acc[currentValue] = OrderStatusesTranslate[order[currentValue]];
                    break;
                }
                default: {
                    acc[currentValue as any] = order[currentValue];
                }
            }
            return acc;
        }, { ...defaultOrderFormatted });
    });

    const worksheet = XLSX.utils.aoa_to_sheet([tableColumns.map(column => column.columnTitle)]);
    XLSX.utils.sheet_add_json(worksheet, ordersFormatted, { origin: 'A2', skipHeader: true });

    worksheet['!cols'] = fitToColumn(tableColumns, ordersFormatted);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заказы');
    return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

const fitToColumn = (tableColumns: OrderTableColumn[], orders: OrderReportType[]): XLSX.ColInfo[] => {
    const columnWidths: XLSX.ColInfo[] = tableColumns.map(({ value, columnTitle }) => ({
        wch: Math.max(columnTitle.length, ...orders.map((order) => order[value] ? order[value].toString().length : 0)) + 1
    }));

    return columnWidths;
};
