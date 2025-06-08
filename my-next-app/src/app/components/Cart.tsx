"use client";
import { useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useGetCartById } from "../queries/cart";
import Link from "next/link";
import { useCartId } from "@/hooks/useCartId";

export default function Cart() {
  const cartId = useCartId();
  const { data: cart } = useGetCartById(cartId || "");

  const totalItems =
    cart?.items?.reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0
    ) ?? 0;
  return (
    <Link href="/cart">
      <div className="relative">
        <FiShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  );
}
