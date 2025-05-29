"use client";

export interface Product {
  name: string;
  price: string | number;
}
export default function ProductItem({ name, price }: Product) {
  return (
    <div className="flex flex-row flex-wrap gap-24 border-y-2 cursor-pointer py-5 w-300">
      <p>{name}</p>
      <p>{price} DKK</p>
    </div>
  );
}
