'use client'
import React from 'react';
import Modal from '@/app/components/shared/Modal';
import { getOneOrder } from '@/app/queries/orders';
import LoadingSpinner from '@/app/components/shared/loading-spinner';
import { PriceFormatter, dateFormatter } from '@/app/utils/helpers/helpers';
import { IOrder } from '@/lib/models/order';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
}

function OrderDetailsModal({ isOpen, onClose, orderId }: OrderDetailsModalProps) {
  const { data, isLoading, isError } = getOneOrder(orderId);
  const order = data?.data as IOrder | undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Details">
      <div className="max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner size="large" />
          </div>
        ) : isError ? (
          <div className="text-red-500 text-center py-4">
            Error loading order details
          </div>
        ) : !order ? (
          <div className="text-gray-500 text-center py-4">Order not found</div>
        ) : (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.createdAt && dateFormatter(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-700 mb-3">
                Customer Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <span className="ml-2 text-gray-800">
                    {order.contactData.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>
                  <span className="ml-2 text-gray-800">
                    {order.contactData.phone}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 text-gray-800">
                    {order.contactData.email}
                  </span>
                </div>
                {order.contactData.address && (
                  <div>
                    <span className="text-gray-500">Address:</span>
                    <span className="ml-2 text-gray-800">
                      {order.contactData.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-700 mb-3">
                Order Details
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Order Method:</span>
                  <span className="ml-2 text-gray-800 capitalize">
                    {order.orderMethod}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Payment Method:</span>
                  <span className="ml-2 text-gray-800 capitalize">
                    {order.paymentMethod}
                  </span>
                </div>

                {order.estimatedTime && (
                  <div>
                    <span className="text-gray-500">Estimated Time:</span>
                    <span className="ml-2 text-gray-800">
                      {order.estimatedTime}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-b pb-4">
              <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {item.quantity} x {item.product?.name || "Product"}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-800">
                          {PriceFormatter(
                            (item.product?.price || 0) * item.quantity
                          )}
                        </p>
                      </div>
                      
                      {item.ingredients && (
                        <div className="mt-2 text-xs text-gray-600 space-y-1">
                          {item.ingredients && item.ingredients.length > 0 && (
                            <div>
                              <span className="font-medium">Add:</span>
                              <span className="ml-1">
                                {item.ingredients.join(", ")}
                              </span>
                            </div>
                          )}
                          {item.ingredients && item.ingredients.length > 0 && (
                            <div>
                              <span className="font-medium">Dressing:</span>
                              <span className="ml-1">
                                {item.ingredients.join(", ")}
                              </span>
                            </div>
                          )}
                          {item.ingredients && item.ingredients.length > 0 && (
                            <div>
                              <span className="font-medium">Remove:</span>
                              <span className="ml-1">
                                {item.ingredients.join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No items found</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>{PriceFormatter(order.total)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default OrderDetailsModal;