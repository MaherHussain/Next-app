import React from "react";
import { PriceFormatter } from "../../utils/helpers/helpers";
export interface Item {
  product: { name: string; id: string; price: number };
  quantity: number;
  ingredients: {
    smorelse: string[];
    drissing: string[];
    unchoose: string[];
  };
}
export default function OrderOverview({
  items,
  total,
}: {
  items: Item[];
  total: number;
}) {
  function totalAmountOfItem(item: any) {
    return item.product.price * item.quantity;
  }
  const moms = (total * 25) / 100;

  return (
    <div className="max-w-md mx-auto bg-white max-h-screen shadow-lg overflow-auto rounded-2xl p-6  text-gray-800">
      <h2 className="text-2xl font-semibold text-center">Ordreoversigt</h2>
      <div className="flex justify-start items-left font-medium">
        <span className="w-1/4">Antal</span>
        <span className="w-1/2 text-left">Vare</span>
        <span className="w-1/4 text-right">Pris</span>
      </div>
      {items &&
        items.map((item, index) => {
          return (
            <div key={index} className="border-t py-4 space-y-2 px-2">
              <div className="flex justify-between items-center  pb-2">
                <p>{item.quantity}</p>
                <div className="w-1/2">
                  <span className="">{item.product.name}</span>
                  <div className="space-x-4">
                    {item.ingredients.smorelse.length ? (
                      item.ingredients.smorelse.map((s, index) => (
                        <div key={index}>{s}</div>
                      ))
                    ) : (
                      <div className="px-5">-</div>
                    )}
                  </div>
                  <div className="space-x-4">
                    {item.ingredients.drissing.length ? (
                      item.ingredients.drissing.map((d, index) => (
                        <span key={index}>{d}</span>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
                <span>{PriceFormatter(totalAmountOfItem(item))}</span>
              </div>
              {item.ingredients.unchoose.length ? (
                <div className="pt-3  border-t flex flex-row justify-start gap-2 flex-wrap">
                  {item.ingredients.unchoose.map((u, index) => (
                    <span key={index}>- {u}</span>
                  ))}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          );
        })}

      <div className="pt-4 border-t space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{PriceFormatter(total)}</span>
        </div>
        <div className="flex justify-between">
          <span>Moms (25% inkluderet)</span>
          <span>{PriceFormatter(moms)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Total</span>
          <span>{PriceFormatter(total)}</span>
        </div>
      </div>
    </div>
  );
}
