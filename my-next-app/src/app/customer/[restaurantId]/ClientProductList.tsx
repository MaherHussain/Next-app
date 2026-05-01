"use client";
import { ProductItem, ClosedModal } from "./components";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { useGetProducts } from "@/app/queries/products";
import { useGetRestaurantById } from "@/app/queries/restaurant";
import { Product } from "@/app/types";
import { isRestaurantOpen, getNextOpeningTime } from "@/app/utils/helpers/helpers";


export default function ClientProductList({restaurantId}: {restaurantId?: string}) {

  if(!restaurantId) {
    return null;
  }
  const { data: productsData, isLoading: productsLoading } = useGetProducts({ restaurantId, activeOnly: true });
  const { data: restaurantResponse, isLoading: restaurantLoading } = useGetRestaurantById(restaurantId);

  const restaurant = restaurantResponse?.data;
  const isOpen = isRestaurantOpen(restaurant?.openHours);
  const nextOpening = !isOpen && restaurant?.openHours ? getNextOpeningTime(restaurant.openHours) : null;
  const isLoading = productsLoading || restaurantLoading;

return (
  <div className="max-w-5xl mx-auto px-4 py-6">
    {/* Closed Modal */}
    {!isOpen && !isLoading && (
      <ClosedModal restaurantName={restaurant?.name} nextOpening={nextOpening} />
    )}

    {/* Restaurant Info Header */}
    {restaurant && (
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-sm">
        {restaurant.logo && (
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md border-2 border-white">
            <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{restaurant.name}</h1>
          <p className="text-gray-500 mt-1">{restaurant.address}</p>
        </div>
        {!isOpen && !isLoading ? (
          <div className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl border border-red-100 flex flex-col items-center shadow-sm">
            <span className="font-bold text-lg leading-tight">We're Closed</span>
            <span className="text-xs opacity-80">Currently not accepting orders</span>
          </div>
        ) : isOpen && (
          <div className="bg-green-50 text-green-600 px-6 py-3 rounded-2xl border border-green-100 flex flex-col items-center">
            <span className="font-bold text-lg leading-tight">We're Open</span>
            <span className="text-xs opacity-80">Order now for fresh delivery</span>
          </div>
        )}
      </div>
    )}

    <div className="mb-6">
      {isLoading && (
        <div className="flex flex-row justify-center mt-[15%]">
          <LoadingSpinner size="large" />
        </div>
      )}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData?.data?.map((p: Product) => (
            <ProductItem key={p._id} product={p} isOpen={isOpen} />
          ))}
        </div>
      )}
    </div>
  </div>
);
}

