"use client";

interface QuantitySelectorProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="text-sm font-bold">Quantity</div>
      <div className="inline-flex items-center border rounded overflow-hidden">
        <button
          type="button"
          onClick={onDecrease}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <div className="px-4 py-2 min-w-[3rem] text-center">{quantity}</div>

        <button
          type="button"
          onClick={onIncrease}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  );
}

