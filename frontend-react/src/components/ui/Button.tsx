import clsx from "clsx";
import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  btnStyle: "approve" | "cancel" | "details" | "options" | "danger";
  size: "small" | "medium" | "big";
  children: React.ReactNode;
  additionalStyle?: string;
}

const Button = ({
  btnStyle,
  size,
  children,
  additionalStyle,
  ...props
}: ButtonProps) => {
  const typeStyle = {
    approve:
      "bg-primary text-white dark:text-black hover:bg-primary-hover transition-colors",
    details:
      "border border-blue-400 text-blue-400 hover:border-blue-300 hover:text-blue-300 transition-colors",
    cancel:
      "border border-gray-400 text-gray-400 hover:text-gray-300 transition-colors",
    options:
      "w-full border border-gray-500 hover:text-gray-300 hover:border-gray-400 justify-between! transition-colors",
    danger: "bg-red-500 text-white hover:bg-red-400 transition-colors",
  }[btnStyle];

  const sizeStyle = {
    small: "py-0 px-2",
    medium: "py-1 px-2",
    big: "py-2 px-2",
  }[size];

  const finalStyle = clsx(
    "flex justify-center items-center gap-2 cursor-pointer",
    typeStyle,
    additionalStyle,
    sizeStyle,
  );

  return (
    <button className={finalStyle} {...props}>
      {children}
    </button>
  );
};

export default Button;
