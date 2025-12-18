"use client";
import { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";
import { Product } from "@/app/types";
import { PriceFormatter } from "@/app/utils/helpers/helpers";

interface AddToCartModalProps {
  product: Product;
  onClose: () => void;
  children: ReactNode;
}

export default function AddToCartModal({
  product,
  onClose,
  children,
}: AddToCartModalProps) {
  return (
    <div className=" fixed inset-0 overflow-y-auto h-screen bg-black/40 z-50">
      <div className="relative z-40 mx-10 my-8 p-5 border-2 outline-none bg-white rounded">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-1 right-1 w-auto  rounded p-2  hover:bg-gray-100"
          aria-label="Close modal"
          title="Close"
        >
          <IoMdClose className="h-6 w-6 text-gray-800" />
        </button>
        <h1 className="lg:text-3xl md:text-2xl sm:text-xl  font-semibold mb-4">
          {product.name}
        </h1>{" "}
        {children}
      </div>
    </div>
  );
}

