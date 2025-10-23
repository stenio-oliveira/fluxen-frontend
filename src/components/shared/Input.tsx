import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
  error?: boolean;
  helperText?: string;
};

export default function Input({
  label = "",
  id = "",
  className = "",
  error = false,
  helperText,
  required = false,
  ...rest
}: Props) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="mb-2 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        id={id}
        {...rest}
        className={
          "w-full rounded-md border-1 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-inner transition-shadow focus:outline-none focus:ring-2 " +
          (error
            ? "border-red-500 bg-red-50 focus:ring-red-300"
            : "border-gray-200 bg-gray-50 focus:ring-blue-300"
          ) +
          " " + className
        }
      />

      {helperText && (
        <span className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
          {helperText}
        </span>
      )}
    </div>
  );
}
