"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const variantClasses: Record<string, string> = {
  default: "bg-teal-600 text-white hover:bg-teal-700",
  outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-800",
  ghost: "hover:bg-slate-100 text-slate-700",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  link: "text-teal-600 underline-offset-4 hover:underline",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
};

const sizeClasses: Record<string, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-10 px-6 text-base",
  icon: "h-9 w-9",
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

export { Button as default };
