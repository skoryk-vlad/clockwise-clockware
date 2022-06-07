import { Admin } from "../pages/admin/Admin";
import { Cities } from "../pages/admin/Cities";
import { Clients } from "../pages/admin/Clients";
import { Landing } from "../pages/Landing";
import { Login } from "../pages/Login";
import { Masters } from "../pages/admin/Masters";
import { Orders } from "../pages/admin/Orders";

export const privateRoutes = [
    {path: '/admin/*', element: <Admin/>, exact: true},
    {path: '/admin/cities', element: <Cities/>, exact: true},
    {path: '/admin/masters', element: <Masters/>, exact: true},
    {path: '/admin/clients', element: <Clients/>, exact: true},
    {path: '/admin/orders', element: <Orders/>, exact: true},
]

export const publicRoutes = [
    {path: '/admin/login', element: <Login/>, exact: true},
    {path: '/', element: <Landing/>, exact: true},
]