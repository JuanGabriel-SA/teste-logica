import { ReactNode } from "react";
import "./BaseButton.css";

type ButtonVariant = "primary" | "secondary";

interface BaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const BaseButton = ({
  children,
  variant,
  icon,
  className = "",
  ...props
}: BaseButtonProps) => {
  return (
    <button
      className={`base-button ${
        variant ? `base-button--${variant}` : ""
      } ${className}`.trim()}
      {...props}
    >
      {icon && <span className="base-button__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default BaseButton;
