"use client";
import IngredientsSelection from "./ingredients-selection";
import { useState, useEffect, useRef } from "react";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import { GiShoppingCart } from "react-icons/gi";
import { Product } from "@/app/types";
export default function ProductItem({ product, isOpen }: { product: Product, isOpen?: boolean }) {
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
      <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 flex gap-4 ${!isOpen ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>
        {/* Product Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={product.imageUrl || "https://placehold.co/400x400?text=Food"}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl bg-gray-50 shadow-inner"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/400x400?text=Food";
            }}
          />
          {!isOpen && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-xl">
              <span className="text-[10px] font-bold text-white bg-red-600/80 px-2 py-0.5 rounded-full uppercase tracking-wider">Closed</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">{product.name}</h2>
              <div className="flex flex-wrap gap-x-2 mt-1">
                {product.ingredients?.slice(0, 3).map((ingredient) => (
                  <span
                    key={ingredient._id}
                    className="text-[11px] text-gray-500 font-medium"
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
            <p className="text-orange-600 font-extrabold text-xl">
              {PriceFormatter(product.price)}
            </p>
            <button
              onClick={() => isOpen && setShowIngredients(true)}
              disabled={!isOpen}
              className={`text-white flex items-center gap-2 font-bold px-5 py-2 rounded-full shadow-md transition-all duration-200 ${!isOpen
                  ? 'bg-gray-400 cursor-not-allowed opacity-50 shadow-none'
                  : 'bg-orange-500 hover:bg-orange-600 hover:shadow-orange-200 active:scale-95'
                }`}
            >
              <span className="text-sm">{!isOpen ? 'Closed' : 'Add'}</span>
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
