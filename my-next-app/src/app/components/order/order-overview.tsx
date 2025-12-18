import React from "react";
import { PriceFormatter } from "../../utils/helpers/helpers";
export interface Item {
  product: { name: string; id: string; price: number };
  quantity: number;
  ingredients: Record<string, any[]> | undefined;
}
export default function OrderOverview({
  items,
  total,
}: {
  items: Item[];
  total: number;
}) {
  function totalAmountOfItem(item: any) {
    const basePrice = item.product.price || 0;
    let ingredientsCost = 0;

    // Calculate total cost of ingredients
    if (item.ingredients) {
      Object.values(item.ingredients).forEach((ingredientArray: any) => {
        if (Array.isArray(ingredientArray)) {
          ingredientArray.forEach((ingredient: any) => {
            if (
              typeof ingredient === "object" &&
              ingredient !== null &&
              ingredient.cost
            ) {
              ingredientsCost += ingredient.cost || 0;
            }
          });
        }
      });
    }

    return basePrice * item.quantity;
  }

  return (
    <div className="max-w-md mx-auto bg-white max-h-screen shadow-lg overflow-auto rounded-2xl p-6  text-gray-800">
      <h2 className="text-2xl font-semibold text-center">Order overview</h2>

      {items &&
        items.map((item, index) => {
          let removedIngredients = [];
          let ingredientGroups:
            | [string, Record<string, string | number>[]][]
            | [] = [];

          if (item.ingredients) {
            removedIngredients = item.ingredients["Removed Ingredients"];
            ingredientGroups = Object.entries(item.ingredients).filter(
              ([group]) => group !== "Removed Ingredients"
            );
          }
          return (
            <div key={index} className="border-t py-4 space-y-2 px-2">
              <div className="flex justify-between items-start ">
                <p>{item.quantity} x</p>
                <div className="w-1/2">
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
                    ingredientGroups.map(([group, ingredients]) => {
                      return (
                        <div key={index} className="mt-3 space-y-1">
                          <div className="font-semibold text-gray-600 capitalize">
                            {group}
                          </div>
                          {ingredients &&
                            ingredients.map(
                              (ing: Record<string, string | number>) => {
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
                              }
                            )}
                        </div>
                      );
                    })}
                </div>
                <span>{PriceFormatter(totalAmountOfItem(item))}</span>
              </div>
            </div>
          );
        })}

      <div className="pt-4 border-t space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{PriceFormatter(total)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{PriceFormatter(total)}</span>
        </div>
      </div>
    </div>
  );
}
