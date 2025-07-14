"use client";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";

export default function PartnerProducts() {
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
          <p className="text-gray-600">
            Unable to load user information.
          </p>
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
            Please log in to access the products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Products
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your menu items and products for {user.restaurantId?.name}.
        </p>
      </div>

      {/* Products Content */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Menu Management
          </h3>
          <p className="text-gray-500 mb-4">
            This is where you'll manage your restaurant's menu and products.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Add new menu items</p>
            <p>• Edit existing products</p>
            <p>• Manage categories</p>
            <p>• Set prices and availability</p>
            <p>• Upload product images</p>
          </div>
        </div>
      </div>
    </div>
  );
} 