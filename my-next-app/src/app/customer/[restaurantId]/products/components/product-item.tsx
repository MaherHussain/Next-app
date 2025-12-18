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
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="flex flex-row justify-between">
          <div>
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-500 text-lg font-bold">
              {PriceFormatter(product.price)}
            </p>
          </div>
          <div className="inline-block self-end mt-4">
            <button
              onClick={() => setShowIngredients(true)}
              className="text-white hover:text-gray-600 flex items-center gap-1 font-semibold bg-green-500 px-3 py-2 rounded-md"
            >
              <span className="text-sm">Add</span>{" "}
              <GiShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
          <div>
            {product.ingredients?.map((ingredient) => (
              <span
                key={ingredient._id}
                className="inline-block text-gray-700 px-2 py-1 rounded"
              >
                {ingredient.name}
              </span>
            ))}
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
