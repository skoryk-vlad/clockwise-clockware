import { OrderAttributes, WatchSizesTranslate } from './models/order.model';
import { generateQR } from './qrcode';
import fs from 'fs';
import jsPDF from 'jspdf';

const fileURLToBase64 = (url: string) => {
    return fs.readFileSync(url).toString('base64');
};

export const createReceipt = async (order: OrderAttributes) => {
    const doc = new jsPDF();

    doc.setFillColor(238, 238, 238);
    doc.rect(0, 0, doc.internal.pageSize.width, 50, "F");
    doc.setFillColor(55, 55, 55);
    doc.rect(0, doc.internal.pageSize.height - 50, doc.internal.pageSize.width, 50, "F");

    doc.addFileToVFS("Roboto-Regular.ttf", fileURLToBase64('public/fonts/Roboto-Regular.ttf'));
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.addFileToVFS("Roboto-Bold.ttf", fileURLToBase64('public/fonts/Roboto-Bold.ttf'));
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    doc.addImage(fileURLToBase64('public/images/logo.png'), "PNG", 20, 17, 15, 15);
    doc.link(20, 17, 15, 15, { url: process.env.CLIENT_LINK });

    doc.setFontSize(15);
    doc.setFont("Roboto", "normal");
    doc.textWithLink("Clockwise", 40, 23, { url: process.env.CLIENT_LINK });
    doc.textWithLink("Clockware", 40, 29, { url: process.env.CLIENT_LINK });

    const orderInfo = [
        `Номер: ${order.id}`,
        `Дата и время: ${order.date} ${order.time}:00-${order.endTime}:00`,
        `Размер часов: ${WatchSizesTranslate[order.watchSize]}`,
        `Город: ${order['city']}`,
        `Клиент: ${order['client']} (${order['clientEmail']})`,
        `Мастер: ${order['master']} (${order['masterEmail']})`,
        `Цена: ${order.price}`,
        `Способ оплаты: ${order.paypalInvoiceId ? 'PayPal' : 'наличными'}`
    ];

    const qrcode = await generateQR(orderInfo.join('\n'));
    doc.addImage(qrcode, "PNG", doc.internal.pageSize.width - 60, 5, 40, 40);

    doc.setFont("Roboto", "bold");
    doc.setFontSize(22);
    doc.text(`Чек о выполнении заказа №${order.id}`, doc.internal.pageSize.width / 2, 70, {
        align: 'center'
    });

    doc.setFont("Roboto", "normal");
    doc.setFontSize(16);
    doc.text(`Данный чек подтверждает выполнение компанией «Clockwise Clockware» услуги по ремонту напольных часов для клиента ${order['client']} (${order['clientEmail']}).`, 20, 85, {
        maxWidth: doc.internal.pageSize.width - 40,
        align: 'justify'
    });

    doc.setFont("Roboto", "bold");
    doc.setFontSize(22);
    doc.text(`Информация о заказе`, doc.internal.pageSize.width / 2, 120, {
        align: 'center'
    });

    doc.setFont("Roboto", "normal");
    doc.setFontSize(16);
    doc.setFillColor(0, 0, 0);
    orderInfo.map((item, index) => {
        doc.text(item, 28, 135 + index * 7);
        doc.circle(25, 133 + index * 7, 1, "F");
    });

    doc.setTextColor('white');
    doc.setFont("Roboto", "bold");
    doc.text('Контакты', doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 30);
    doc.setFontSize(14);
    doc.setFont("Roboto", "normal");
    doc.text('+38 (073) 075-57-50', doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 24);
    doc.text(process.env.MAIL_USER, doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 18);

    return doc.output('dataurlstring');
};
