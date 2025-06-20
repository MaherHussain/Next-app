"use client";
import { useGetProducts } from "../../queries/products";
import LoadingSpinner from "../shared/loading-spinner";
import ProductItem from "./product-item";
export interface Product {
  id: string;
  name: string;
  price: number;
}
export default function Products() {
  const { data, isLoading } = useGetProducts();
  const productsArr = data?.data.map((product) => {
    return {
      id: product._id,
      name: product.name,
      price: product.price,
    };
  });

  return (
    <div className="bg-white text-black  w-500 p-20">
      {isLoading && (
        <div className="flex flex-row justify-center mt-[15%] ml-[15%]">
          <LoadingSpinner size="large" />
        </div>
      )}
      {productsArr && (
        <div className="flex flex-col justify-start">
          <h1 className="py-5">Products</h1>
          <div className="flex justify-start flex-row gap-7 flex-wrap">
            {productsArr?.map((product) => {
              return (
                <div key={product?.id}>
                  <ProductItem product={product} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
