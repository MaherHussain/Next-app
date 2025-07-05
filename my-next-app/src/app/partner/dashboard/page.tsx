"use client";
import { useRouter } from "next/navigation";
import { useLogoutPartner } from "@/app/queries/auth";
import LoadingSpinner from "@/app/components/shared/loading-spinner";

export default function PartnerDashboard() {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogoutPartner();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        // Redirect to login page
        router.push("/auth/partner/login");
      },
      onError: (error) => {
        router.push("/auth/partner/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Partner Dashboard
            </h1>
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Logout
              {isPending && <LoadingSpinner size="small" />}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Welcome!
              </h3>
              <p className="text-blue-700">
                You have successfully registered and logged in as a partner.
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Next Steps
              </h3>
              <p className="text-green-700">
                Start managing your restaurant and orders.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Features
              </h3>
              <p className="text-purple-700">
                Add products, manage orders, and grow your business.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
