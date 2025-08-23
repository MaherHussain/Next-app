"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import Sidebar from "../components/sidebar"
import Header from "../components/header";
import { useGetRestaurant } from "@/app/queries/restaurant";
import Button from "@/app/components/shared/Button";
import { NotificationProvider } from "./NotificationContext";
import NotificationList from "./NotificationList";
export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, isLoading: userLoading, isError: userError } = useUser();
  const { data } = useGetRestaurant();
  const restaurantName = data?.data;
  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-4">Unable to load user information.</p>
          <Button clickHandler={() => router.push("/auth/partner/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    router.push("/auth/partner/login");
    return null;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Notification List */}
        {/* <NotificationList /> */}
        {/* Header */}
        <Header
          restaurantName={restaurantName?.name as string}
          partnerName={user?.partnerName}
          email={user.email}
        />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar restaurantName={restaurantName?.name} />

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}
