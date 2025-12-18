"use client";
import { useGetCartById } from "@/app/queries/cart";
import OrderOverview, { Item } from "@/app/components/order/order-overview";
import { useCart } from "@/hooks/useCart";
import OrderDetails from "@/app/components/order/order-details";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import Link from "next/link";

export default function cart() {
  const { cartId } = useCart();

  const { data: cartData, isPending } = useGetCartById(cartId || "");

  const items: Item[] = cartData?.items.map((item: any) => {
    return {
      product: item.product,
      ingredients: {
        ...item.ingredients,
      },
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    };
  });

  return (
    <div className="">
      {isPending && (
        <div className="mt-[15%] ml-[50%]">
          <LoadingSpinner size="large" />
        </div>
      )}
      {!cartData?.items.length && !isPending && (
        <div className="flex items-center justify-center flex-col mt-[10%]">
          <p className="my-5">No Items have been added yet</p>

          <Link
            className=" text-center px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-black transition"
            href="/"
          >
            Shop now
          </Link>
        </div>
      )}
      {cartData?.items.length && !isPending && (
        <div className="flex  flex-col md:flex-row gap-3">
          <div className="w-full md:w-1/2">
            <OrderDetails />
          </div>
          <div className="w-full md:w-1/2">
            <OrderOverview items={items} total={cartData?.total} />
          </div>
        </div>
      )}
    </div>
  );
}
