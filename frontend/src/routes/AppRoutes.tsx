import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "../pages/home/Home";
import Auth from "../pages/auth/Auth";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/how-it-works",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
