import { PriceFormatter } from '@/app/utils/helpers/helpers';
import React from 'react'

interface CheckboxInputProps {
  isChecked: boolean;
  onChange: () => void;
  label: string;
  cost?: number; // If provided, shows cost in green
  showLineThrough?: boolean;
}

function CheckboxInput({ isChecked, onChange, label, cost = 0, showLineThrough=false}: CheckboxInputProps) {
    const textStyle = `text-gray-700 text-sm ${
      !isChecked && showLineThrough ? "line-through" : ""
    }`;
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="appearance-none w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-orange-500 checked:border-orange-500 relative checked:after:content-[''] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:w-2 checked:after:h-2 checked:after:bg-white checked:after:rounded-full accent-orange-500"
      />
      <span className={textStyle}>
        {label}
        {cost !== undefined && cost !== 0 && (
          <span className={`text-green-500 ml-2`}>{PriceFormatter(cost)}</span>
        )}
      </span>
    </label>
  );
}

export default CheckboxInput
