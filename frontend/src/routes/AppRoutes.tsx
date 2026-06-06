import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "../pages/home/Home";
import Auth from "../pages/auth/Auth";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import UserDashboard from "../pages/user/core/dashboard/UserDashboard";
import Listing from "../pages/user/listing/Listing";
import RequestToRent from "../pages/user/rent/requestToRent/RequestToRent";
import Collaborate from "../pages/user/rent/collaborate/Collaborate";
import Checkout from "../pages/user/rent/checkout/Checkout";
import Meetup from "../pages/user/rent/meetup/Meetup";
import Confirmation from "../pages/user/rent/confirmation/Confirmation";
import MyRentals from "../pages/user/core/myRentals/MyRentals";
import MyListings from "../pages/user/core/myListings/MyListings";
import AddListing from "../pages/user/core/addListing/AddListing";
import Chat from "../pages/user/core/chat/Chat";
import UserStandardLayout from "../layouts/userLayout/standardLayout/UserStandardLayout";
import UserFlowLayout from "../layouts/userLayout/flowLayout/UserFlowLayout";
import UserChatLayout from "../layouts/userLayout/chatLayout/UserChatLayout";

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
  {
    path: "/user",
    children: [
      {
        element: <UserStandardLayout />,
        children: [
          { path: "", element: <UserDashboard /> },
          { path: "my-rentals", element: <MyRentals /> },
          { path: "my-listings", element: <MyListings /> },
        ]
      },
      {
        element: <UserFlowLayout />,
        children: [
          { path: "add-listing", element: <AddListing /> },
          { path: "listing", element: <Listing /> },
        ]
      },
      {
        path: "rent",
        element: <UserFlowLayout />,
        children: [
          { path: "request-to rent", element: <RequestToRent /> },
          { path: "collborate", element: <Collaborate /> },
          { path: "meetup", element: <Meetup /> },
          { path: "checkout", element: <Checkout /> },
          { path: "confirmation", element: <Confirmation /> },
        ]
      },
      {
        element: <UserChatLayout />,
        children: [
          { path: "chat", element: <Chat /> },
        ]
      },
    ]
  }
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
