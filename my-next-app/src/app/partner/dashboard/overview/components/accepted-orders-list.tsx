import React, { useEffect } from "react";
import { useGetTodayOrders } from "@/app/queries/order";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import LoadingSpinner from "@/app/components/shared/loading-spinner";

export default function AcceptedOrdersList() {
  const { data: todayOrders, isPending: isLoading } = useGetTodayOrders();
  const [acceptedOrders, setAcceptedOrders] = React.useState<any[]>([]);
  
  useEffect(() => {
    if (todayOrders) {
      setAcceptedOrders(
        todayOrders.filter((order: any) => order.status === "confirmed") || []
      );
    }
  }, [todayOrders]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (acceptedOrders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-gray-500">No accepted orders yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[calc(90vh-80px)] py-6 px-2 space-y-2">
      {acceptedOrders.map((order: any, idx: number) => (
        <div
          key={order._id || idx}
          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              #{order.orderNumber}
            </h2>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-800">
              Accepted
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
          {order.estimatedTime && (
            <div className="text-gray-700">
              <span className="font-medium">Accepted to:</span>{" "}
              {order.estimatedTime} 
            </div>
          )}
          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 h-full">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
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
                {order.items?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-green-100 last:border-b-0"
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
                            ([key, values]: [string, any]) =>
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
      ))}
    </div>
  );
} 