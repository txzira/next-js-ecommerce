import React from "react";

const FormInput = ({
  id,
  className,
  label,
  placeholder,
  value,
  onChange,
  required,
  error,
}: {
  id: string;
  className: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: any;
  required: boolean;
  error: any;
}) => {
  return (
    <div className={className}>
      <label
        className="text-nowrap text-base font-semibold sm:text-lg"
        htmlFor={id}>
        {label}
      </label>
      <input
        required={required}
        className="h-10 rounded-md border border-gray-400 px-1 text-sm sm:text-base "
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && <p className="text-sm text-red-500">*{error}</p>}
    </div>
  );
};

export default FormInput;
