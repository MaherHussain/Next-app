"use client";
import { useGetProducts } from "@/app/queries/products";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { Product } from "@/app/types";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import { useSearchParams } from "next/navigation";
import { useGetRestaurantById } from "@/app/queries/restaurant";

export default function WidgetClientPage({ restaurantId }: { restaurantId: string }) {
  const searchParams = useSearchParams();
  const variant = searchParams.get("variant");

  const { data: productsData, isLoading: productsLoading } = useGetProducts({ 
    restaurantId, 
    activeOnly: true
  });

  const { data: restaurantData, isLoading: restaurantLoading } = useGetRestaurantById(restaurantId);

  if (productsLoading || restaurantLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="small" />
      </div>
    );
  }

  const products = productsData?.data || [];
  const restaurantName = restaurantData?.data?.name || "our restaurant";

  // Button Variant
  if (variant === "button") {
    return (
      <div className="flex items-center justify-center h-full">
        <button
          onClick={() => window.open(`/customer/${restaurantId}`, '_blank')}
          className="widget-button w-full h-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <span>Order from {restaurantName}</span>
        </button>
      </div>
    );
  }

  // Default List Variant
  if (products.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No featured items at the moment.
        <br />
        <a 
          href={`/customer/${restaurantId}`} 
          target="_blank" 
          className="text-orange-500 underline mt-2 inline-block"
        >
          View full menu
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-1 gap-4">
      {products.slice(0, 3).map((product: Product) => (
        <div key={product._id} className="widget-card p-4 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800">{product.name}</h3>
            <p className="text-orange-600 font-semibold text-sm">
              {PriceFormatter(product.price)}
            </p>
          </div>
          <button 
            onClick={() => window.open(`/customer/${restaurantId}`, '_blank')}
            className="widget-button"
          >
            Order
          </button>
        </div>
      ))}
      <div className="text-center mt-2">
        <a 
          href={`/customer/${restaurantId}`} 
          target="_blank" 
          className="text-xs text-gray-400 hover:text-orange-500 transition-colors"
        >
          Powered by ZFood
        </a>
      </div>
    </div>
  );
}
