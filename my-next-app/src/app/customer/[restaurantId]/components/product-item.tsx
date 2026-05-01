"use client";
import IngredientsSelection from "./ingredients-selection";
import { useState, useEffect, useRef } from "react";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import { GiShoppingCart } from "react-icons/gi";
import { Product } from "@/app/types";
export default function ProductItem({ product }: { product: Product }) {
  const [showIngredients, setShowIngredients] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setShowIngredients(false);
      }
    };

    if (showIngredients) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showIngredients]);

  return (
    <>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex gap-4">
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={product.imageUrl || "https://placehold.co/400x400?text=Food"}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg bg-gray-50"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Food";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h2>
              <div className="flex flex-wrap gap-x-2 mt-1">
                {product.ingredients?.slice(0, 3).map((ingredient) => (
                  <span
                    key={ingredient._id}
                    className="text-[11px] text-gray-400"
                  >
                    {ingredient.name}
                  </span>
                ))}
                {(product.ingredients?.length ?? 0) > 3 && (
                  <span className="text-[11px] text-gray-400">+{product.ingredients!.length - 3} more</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-orange-600 font-bold text-lg">
              {PriceFormatter(product.price)}
            </p>
            <button
              onClick={() => setShowIngredients(true)}
              className="text-white hover:bg-orange-600 flex items-center gap-2 font-bold bg-orange-500 px-4 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-200"
            >
              <span className="text-sm">Add</span>
              <GiShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {showIngredients && (
        <IngredientsSelection
          product={product}
          onClose={() => setShowIngredients(false)}
        />
      )}
    </>
  );
}
