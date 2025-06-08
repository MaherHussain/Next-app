"use client";

import IngredientsSelection from "../ingredients-selection";
import { useState, useEffect, useRef } from "react";
import { Product } from "./products";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
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
    <div
      className="flex flex-row flex-wrap gap-24 border-y-2 cursor-pointer py-5 w-300"
      onClick={() => setShowIngredients(true)}
    >
      <p>{product.name}</p>
      <p>{PriceFormatter(product.price)} </p>
      {showIngredients && (
        <div ref={panelRef}>
          <IngredientsSelection product={product} />
        </div>
      )}
    </div>
  );
}
