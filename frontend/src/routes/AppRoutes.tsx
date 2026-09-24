import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "../pages/home/Home";
import Auth from "../pages/auth/Auth";
import Login from "../pages/auth/login/Login";
import Register from "../pages/auth/register/Register";
import ForgotPassword from "../pages/auth/forgotPassword/ForgotPassword";
import UserDashboard from "../pages/user/core/dashboard/UserDashboard";
import Listing from "../pages/user/listing/Listing";
import RequestToRent from "../pages/user/rent/requestToRent/RequestToRent";
import RequestWaiting from "../pages/user/rent/requestWaiting/RequestWaiting";
import Checkout from "../pages/user/rent/checkout/Checkout";
import Meetup from "../pages/user/rent/meetup/Meetup";
import Confirmation from "../pages/user/rent/confirmation/Confirmation";
import PaymentCallback from "../pages/user/rent/checkout/PaymentCallback";
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
import RateRental from "../pages/user/rent/rateRental/RateRental";
import Profile from "../pages/user/core/account/Profile";
import PublicProfile from "../pages/user/core/publicProfile/PublicProfile";
import PublicReviews from "../pages/user/core/publicProfile/PublicReviews";
import PublicListings from "../pages/user/core/publicProfile/PublicListings";
import PaymentMethods from "../pages/user/core/account/PaymentMethods";
import Kyc from "../pages/user/core/account/Kyc";
import Security from "../pages/user/core/account/Security";
import RequireTransactReady from "../components/auth/RequireTransactReady";
import UserStandardLayout from "../layouts/userLayout/standardLayout/UserStandardLayout";
import UserFlowLayout from "../layouts/userLayout/flowLayout/UserFlowLayout";
import AdminLayout from "../layouts/adminLayout/AdminLayout";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminListings from "../pages/admin/listings/AdminListings";
import AdminListingDetails from "../pages/admin/listings/AdminListingDetails";
import AdminUsers from "../pages/admin/users/AdminUsers";
import AdminUserDetails from "../pages/admin/users/AdminUserDetails";
import AdminReports from "../pages/admin/reports/AdminReports";
import AdminReportDetails from "../pages/admin/reports/AdminReportDetails";
import AdminRentals from "../pages/admin/rentals/AdminRentals";
import AdminRentalDetails from "../pages/admin/rentals/AdminRentalDetails";
import AdminSettings from "../pages/admin/settings/AdminSettings"
import AdminUserActivity from "../pages/admin/users/AdminUserActivity"
import AdminKyc from "../pages/admin/kyc/AdminKyc"
import AdminKycDetails from "../pages/admin/kyc/AdminKycDetails"
import AdminProfile from "../pages/admin/profile/AdminProfile";
import ReportIssue from "../pages/user/core/reports/ReportIssue";
import MyReports from "../pages/user/core/reports/MyReports";
import MyReportDetails from "../pages/user/core/reports/MyReportDetails";

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
      {
        path: "forgot-password",
        element: <ForgotPassword />,
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
          { path: "profile", element: <Profile /> },
          { path: "people/:id", element: <PublicProfile /> },
          { path: "people/:id/reviews", element: <PublicReviews /> },
          { path: "people/:id/listings", element: <PublicListings /> },
          { path: "payment-methods", element: <PaymentMethods /> },
          { path: "kyc", element: <Kyc /> },
          { path: "security", element: <Security /> },
          { path: "reports", element: <MyReports /> },
          { path: "reports/:id", element: <MyReportDetails /> },
        ]
      },
      {
        element: <UserFlowLayout />,
        children: [
          { path: "add-listing", element: <RequireTransactReady><AddListing /></RequireTransactReady> },
          { path: "listing/:id", element: <Listing /> },
          { path: "my-listing-details/:id", element: <MyListingDetails /> },
          { path: "rental-details", element: <RentalDetails /> },
          { path: "listing-requests", element: <ListingRequests /> },
          { path: "request-details/:id", element: <RequestDetails /> },
          { path: "report", element: <ReportIssue /> },
        ]
      },
      {
        path: "rent",
        element: <UserFlowLayout />,
        children: [
          { path: "request-to-rent", element: <RequireTransactReady><RequestToRent /></RequireTransactReady> },
          { path: "waiting", element: <RequestWaiting /> },
          { path: "payment/callback/:gateway/:rentalId", element: <PaymentCallback /> },
          { path: "payment/callback", element: <PaymentCallback /> },
          { path: "meetup", element: <Meetup /> },
          { path: "checkout", element: <RequireTransactReady><Checkout /></RequireTransactReady> },
          { path: "confirmation", element: <Confirmation /> },
          { path: "return-schedule", element: <ReturnSchedule /> },
          { path: "condition-proof", element: <ConditionProof /> },
          { path: "return-meetup", element: <ReturnMeetup /> },
          { path: "owner-return-review", element: <OwnerReturnReview /> },
          { path: "owner-return-pickup", element: <OwnerReturnPickup /> },
          { path: "owner-return-confirm", element: <OwnerReturnConfirm /> },
          { path: "rate", element: <RateRental /> },
        ]
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "listings", element: <AdminListings /> },
      { path: "listings/:id", element: <AdminListingDetails /> },
      { path: "users", element: <AdminUsers /> },
      { path: "users/:id", element: <AdminUserDetails /> },
      { path: "users/:id/listings", element: <AdminUserActivity kind="listings" /> },
      { path: "users/:id/rentals", element: <AdminUserActivity kind="rentals" /> },
      { path: "kyc", element: <AdminKyc /> },
      { path: "kyc/:id", element: <AdminKycDetails /> },
      { path: "reports", element: <AdminReports /> },
      { path: "reports/:id", element: <AdminReportDetails /> },
      { path: "rentals", element: <AdminRentals /> },
      { path: "rentals/:id", element: <AdminRentalDetails /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  }
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
