import React, { forwardRef } from "react";
import "./InputField.css";
import { TbAlertTriangle } from "react-icons/tb";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div
        className={`input-field ${className} ${
          error ? "input-field--error" : ""
        }`.trim()}
      >
        <label>{label}</label>
        <input ref={ref} {...props} />
        {error && (
          <span className="input-error flex items-center gap-2 text-sm text-red-500 mt-2">
            <TbAlertTriangle /> Este campo é obrigatório.
          </span>
        )}
      </div>
    );
  }
);

export default InputField;
