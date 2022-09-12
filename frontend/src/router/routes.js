import { Admin } from "../pages/admin/Admin";
import { Cities } from "../pages/admin/Cities";
import { Clients } from "../pages/admin/Clients";
import { Landing } from "../pages/Landing";
import { Login } from "../pages/Login";
import { Masters } from "../pages/admin/Masters";
import { Orders } from "../pages/admin/Orders";
import { CityMasters } from "../pages/admin/CityMasters";

export const privateRoutes = [
    {path: '/admin/main', element: <Admin/>},
    {path: '/admin/cities', element: <Cities/>},
    {path: '/admin/masters', element: <Masters/>},
    {path: '/admin/clients', element: <Clients/>},
    {path: '/admin/orders', element: <Orders/>},
    {path: '/admin/citymasters', element: <CityMasters/>}
]

export const publicRoutes = [
    {path: '/admin/login', element: <Login/>},
    {path: '/', element: <Landing/>},
]