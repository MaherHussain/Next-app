"use client";
import { useUser } from "@/app/utils/providers/UserContext";
import { useState } from "react";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { IoIosAdd } from "react-icons/io";
import { ProductModal, ProductList } from "../products/components/";

export default function PartnerProducts() {
  const { user, isLoading: userLoading, isError: userError } = useUser();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
          <p className="text-gray-500">Please log in to access the products.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your menu items and products for {user.restaurantId?.name}.
          </p>
        </div>
        <div className="">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-between space-x-2 text-center px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 "
          >
            <span>Add</span>
            <span>
              <IoIosAdd className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>

      {/* Products Content */}
      <div className="bg-white shadow rounded-lg p-6">
        <ProductList />
      </div>
      {isAddModalOpen && (
        <ProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
} 