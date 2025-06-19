"use client";
import { useGetCartById } from "../queries/cart";
import OrderOverview, { Item } from "../components/order/order-overview";
import { useCart } from "@/hooks/useCart";
import OrderDetails from "../components/order/order-details";
import LoadingSpinner from "../components/shared/loading-spinner";
import Link from "next/link";

export default function cart() {
  const { cartId } = useCart();

  const { data: cartData, isPending } = useGetCartById(cartId || "");

  const items: Item[] = cartData?.items.map((item: any) => {
    return {
      product: item.product,
      ingredients: {
        smorelse: [...item.ingredients.smorelse],
        drissing: [...item.ingredients.drissing],
        unchoose: [...item.ingredients.fravaelge],
      },
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    };
  });

  return (
    <div className=" flex items-center justify-center w-full h-full">
      {isPending && (
        <div className="mt-[15%]">
          <LoadingSpinner size="large" />
        </div>
      )}
      {!cartData?.length && !isPending && (
        <div className="flex items-center justify-center flex-col mt-[10%]">
          <p className="my-5">No Items have been added yet</p>

          <Link
            className="w-full text-center p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-black 
      transition"
            href="/"
          >
            Shop now
          </Link>
        </div>
      )}
    </div>
  );
}
