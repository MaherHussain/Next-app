"use client";
import { useGetCartById } from "../queries/cart";
import OrderOverview, { Item } from "../components/order/order-overview";
import { useCart } from "@/hooks/useCart";
import OrderDetails from "../components/order/order-details";
import LoadingSpinner from "../components/shared/loading-spinner";

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
    <div className="flex flex-row flex-wrap ">
      <div className="w-1/2 border">
        <OrderDetails />
      </div>
      <div className="w-1/2">
        {isPending ? (
          <div className="w-full h-full mt-[50%] ml-[50%]">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <OrderOverview items={items} total={cartData.total} />
        )}
      </div>
    </div>
  );
}
