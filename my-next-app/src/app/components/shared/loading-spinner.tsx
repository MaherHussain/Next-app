import React from "react";
type Props = {
  size?: "small" | "large";
};

function LoadingSpinner({ size }: Props) {
  return (
    <div
      className={`${
        size === "large" ? "h-10 w-10" : "h-5 w-5"
      }  animate-spin rounded-full border-4 border-solid mx-2 border-gray-300 border-t-orange-500 inline-block align-middle`}
    ></div>
  );
}

export default LoadingSpinner;
