"use client";
import { useForm } from "react-hook-form";
import { Product } from "./products/products";
import { useAddToCart } from "../queries/cart";
import { nanoid } from "nanoid";
import { PriceFormatter } from "../utils/helpers/helpers";
type Ingredients = {
  smorelse: string[];
  drissing: string[];
  fravaelge: string[];
};
type FormData = {
  ingredients: Ingredients;
  quantity: number;
  price: number;
};

export default function IngredientsSelection({
  product,
}: {
  product: Product;
}) {
  const ingredients: {
    title: string;
    name: keyof Ingredients;
    items: string[];
  }[] = [
    {
      title: "smørelse",
      name: "smorelse",
      items: ["Humus", "Tzaziki"],
    },
    {
      title: "drissing",
      name: "drissing",
      items: ["skanderborg", "hvidløg", "chili", "youghurt"],
    },
    {
      title: "Fravælge",
      name: "fravaelge",
      items: ["salat", "tomate", "løg"],
    },
  ];
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      ingredients: {
        smorelse: ["Humus"],
        drissing: ["skanderborg"],
        fravaelge: [],
      },
      quantity: 1,
    },
  });
  const quantity = watch("quantity");
  const totalPrice = PriceFormatter((quantity || 1) * product.price);
  const { mutate, isSuccess, isError, isPending } = useAddToCart();

  const onSubmit = (data: FormData) => {
    const { quantity, ingredients } = data;

    const payload = {
      cartId: localStorage.getItem("cartId") || nanoid(),
      product: { name: product.name, id: product.id, price: product.price },
      ingredients,
      quantity,
    };
    mutate({ ...payload });
    localStorage.setItem("cartId", payload.cartId);
  };

  return (
    <div className="absolute top-40 right-10 w-60 z-50 overflow-y-auto border-2 py-5 px-3 bg-white rounded">
      <h1 className="text-lg font-semibold mb-4">Build your {product.name}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {ingredients.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-5">
            <h2 className="font-bold pb-2 pt-5 capitalize">{group.title}</h2>
            {group.items.map((item, itemIndex) => (
              <div className="p-1" key={itemIndex}>
                <input
                  type="checkbox"
                  value={item}
                  {...register(`ingredients.${group.name}` as const)}
                  id={`${group.name}-${itemIndex}`}
                />
                <label className="ml-2" htmlFor={`${group.name}-${itemIndex}`}>
                  {item}
                </label>
              </div>
            ))}
          </div>
        ))}
        {/* Quantity Input */}
        <div className="mb-5">
          <label htmlFor="quantity" className="block font-bold pt-2 pb-1">
            Antal (Quantity)
          </label>
          <input
            type="number"
            id="quantity"
            {...register("quantity", { valueAsNumber: true })}
            className="border p-2 w-full rounded"
            min={1}
          />
        </div>

        {isSuccess && <p className="text-green-600">Added!</p>}
        {isError && <p className="text-red-600">Failed to add item.</p>}
        <button
          type="submit"
          disabled={isPending}
          className="bg-orange-700 text-white px-4 py-2 rounded"
        >
          {isPending ? "Adding..." : ` ${totalPrice}- Tilføj til indkøbskurv`}
        </button>
      </form>
    </div>
  );
}
