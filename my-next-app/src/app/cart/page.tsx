"use client";

import { useGetCartById } from "../queries/cart";
import OrderOverview, { Item } from "../components/order-overview";
import { useCartId } from "@/hooks/useCartId";
import OrderDetails from "../components/order/order-details";

export default function cart() {
  const cartId = useCartId();

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
    <div className="flex flex-row flex-wrap ">
      <div className="w-1/2 border">
        <OrderDetails />
      </div>
      <div className="w-1/2">
        {isPending ? (
          <div>...loading</div>
        ) : (
          <OrderOverview items={items} total={cartData.total} />
        )}
      </div>
    </div>
  );
}
