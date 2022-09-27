import { Admin } from "../pages/admin/Admin";
import { Cities } from "../pages/admin/Cities";
import { Clients } from "../pages/admin/Clients";
import { Landing } from "../pages/Landing";
import { Masters } from "../pages/admin/Masters";
import { Orders } from "../pages/admin/Orders";
import { ClientOrders } from "../pages/client/ClientOrders";
import { MasterOrders } from "../pages/master/MasterOrders";
import { MessageFromEmail } from "../pages/MessageFromEmail";

export const publicRoutes = [
    { path: '/', element: <Landing /> },
    { path: '/message/success', element: <MessageFromEmail>Подтверждение прошло успешно!</MessageFromEmail> },
    { path: '/message/master/success', element: <MessageFromEmail>Благодарим за подтверждение Вашего e-mail! Ожидайте одобрения от администратора. Мы уведомим Вас по указаному электронному адресу.</MessageFromEmail> },
    { path: '/message/already-confirmed', element: <MessageFromEmail>Подтверждение уже было произведено!</MessageFromEmail> },
    { path: '/message/error', element: <MessageFromEmail>Произошла ошибка!</MessageFromEmail> }
]

export const adminRoutes = [
    { path: '/admin/main', element: <Admin /> },
    { path: '/admin/cities', element: <Cities /> },
    { path: '/admin/masters', element: <Masters /> },
    { path: '/admin/clients', element: <Clients /> },
    { path: '/admin/orders', element: <Orders /> },
]
export const clientRoutes = [
    { path: '/client/main', element: <ClientOrders /> },
]
export const masterRoutes = [
    { path: '/master/main', element: <MasterOrders /> },
]