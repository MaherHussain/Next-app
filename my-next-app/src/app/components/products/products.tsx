"use client";
import { useContext } from "react";
import { useGetProducts } from "../../queries/products";
import LoadingSpinner from "../shared/loading-spinner";
import ProductItem from "./product-item";
import { useUser } from "@/app/utils/providers/UserContext";
export interface Product {
  id: string;
  name: string;
  price: number;
}
export default function Products() {

  // TODO: Render Product list in the customer page based on restaurantId
  // 1. hardcode the restaurand id in the landing page of customer 
  // 2. Use useGetProducts to get the products
  // 3. Render the products

  const { user } = useUser();
  const restaurantId = user?.restaurantId?._id ?? "";

  const { data, isLoading } = useGetProducts({ restaurantId });

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
