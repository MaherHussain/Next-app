import {useEffect, useState} from 'react'
import { useGetAllOrders } from '@/app/queries/orders';
import { useUser } from '@/app/utils/providers/UserContext';
import LoadingSpinner from '@/app/components/shared/loading-spinner';
import { dateFormatter, PriceFormatter } from '@/app/utils/helpers/helpers';

function OrderList() {
  const [page, setPage] = useState(1);
  const limit = 10;
    
      const { user } = useUser();
    
      const restaurantId =
        typeof user?.restaurantId === "string"
          ? user.restaurantId
          : user?.restaurantId?._id ?? "";

  const { data, isLoading, isError } = useGetAllOrders(restaurantId, page, limit);
 const totalOrders = data?.meta.total || 0;



  return (
    <div className="">
      {isLoading ? (
        <div className="flex flex-row justify-center mt-6">
          <LoadingSpinner size="large" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Error loading orders</div>
      ) : !data?.data.length ? (
        <div>No orders found</div>
      ) : (
        <div className="max-h-screen overflow-y-auto">
          <table className=" min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left font-semibold ">
                  Order number
                </th>
                <th className="py-2 px-4 text-left font-semibold ">
                  Order date
                </th>
                <th className="py-2 px-4 text-left font-semibold ">
                  Customer data
                </th>
                <th className="py-2 px-4 text-left font-semibold ">
                  Total amount
                </th>
                <th className="py-2 px-4 text-left font-semibold ">Status</th>
                <th className="py-2 px-4 text-left font-semibold "></th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((order: any) => (
                <tr key={order._id} className="border-t">
                  <td className="py-2 px-4">{order.orderNumber}</td>
                  <td className="py-2 px-4">
                    {dateFormatter(order.createdAt)}
                  </td>
                  <td className="py-2 px-4 text-gray-600 flex flex-col gap-1">
                    <span> {order.contactData.phone}</span>
                    <span> {order.contactData.name}</span>
                  </td>
                  <td className="py-2 px-4">{PriceFormatter(order.total)}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-500">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center items-center mt-4 space-x-2 ">
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-2">
          Page {page} of {totalOrders}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalOrders, p + 1))}
          disabled={page === totalOrders}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OrderList