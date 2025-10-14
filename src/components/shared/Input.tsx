import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  id?: string;
};

export default function Input({
  label = "",
  id = "",
  className = "",
  ...rest
}: Props) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="mb-2 text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        id={id}
        {...rest}
        className={
          "w-full rounded-md border-1 border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 shadow-inner transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-300 " +
          className
        }
      />
    </div>
  );
}
