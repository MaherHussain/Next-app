"use client";
import ProductItem from "@/app/components/products/product-item";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { useGetProducts } from "@/app/queries/products";
import { Product } from "@/app/types";


export default function ClientProductList({restaurantId}: {restaurantId?: string}) {

  if(!restaurantId) {
    return null;
  }
const { data, isLoading } = useGetProducts({ restaurantId, activeOnly: true });

return (
  <div className="max-w-5xl mx-auto px-4 py-6">
    <div className="mb-6">
      {isLoading && (
        <div className="flex flex-row justify-center mt-[15%] ml-[15%]">
          <LoadingSpinner size="large" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.map((p: Product) => (
          <ProductItem key={p._id} product={p} />
        ))}
      </div>
    </div>
  </div>
);
}
