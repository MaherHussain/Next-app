import { useState } from "react";
import { PriceFormatter } from '@/app/utils/helpers/helpers';
import { useDeleteItemFromCart } from "@/app/queries/cart";
import { useCart } from "@/hooks/useCart";
import { CartItem, Ingredient } from "@/app/types";
import { MdDeleteForever } from "react-icons/md";
interface Props {
  items: CartItem[];
  total: number;
}
export interface Item {
  product: { name: string; id: string; price: number };
  quantity: number;
  ingredients: Record<string, any[]> | undefined;
}
export default function OrderOverview({ items, total }: Props) {
  function totalAmountOfItem(item: any) {
    const basePrice = item.product.price || 0;
    return basePrice * item.quantity;
  }

  const { cartId } = useCart();

  const { mutate: RemoveItem } = useDeleteItemFromCart(cartId);

  return (
    <div className=" bg-white max-h-screen shadow-lg overflow-auto rounded-2xl p-6  text-gray-800">
      <h2 className="text-2xl font-semibold text-center">Order overview</h2>

      {items &&
        items.map((item, index) => {
          let removedIngredients: Ingredient[] = [];
          let ingredientGroups: [string, Ingredient[]][] | [] = [];
          if (item.ingredients) {
            removedIngredients = item.ingredients["Removed Ingredients"];
            ingredientGroups = Object.entries(item.ingredients).filter(
              ([group]) => group !== "Removed Ingredients"
            );
          }
          return (
            <div key={index} className="border-t py-4 space-y-2 px-2">
              <div className="flex justify-between items-start ">
                <p className="px-2">{item.quantity} x </p>
                <div className="w-1/2 cursor-pointer">
                  <span className="font-medium">{item.product.name}</span>
                  <div className="mt-2 space-y-1">
                    {removedIngredients &&
                      removedIngredients.map((r) => (
                        <span
                          key={r._id}
                          className="text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs"
                        >
                          {r.name}
                        </span>
                      ))}
                  </div>

                  {ingredientGroups &&
                    ingredientGroups.map(([group, ingredients], index) => {
                      return (
                        <div key={index} className="mt-3 space-y-1">
                          <div className="font-semibold text-gray-600 capitalize">
                            {group}
                          </div>
                          {ingredients &&
                            ingredients.map((ing: Ingredient) => {
                              return (
                                <div
                                  className="flex flex-row space-x-4"
                                  key={ing._id}
                                >
                                  <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                                    {ing.name}
                                  </span>
                                  <span>
                                    {Number(ing.cost) !== 0
                                      ? PriceFormatter(Number(ing.cost))
                                      : ""}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                </div>
                <span>{PriceFormatter(totalAmountOfItem(item))}</span>
                <div
                  onClick={() => RemoveItem(item)}
                  className="cursor-pointer text-xl hover:text-red-500 px-2"
                >
                  <MdDeleteForever />
                </div>
              </div>
            </div>
          );
        })}

      <div className="flex justify-between font-bold text-lg pt-2 border-t">
        <span>Total</span>
        <span>{PriceFormatter(total)}</span>
      </div>
    </div>
  );
}
