import { Admin } from "../pages/admin/Admin";
import { Cities } from "../pages/admin/Cities";
import { Clients } from "../pages/admin/Clients";
import { Landing } from "../pages/Landing";
import { Masters } from "../pages/admin/Masters";
import { Orders } from "../pages/admin/Orders";
import { ClientOrders } from "../pages/client/ClientOrders";
import { MasterOrders } from "../pages/master/MasterOrders";
import { MessageFromEmail } from "../pages/MessageFromEmail";
import { Review } from "../pages/Review";
import { Statistics } from "../pages/admin/Statistics";

export const publicRoutes = [
    { path: '/', element: <Landing /> },
    { path: '/message/success', element: <MessageFromEmail messageKey={'messages.success'} /> },
    { path: '/message/master/success', element: <MessageFromEmail messageKey={'messages.masterSuccess'} /> },
    { path: '/message/already-confirmed', element: <MessageFromEmail messageKey={'messages.alreadyConfirmed'} /> },
    { path: '/message/error', element: <MessageFromEmail messageKey={'messages.error'} /> },
    { path: '/message/order-not-exist', element: <MessageFromEmail messageKey={'messages.orderNotExist'} /> },
    { path: '/message/order-not-completed', element: <MessageFromEmail messageKey={'messages.orderNotCompleted'} /> },
    { path: '/message/order-already-reviewed', element: <MessageFromEmail messageKey={'messages.orderAlreadyReviewed'} /> },
    { path: '/order-review', element: <Review /> }
]

export const adminRoutes = [
    { path: '/admin/main', element: <Admin /> },
    { path: '/admin/cities', element: <Cities /> },
    { path: '/admin/masters', element: <Masters /> },
    { path: '/admin/clients', element: <Clients /> },
    { path: '/admin/orders', element: <Orders /> },
    { path: '/admin/statistics', element: <Statistics /> },
]
export const clientRoutes = [
    { path: '/client/main', element: <ClientOrders /> },
]
export const masterRoutes = [
    { path: '/master/main', element: <MasterOrders /> },
]