import { WatchSizesTranslate, OrderStatusesTranslate, OrderAttributes } from './models/order.model';
import XLSX from 'xlsx';
import { TableColumn } from './types';

const tableColumns: TableColumn[] = [
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
    { value: 'review', columnTitle: 'Отзыв' },
]

export const createOrderReport = async (orders: OrderAttributes[]) => {
    const workbook = XLSX.utils.book_new();

    const columns: string[] = tableColumns.map(column => column.value);

    const ordersFormatted = orders.map(order => {
        const orderFormatted = {};
        columns.forEach(col => {
            if (col === 'watchSize') orderFormatted[col] = WatchSizesTranslate[order[col]];
            else if (col === 'status') orderFormatted[col] = OrderStatusesTranslate[order[col]];
            else orderFormatted[col] = order[col];
        });

        return orderFormatted;
    });

    const worksheet = XLSX.utils.json_to_sheet([]);

    XLSX.utils.sheet_add_aoa(worksheet, [tableColumns.map(column => column.columnTitle)]);
    XLSX.utils.sheet_add_json(worksheet, ordersFormatted, { origin: 'A2', skipHeader: true });

    worksheet['!cols'] = fitToColumn(tableColumns, ordersFormatted);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заказы');
    return XLSX.writeFile(workbook, "reports/order-report.xlsx");
}

const fitToColumn = (tableColumns: TableColumn[], data: any) => {
    const columnWidths: XLSX.ColInfo[] = tableColumns.map(({ value, columnTitle }) => ({
        wch: Math.max(columnTitle.length, ...data.map((item: any) => item[value] ? item[value].toString().length : 0)) + 1
    }));

    return columnWidths;
};
