"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-50">{children}</div>
    </div>
  );
}

function DialogTrigger({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <span onClick={onClick}>{children}</span>;
}

function DialogContent({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-4", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold text-slate-800", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-slate-500", className)} {...props} />;
}

function DialogClose({ children, onClick }: { children?: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
      {children ?? <X size={16} />}
    </button>
  );
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("fixed inset-0 bg-black/40", className)} {...props} />;
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
