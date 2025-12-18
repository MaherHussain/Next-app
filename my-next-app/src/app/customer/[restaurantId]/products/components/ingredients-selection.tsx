"use client";
import { Product } from "@/app/types";
import AddToCartModal from "./product-ingredients-selection/add-to-cart-modal";
import SimpleProductForm from "./product-ingredients-selection/simple-product-form";
import IngredientsProductForm from "./product-ingredients-selection/ingredients-product-form";

export default function IngredientsSelection({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  // Check if product has ingredients to select
  const hasIngredients = product.ingredients && product.ingredients.length > 0;

  return (
    <AddToCartModal product={product} onClose={onClose}>
      {hasIngredients ? (
        <IngredientsProductForm product={product} onClose={onClose} />
      ) : (
        <SimpleProductForm product={product} onClose={onClose} />
      )}
    </AddToCartModal>
  );
}
