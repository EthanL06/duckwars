import React from "react";
import { cn } from "../../lib/utils";

type ButtonProps = {
  variant: "fire" | "ready" | "unready";
  onClick: () => void;
  className?: string;
};

const Button = ({ variant = "fire", onClick, className }: ButtonProps) => {
  switch (variant) {
    case "fire":
      return (
        <button
          onClick={onClick}
          className={cn(
            "mx-auto w-full max-w-[400px] rounded-full bg-gradient-to-b from-[#FF5574] to-[#AE0020] py-4 text-center text-3xl font-bold text-white  outline outline-[4px] -outline-offset-[10px] outline-[#FFD542]  hover:from-[#AE0020] hover:to-[#ae0020c1] active:from-[#AE0020] active:to-[#ae0020c1]",
            className,
          )}
        >
          Fire
        </button>
      );
    case "ready":
      return (
        <button
          onClick={onClick}
          className={cn(
            " mx-auto w-full max-w-[400px] rounded-full bg-gradient-to-b from-[#FFE03F] to-[#E29014] py-4 text-center text-3xl font-bold text-white  hover:from-[#FFD700] hover:to-[#FF8C00] active:from-[#FFD700] active:to-[#FF8C00]",
            className,
          )}
        >
          Ready
        </button>
      );
    case "unready":
      return (
        <button
          onClick={onClick}
          className={cn(
            " mx-auto w-full max-w-[400px] rounded-full bg-gradient-to-b from-[#FF5574] to-[#AE0020] py-4 text-center text-3xl font-bold text-white  hover:from-[#AE0020] hover:to-[#ae0020c1] active:from-[#AE0020] active:to-[#ae0020c1]",
            className,
          )}
        >
          Unready
        </button>
      );
    default:
      return null;
  }
};
export default Button;
