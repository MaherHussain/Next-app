"use client";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "./loading-spinner";

export default function UserProfile() {
  const { user, isLoading, isError } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="small" />
        <span className="ml-2 text-gray-600">Loading user profile...</span>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">
          Unable to load user profile. Please log in again.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {user.partnerName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {user.partnerName}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Restaurant:</span>
          <span className="text-sm text-gray-900">{user.restaurantId?.name}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Address:</span>
          <span className="text-sm text-gray-900">{user.restaurantId?.address}</span>
        </div>
        
        {user.phone && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Phone:</span>
            <span className="text-sm text-gray-900">{user.phone}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">Member since:</span>
          <span className="text-sm text-gray-900">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Account Status</span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>
    </div>
  );
} 