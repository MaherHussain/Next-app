"use client";

import { useGetProducts } from "../../queries/products";
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
      <h1>Products</h1>

      <div className="flex flex-row gap-20 flex-wrap">
        {isLoading && <span>loading....</span>}
        {productsArr &&
          productsArr?.map((product) => {
            return (
              <div key={product?.id}>
                <ProductItem product={product} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
