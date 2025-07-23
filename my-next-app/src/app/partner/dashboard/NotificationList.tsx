import React, { useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";
import { useAcceptOrder } from "@/app/queries/order";

// Add this import
import { useRef } from "react";
import { PriceFormatter } from "@/app/utils/helpers/helpers";

const NotificationList: React.FC = () => {
  const { notifications, soundEnabled, toggleSound, stopNotificationSound } =
    useNotification();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [estimateTimes, setEstimateTimes] = useState<{
    [orderId: string]: string;
  }>({});
  const [acceptedOrders, setAcceptedOrders] = useState<{
    [orderId: string]: boolean;
  }>({});
  const { mutate, isSuccess } = useAcceptOrder();
  // Access the audio element in NotificationContext
  const audioRef = (window as any).notificationAudioRef;

  const handleAccept = async (orderId: string) => {
    const estimatedTime = estimateTimes[orderId];
    if (!estimatedTime) return;
    setLoadingOrderId(orderId);

    mutate({
      orderId,
      estimatedTime,
    });
    if (isSuccess) {
      setAcceptedOrders((prev) => ({ ...prev, [orderId]: true }));
      stopNotificationSound(); // Stop sound immediately on accept
    }
    setLoadingOrderId(null);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">New Orders</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSound}
                className="bg-white bg-opacity-20 rounded-full p-2 hover:bg-opacity-30 transition-all"
                title={soundEnabled ? "Disable sound" : "Enable sound"}
              >
                {soundEnabled ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                )}
              </button>
              <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-semibold">
                {notifications.length}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div className="space-y-4">
            {notifications.map((order, idx) => (
              <div
                key={order._id || idx}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-600 rounded-full p-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Total:{PriceFormatter(order.total)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 capitalize">
                      {order.orderMethod}
                    </div>
                    <div className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Left Column - Contact & Order Info */}
                  <div className="space-y-4">
                    {/* Contact Information Block */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Contact Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">
                            Name:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {order.contactData?.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Phone:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {order.contactData?.phone}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Email:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {order.contactData?.email}
                          </span>
                        </div>
                        {order.contactData?.address && (
                          <div>
                            <span className="font-semibold text-gray-700">
                              Address:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {order.contactData.address}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details Block */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Order Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">
                            Time:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {order.selectedTime}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Payment:
                          </span>
                          <span className="ml-2 text-gray-600 capitalize">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">
                            Method:
                          </span>
                          <span className="ml-2 text-gray-600 capitalize">
                            {order.orderMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Order Items */}
                  <div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 h-full">
                      <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                          />
                        </svg>
                        Order Items
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {order.items?.map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center py-2 border-b border-orange-100 last:border-b-0"
                          >
                            <div className="text-left">
                              <span className="font-semibold text-gray-800">
                                x{item.quantity}
                              </span>
                            </div>
                            <div className="">
                              <span className="font-medium text-gray-800">
                                {item.product.name}
                              </span>
                              {item.ingredients && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {Object.entries(item.ingredients).map(
                                    ([key, values]) =>
                                      values &&
                                      Array.isArray(values) &&
                                      values.length > 0 ? (
                                        <span key={key} className="mr-2 block">
                                          {key}: {values.join(", ")}
                                        </span>
                                      ) : null
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-left">
                              <span className="font-semibold text-gray-800">
                                {PriceFormatter(item.product.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accept Section */}
                {acceptedOrders[order._id] ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <div className="text-green-600 font-semibold flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Order Accepted!
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Estimated time (e.g. 30 min)"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={estimateTimes[order._id] || ""}
                      onChange={(e) =>
                        setEstimateTimes({
                          ...estimateTimes,
                          [order._id]: e.target.value,
                        })
                      }
                      disabled={loadingOrderId === order._id}
                    />
                    <button
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:from-orange-600 hover:to-red-700 transition-all duration-200"
                      onClick={() => handleAccept(order._id)}
                      disabled={
                        loadingOrderId === order._id ||
                        !estimateTimes[order._id]
                      }
                    >
                      {loadingOrderId === order._id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Accepting...
                        </div>
                      ) : (
                        "Accept"
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationList;
