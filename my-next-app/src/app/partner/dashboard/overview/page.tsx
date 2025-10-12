"use client";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import OrderNotificationList from "./components/order-notification-list";
import AcceptedOrdersList from "./components/accepted-orders-list";
/* import UserProfile from "@/app/components/shared/UserProfile";
import RestaurantInfo from "../components/restaurant-info */

export default function PartnerDashboard() {
  const { user, isLoading: userLoading, isError: userError } = useUser();

  // Loading state
  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600">Unable to load user information.</p>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            No User Found
          </h1>
          <p className="text-gray-500">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-row space-y-2 justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome {user.partnerName}
        </h1>
        <div className="flex items-center space-x-4">
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString("en-GB")}
          </p>
         
        </div>
      </div>
      <div className="flex flex-row space-x-4 w-full h-[calc(100vh-100px)]">
        <div className="p-4 rounded-md  border border-black-200 h-full flex-1">
          <h5 className="bg-yellow-100 p-2 text-lg font-bold text-gray-800">
            Incoming
          </h5>
          <OrderNotificationList />
        </div>
        <div className="p-4 rounded-md border border-black-200 h-full flex-1">
          <h5 className="bg-green-100 p-2 text-lg font-bold text-gray-800">
            Accepted
          </h5>
          <AcceptedOrdersList />
        </div>
      </div>
    </div>
  );
} 
