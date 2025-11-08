"use client";
import { useForm } from "react-hook-form";
import { Product } from "@/app/types";
import { useAddToCart } from "../../queries/cart";
import { nanoid } from "nanoid";
import { PriceFormatter } from "../../utils/helpers/helpers";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";

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
  onClose,
}: {
  product: Product;
  onClose: () => void;
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
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
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

  function DecreaseQuantity() {
    const currentQuantity = quantity || 1;
    const newQuantity = Math.max(1, currentQuantity - 1);
    setValue("quantity", newQuantity, { shouldValidate: true });
  }
  function IncreaseQuantity() {
    const currentQuantity = quantity || 1;
    const newQuantity = Math.max(1, currentQuantity + 1);
    setValue("quantity", newQuantity, { shouldValidate: true });
  }
  const totalPrice = PriceFormatter((quantity || 1) * product.price);
  const { mutate, isSuccess, isError, isPending } = useAddToCart();
  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [isSuccess, onClose]);
  const onSubmit = (data: FormData) => {
    const { quantity, ingredients } = data;

    const payload = {
      cartId: localStorage.getItem("cartId") || nanoid(),
      product: { name: product.name, id: product._id, price: product.price },
      ingredients,
      quantity,
    };
    mutate({ ...payload });
    localStorage.setItem("cartId", payload.cartId);
  };

  return (
    <>
      <div className="fixed inset-0  bg-black/40  z-50">
        <div className="h-[calc(100%-3rem)] overflow-y-auto z-40  m-6 p-5 border-2 outline-none  bg-white rounded ">
          <button
            type="button"
            onClick={() => onClose()}
            className="absolute top-1 right-1 w-auto  bg-white rounded-full p-2 shadow hover:bg-gray-100"
            aria-label="Close modal"
            title="Close"
          >
            <IoMdClose className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-lg font-semibold mb-4">
            Build your {product.name}
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-[calc(100%-3rem)] space-y-10 "
          >
            <div className="flex flex-row  px-4 justify-between flex-wrap md:gap-6">
              {ingredients.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-5 px-10">
                  <h2 className="font-bold pb-2 pt-5 capitalize">
                    {group.title}
                  </h2>
                  {group.items.map((item, itemIndex) => (
                    <div className="p-1 flex items-center" key={itemIndex}>
                      <input
                        type="checkbox"
                        value={item}
                        {...register(`ingredients.${group.name}` as const)}
                        id={`${group.name}-${itemIndex}`}
                        className="h-4 w-4 rounded text-orange-600 border-gray-300"
                      />
                      <label
                        className="ml-2"
                        htmlFor={`${group.name}-${itemIndex}`}
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* spacer to push footer to the bottom */}
            <div className="flex-grow" />
            <div className=" justify-end">
              {/* Quantity Input */}
              <div className="mb-5 flex items-center gap-3">
                <div className="text-sm font-bold">Quantity</div>
                <div className="inline-flex items-center border rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => DecreaseQuantity()}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <div className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity || 1}
                  </div>

                  <button
                    type="button"
                    onClick={() => IncreaseQuantity()}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

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
        </div>
      </div>
    </>
  );
}
