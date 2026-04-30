import React from "react";
import { useNotification } from "./NotificationContext";
import { useRouter } from "next/navigation";
import { PriceFormatter } from "@/app/utils/helpers/helpers";

const NotificationList: React.FC = () => {
  const { notifications, dismissNotification } = useNotification();
  const router = useRouter();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {notifications.map((order, idx) => (
        <div
          key={order._id || idx}
          className="bg-white rounded-lg shadow-xl border-l-4 border-orange-500 p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow flex flex-col relative"
          onClick={() => {
            dismissNotification(order._id);
            router.push('/partner/dashboard/overview');
          }}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification(order._id);
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 text-orange-600 rounded-full p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-md text-gray-800">
                New Order #{order.orderNumber}
              </h3>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {order.contactData?.name} - {typeof order.total === 'number' ? PriceFormatter(order.total) : JSON.stringify(order.total)}
          </p>
          <div className="text-xs text-orange-600 font-semibold px-2 py-1 bg-orange-50 self-start rounded-full">
            Click to view on Dashboard
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
