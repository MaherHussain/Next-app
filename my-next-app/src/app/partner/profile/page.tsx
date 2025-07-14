"use client";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { AiOutlineUser } from "react-icons/ai";
export default function PartnerProfile() {
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
          <p className="text-gray-500">Please log in to access the profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        <p className="text-gray-600 mt-1">
          Manage settings and personal information.
        </p>
      </div>

      {/* Profile Content */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-left py-5">
          <div className="flex flex-row">
            <h3 className="flex-1  flex flex-row gap-3 text-lg font-medium text-gray-900 mb-2 ">
              <span className="border-b-2 border-gray-200">
                Personal information{" "}
              </span>{" "}
              <AiOutlineUser />
            </h3>
            <button disabled> Edit</button>
          </div>
          <p className="text-gray-500 mb-4">
            This is where you'll manage your account settings and preferences.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Update personal information</p>
            <p>• Change password</p>
            <p>• Manage notification preferences</p>
            <p>• View account activity</p>
            <p>• Restaurant settings</p>
          </div>
        </div>
        <div className="text-left py-5">
          <div className="flex flex-row">
            <h3 className="flex-1  flex flex-row gap-3 text-lg font-medium text-gray-900 mb-2 ">
              <span className="border-b-2 border-gray-200">Shop settings</span>
              <AiOutlineUser />
            </h3>
            <button disabled> Edit</button>
          </div>
          <p className="text-gray-500 mb-4">
            This is where you'll manage your account settings and preferences.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Update personal information</p>
            <p>• Change password</p>
            <p>• Manage notification preferences</p>
            <p>• View account activity</p>
            <p>• Restaurant settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
