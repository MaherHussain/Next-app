"use client";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import Order from "@/lib/models/order";
import { OrderList } from "./components";

export default function PartnerOrders() {
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
          <p className="text-gray-500">Please log in to access the orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">
          Manage and track all orders from your customers.
        </p>
      </div>

      {/* Orders Content */}
      <div className="">
        <OrderList />
      </div>
    </div>
  );
} 