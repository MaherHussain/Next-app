"use client";

import { useGetProducts } from "../../queries/products";
import ProductItem from "./product-item";

export default function Products() {
  const { data, isLoading } = useGetProducts();

  return (
    <div className="bg-white text-black  w-500 p-20">
      <h1>Products</h1>

      <div className="flex flex-row gap-20 flex-wrap">
        {isLoading && <span>loading....</span>}
        {data?.data &&
          data.data.map((product) => {
            return (
              <div key={product.name}>
                <ProductItem name={product.name} price={product.price} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
