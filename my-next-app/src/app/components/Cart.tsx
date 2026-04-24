"use client";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useGetCartById } from "../queries/cart";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function Cart() {
  const { cartId } = useCart();
  const { restaurantId } = useParams();
  const { data: cart } = useGetCartById(cartId || "");

  const totalItems =
    cart?.items?.reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0
    ) ?? 0;
  return (
    <Link href={`/customer/${restaurantId}/cart`}>
      <div className="relative">
        <FiShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2   bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      </div>
    </Link>
  );
}
