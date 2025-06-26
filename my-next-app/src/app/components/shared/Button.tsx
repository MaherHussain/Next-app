import React, { ReactNode } from "react";
import LoadingSpinner from "./loading-spinner";

interface ButtonProps {
  children?: ReactNode;
  isDisabled?: boolean;
  clickHandler: () => void;
  buttonText?: string;
  isLoading?: boolean;
}
export default function Button({
  children,
  isDisabled,
  clickHandler,
  buttonText,
  isLoading,
}: ButtonProps) {
  return (
    <button
      disabled={isDisabled || isLoading}
      onClick={clickHandler}
      className={`text-center px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-black  hover:from-orange-600 hover:to-black transition ${
        isDisabled || isLoading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
      }`}
    >
      {children || buttonText}
      {isLoading && <LoadingSpinner size="small" />}
    </button>
  );
}
