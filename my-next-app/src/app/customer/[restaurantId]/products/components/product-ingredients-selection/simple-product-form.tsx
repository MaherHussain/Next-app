"use client";
import { useForm } from "react-hook-form";
import { Product } from "@/app/types";
import { useAddToCart } from "@/app/queries/cart";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import {QuantitySelector} from "./";
import { useCart } from "@/hooks/useCart";

type FormData = {
  quantity: number;
};

interface SimpleProductFormProps {
  product: Product;
  onClose: () => void;
}

export default function SimpleProductForm({
  product,
  onClose,
}: SimpleProductFormProps) {
  const { handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      quantity: 1,
    },
  });

  const quantity = watch("quantity");

  function DecreaseQuantity() {
    const currentQuantity = quantity || 1;
    const newQuantity = Math.max(1, currentQuantity - 1);
    setValue("quantity", newQuantity, { shouldValidate: true });
  }

  function IncreaseQuantity() {
    const currentQuantity = quantity || 1;
    const newQuantity = currentQuantity + 1;
    setValue("quantity", newQuantity, { shouldValidate: true });
  }

  const totalPrice = PriceFormatter((quantity || 1) * product.price);

  const { cartId } = useCart();
  const { mutate, isSuccess, isError, isPending } = useAddToCart({ cartId });

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [isSuccess, onClose]);

  const onSubmit = (data: FormData) => {
    const { quantity } = data;

    const payload = {
      cartId: localStorage.getItem("cartId") || nanoid(),
      product: { name: product.name, id: product._id, price: product.price },
      ingredients: {},
      quantity,
    };
    mutate(payload);
    localStorage.setItem("cartId", payload.cartId);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full items-center"
    >
      <div className="justify-center">
        <QuantitySelector
          quantity={quantity || 1}
          onDecrease={DecreaseQuantity}
          onIncrease={IncreaseQuantity}
        />

        {isSuccess && <p className="text-green-600">Added!</p>}
        {isError && <p className="text-red-600">Failed to add item.</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-orange-700 text-white px-4 py-2 rounded"
        >
          {isPending ? "Adding..." : ` ${totalPrice}- Add to cart`}
        </button>
      </div>
    </form>
  );
}
