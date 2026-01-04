import React from "react";
type Props = {
  label: string;
  value: string | undefined;
  isRequired: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputName?: string;
  placeholder?: string;
  error?: string;
  type: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

function InputTextField({
  label,
  value,
  isRequired,
  onChange,
  inputName,
  placeholder,
  error,
  type,
  onBlur,
}: Props) {
  return (
    <div className="relative mt-3 ">
      <input
        type={type}
        className={`peer w-full border  pl-2 pt-2 h-10 placeholder:text-transparent ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
        name={inputName}
        onBlur={onBlur}
      />
      <label
        htmlFor="email"
        className="absolute left-0 top-1 ml-1 -translate-y-3 bg-white px-1 text-sm duration-100 ease-linear peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm"
      >
        {label}
      </label>
      {isRequired && (
        <span className="text-sm pl-2 text-gray-500">required</span>
      )}
      {error && (
        <div className="text-sm text-red-500 pl-2">
          {error}
        </div>
      )}
    </div>
  );
}

export default InputTextField;
