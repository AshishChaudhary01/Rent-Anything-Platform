import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "../pages/home/Home";
import Auth from "../pages/auth/Auth";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import UserDashboard from "../pages/user/core/dashboard/UserDashboard";
import Listing from "../pages/user/listing/Listing";
import RequestToRent from "../pages/user/rent/requestToRent/RequestToRent";
import Checkout from "../pages/user/rent/checkout/Checkout";
import Meetup from "../pages/user/rent/meetup/Meetup";
import Confirmation from "../pages/user/rent/confirmation/Confirmation";
import ConditionProof from "../pages/user/rent/conditionProof/ConditionProof";
import ReturnSchedule from "../pages/user/rent/returnSchedule/ReturnSchedule";
import ReturnMeetup from "../pages/user/rent/returnMeetup/ReturnMeetup";
import MyRentals from "../pages/user/core/myRentals/MyRentals";
import MyListings from "../pages/user/core/myListings/MyListings";
import AddListing from "../pages/user/core/addListing/AddListing";
import Chat from "../pages/user/core/chat/Chat";
import CategoryListings from "../pages/user/core/category/CategoryListings";
import SearchResults from "../pages/user/core/search/SearchResults";
import Notifications from "../pages/user/core/notifications/Notifications";
import RentalDetails from "../pages/user/rent/rentalDetails/RentalDetails";
import MyListingDetails from "../pages/user/core/myListingDetails/MyListingDetails";
import ListingRequests from "../pages/user/core/listingRequests/ListingRequests";
import RequestDetails from "../pages/user/core/listingRequests/RequestDetails";
import RentalHistory from "../pages/user/core/rentalHistory/RentalHistory";
import PendingRequests from "../pages/user/core/pendingRequests/PendingRequests";
import ActiveRentals from "../pages/user/core/activeRentals/ActiveRentals";
import OwnerReturnConfirm from "../pages/user/rent/ownerReturnConfirm/OwnerReturnConfirm";
import OwnerReturnReview from "../pages/user/rent/ownerReturnReview/OwnerReturnReview";
import OwnerReturnPickup from "../pages/user/rent/ownerReturnPickup/OwnerReturnPickup";
import UserStandardLayout from "../layouts/userLayout/standardLayout/UserStandardLayout";
import UserFlowLayout from "../layouts/userLayout/flowLayout/UserFlowLayout";

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
          { path: "rental-history", element: <RentalHistory /> },
          { path: "pending-requests", element: <PendingRequests /> },
          { path: "active-rentals", element: <ActiveRentals /> },
          { path: "my-listings", element: <MyListings /> },
          { path: "chat", element: <Chat /> },
          { path: "category/:slug", element: <CategoryListings /> },
          { path: "search", element: <SearchResults /> },
          { path: "notifications", element: <Notifications /> },
        ]
      },
      {
        element: <UserFlowLayout />,
        children: [
          { path: "add-listing", element: <AddListing /> },
          { path: "listing", element: <Listing /> },
          { path: "rental-details", element: <RentalDetails /> },
          { path: "my-listing-details", element: <MyListingDetails /> },
          { path: "listing-requests", element: <ListingRequests /> },
          { path: "request-details/:id", element: <RequestDetails /> },
        ]
      },
      {
        path: "rent",
        element: <UserFlowLayout />,
        children: [
          { path: "request-to-rent", element: <RequestToRent /> },
          { path: "meetup", element: <Meetup /> },
          { path: "checkout", element: <Checkout /> },
          { path: "confirmation", element: <Confirmation /> },
          { path: "return-schedule", element: <ReturnSchedule /> },
          { path: "condition-proof", element: <ConditionProof /> },
          { path: "return-meetup", element: <ReturnMeetup /> },
          { path: "owner-return-review", element: <OwnerReturnReview /> },
          { path: "owner-return-pickup", element: <OwnerReturnPickup /> },
          { path: "owner-return-confirm", element: <OwnerReturnConfirm /> },
        ]
      }
    ]
  }
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
