import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded bg-slate-900 text-white
        hover:bg-slate-800 transition
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}
