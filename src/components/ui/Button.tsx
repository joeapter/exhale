import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "sand";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#3D2E22] text-[#FAF7F2] border border-[#3D2E22] hover:bg-[#2A1F16] hover:border-[#2A1F16]",
  outline:
    "bg-transparent text-[#3D2E22] border border-[#B89080]/60 hover:border-[#B89080] hover:bg-[#B89080]/8",
  ghost:
    "bg-transparent text-[#7A6A5A] border border-transparent hover:text-[#3D2E22]",
  sand:
    "bg-[#F5EFE7] text-[#3D2E22] border border-[#E4D8C9] hover:bg-[#E4D8C9]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-[0.7rem] tracking-[0.16em]",
  md: "px-7 py-3 text-[0.75rem] tracking-[0.18em]",
  lg: "px-9 py-4 text-[0.8125rem] tracking-[0.18em]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, href, children, ...props }, ref) => {
    const base = cn(
      "inline-flex items-center justify-center font-light transition-all duration-300 uppercase",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B89080]/50",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={base}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={base} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
