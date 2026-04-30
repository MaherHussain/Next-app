"use client";
import React, { useState } from "react";
import { useUser } from "@/app/utils/providers/UserContext";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { useGetAllOrders, useAcceptOrder, useRejectOrder, useMarkOrderReady } from "@/app/queries/orders";
import { IOrder } from "@/lib/models/order";
import { PriceFormatter, calculateFinalPickupTime, dateFormatter } from "@/app/utils/helpers/helpers";
import { useQueryClient } from "@tanstack/react-query";

export default function PartnerLiveDashboard() {
  const { user, isLoading: userLoading, isError: userError } = useUser();
  const queryClient = useQueryClient();

  const restaurantId = typeof user?.restaurantId === "string" ? user.restaurantId : user?.restaurantId?._id ?? "";

  const isToday = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Fetch up to 100 recent orders to get the live ones
  const { data, isLoading: ordersLoading } = useGetAllOrders(restaurantId, 1, 100);

  const { mutateAsync: acceptOrder, isPending: isAccepting } = useAcceptOrder();
  const { mutateAsync: rejectOrder, isPending: isRejecting } = useRejectOrder();
  const { mutateAsync: markReady, isPending: isMarking } = useMarkOrderReady();

  // Local state for actions
  const [estimateTimes, setEstimateTimes] = useState<{ [key: string]: string }>({});
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  if (userLoading) return <div className="flex items-center justify-center min-h-[400px]"><LoadingSpinner size="large" /></div>;
  if (!user || userError) return <div className="text-center mt-20 text-gray-500">Please log in to access the dashboard.</div>;

  const allOrders = data?.data || [];

  // Filter for today's live orders
  const todayOrders = allOrders.filter((o: any) => isToday(o.createdAt));
  const newOrders = todayOrders.filter((o: any) => o.status === 'new');
  const inProgressOrders = todayOrders.filter((o: any) => o.status === 'confirmed');

  const handleAccept = async (orderId: string) => {
    const estimatedTime = estimateTimes[orderId];
    if (!estimatedTime) return;
    setLoadingOrderId(orderId);
    try {
      await acceptOrder({ orderId, estimatedTime });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleReject = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      await rejectOrder({ orderId, rejectionReason: "Order rejected by restaurant" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleReady = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      await markReady(orderId);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOrderId(null);
    }
  };

  const renderOrderCard = (order: any, type: 'new' | 'progress') => {
    const isActionLoading = loadingOrderId === order._id || isAccepting || isRejecting || isMarking;

    return (
      <div key={order._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col gap-4 relative shrink-0">
        {isActionLoading && loadingOrderId === order._id && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">{dateFormatter(order.createdAt)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${type === 'new' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
            {type === 'new' ? 'New Order' : 'Cooking'}
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
          <div>
            <span className="text-gray-500 block text-xs">Customer</span>
            <span className="font-medium text-gray-800">{order.contactData?.name}</span>
          </div>
          <div>
            <span className="text-gray-500 block text-xs">Total</span>
            <span className="font-medium text-green-700">{PriceFormatter(order.total)}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500 block text-xs">Requested Pickup</span>
            <span className="font-medium text-gray-800">{order.selectedTime}</span>
          </div>
        </div>

        {/* Display Final Pickup if Confirmed */}
        {type === 'progress' && order.estimatedTime && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-center shadow-inner">
            <span className="text-xs text-green-800 font-semibold block uppercase tracking-wide">Target Pickup Time</span>
            <span className="text-xl font-black text-green-900">{calculateFinalPickupTime(order.selectedTime, order.estimatedTime, order.createdAt)}</span>
          </div>
        )}

        <div className="text-sm">
          <p className="text-gray-500 text-xs mb-1 font-semibold uppercase">Items:</p>
          <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="list-disc pl-4 space-y-1 text-gray-700">
              {order.items?.map((item: any, i: number) => (
                <li key={i} className="mb-2 last:mb-0">
                  <div className="flex justify-between font-medium text-gray-800">
                    <span>{item.quantity}x {item.product?.name}</span>
                  </div>
                  {item.ingredients && (
                    <div className="ml-0 mt-1 text-[11px] text-gray-500 leading-tight space-y-0.5">
                      {Object.entries(item.ingredients).map(([key, values]) => (
                        values && Array.isArray(values) && values.length > 0 ? (
                          <div key={key} className="flex gap-1">
                            <span className="font-bold capitalize">{key}:</span>
                            <span>
                              {values.map((v: any) => typeof v === 'string' ? v : v.name).join(", ")}
                            </span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {type === 'new' ? (
            <div className="flex flex-col gap-3">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                value={estimateTimes[order._id] || ""}
                onChange={(e) => setEstimateTimes({ ...estimateTimes, [order._id]: e.target.value })}
              >
                <option value="">Select prep time...</option>
                <option value="0 min">0 min (At Requested Time)</option>
                <option value="10 min">10 min</option>
                <option value="15 min">15 min</option>
                <option value="20 min">20 min</option>
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="1 hour">1 hour</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAccept(order._id)}
                  disabled={!estimateTimes[order._id]}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleReject(order._id)}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-semibold py-2 rounded-lg transition border border-red-200"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleReady(order._id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Mark Order as Ready
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      {/* Page Header */}
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-gray-900">Live Orders</h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage active incoming orders in real-time.
        </p>
      </div>

      {ordersLoading ? (
        <div className="flex-1 flex items-center justify-center"><LoadingSpinner size="large" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0 overflow-hidden">

          {/* Column 1: New Orders */}
          <div className="flex flex-col bg-gray-50/50 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-orange-500 text-white p-4 shrink-0 flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                New Orders
              </h2>
              <span className="bg-white text-orange-600 px-3 py-1 rounded-full font-black text-sm">{newOrders.length}</span>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              {newOrders.map((o: any) => renderOrderCard(o, 'new'))}
              {newOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 h-full">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p>No new orders right now.</p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="flex flex-col bg-gray-50/50 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-blue-600 text-white p-4 shrink-0 flex justify-between items-center">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                In Progress (Cooking)
              </h2>
              <span className="bg-white text-blue-700 px-3 py-1 rounded-full font-black text-sm">{inProgressOrders.length}</span>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
              {inProgressOrders.map((o: any) => renderOrderCard(o, 'progress'))}
              {inProgressOrders.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 h-full">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                  <p>No active orders currently cooking.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
