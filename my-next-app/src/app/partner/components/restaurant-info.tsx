import React from 'react'
import { useGetRestaurant } from '@/app/queries/restaurant'

export default function RestaurantInfo() {
    const { data: restaurant } = useGetRestaurant();
    const restaurantData = restaurant?.data;
  return (
    <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Restaurant Information
        </h3>
        <div className="space-y-2 text-blue-700">
            <p>
            <strong>Name:</strong>{" "}
            {restaurantData?.name || "N/A"}
            </p>
            <p>
            <strong>Address:</strong>{" "}
            {restaurantData?.address || "N/A"}
            </p>
            {/* <p>
            <strong>Email:</strong> {user.email}
            </p>
            {user.phone && (
            <p>
                <strong>Phone:</strong> {user.phone}
            </p>
            )} */}
        </div>
    </div>
  )
}
