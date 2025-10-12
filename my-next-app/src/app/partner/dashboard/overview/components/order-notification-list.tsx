import { useState, useEffect } from "react";
import { useNotification } from "../../NotificationContext";
import { useAcceptOrder, useGetTodayOrders } from "@/app/queries/order";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import EstimateTimeModal from "@/app/components/shared/estimateTimeModal";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { Item, Order } from "@/app/types";


// This component displays a list of order notifications for the partner dashboard
// It allows the partner to accept orders and set estimated preparation times
export default function OrderNotificationList() {
  

  

  const {notifications, stopNotificationSound,setAllNotifications, removeNotification } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { mutate, isPending: isAccepting, data } = useAcceptOrder();

  const { data: todayOrders, isPending: isLoading } = useGetTodayOrders();
  const [newOrders, setNewOrders] = useState<any[]>([]);



  useEffect(() => {
    if(newOrders.length > 0) { 
      setAllNotifications(newOrders);
    }
  }, [newOrders]);



  useEffect(() => {

    if (todayOrders) {
      const incoming = todayOrders?.filter(
        (order: Order) => order.status === "new" || order.status === "pending"
      );
      setNewOrders(incoming);
    }
    
    
  }, [todayOrders]);

  
  const handleAcceptClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectTime = (time: number) => {
    mutate(
      { orderId: selectedOrderId as string, estimatedTime: time },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedOrderId(data._id);
          stopNotificationSound();
        },
      }
    );
    removeNotification(selectedOrderId!);
  };

  if( isLoading) {return (
    <div className="flex items-center justify-center min-h-[200px]">
      <LoadingSpinner size="small" />
    </div>
  );}
  return (
    <div className="overflow-y-auto max-h-[calc(90vh-80px)] py-6 px-2 space-y-2">
      <EstimateTimeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal} 
        onSelect={handleSelectTime}
      />
      {newOrders.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <p className="text-gray-500">No incoming orders</p>
          </div>
        </div>
      ) : (
        newOrders.map((order, idx) => (
          <div
            key={order._id || idx}
            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                {order.orderNumber}
              </h2>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  order.status === "new"
                    ? "bg-yellow-200 text-yellow-800"
                    : order.status === "confirmed"
                    ? "bg-green-200 text-green-800"
                    : order.status === "rejected"
                    ? "bg-red-200 text-red-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {order?.status}
              </span>
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Customer:</span>{" "}
              {order.contactData?.name}
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Total:</span>{" "}
              {PriceFormatter(order.total)}
            </div>
            <div className="text-gray-700">
              <span className="font-medium">Time:</span> {order.selectedTime}
            </div>
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
                  {order.items?.map((item: Item, i: number) => (
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

            <button
              onClick={() => handleAcceptClick(order._id)}
              className="mt-3 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isAccepting && selectedOrderId === order._id ? (
                <LoadingSpinner />
              ) : (
                "Accept"
              )}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
