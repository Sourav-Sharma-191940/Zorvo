"use client";

import type { CSSProperties } from "react";
import { toast as sonner, Toaster as SonnerToaster } from "sonner";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { useTheme } from "@/shared/theme/ThemeProvider";

/**
 * App-wide notifications. Always import from here, never from "sonner"
 * directly, so the library can be swapped without touching features.
 *
 *   toast.success("Loan added");
 *   toast.error("Couldn't save", { description: error.message });
 */
export const toast = {
  success: (message: string, options?: ToastOptions) => sonner.success(message, options),
  error: (message: string, options?: ToastOptions) => sonner.error(message, options),
  warning: (message: string, options?: ToastOptions) => sonner.warning(message, options),
  info: (message: string, options?: ToastOptions) => sonner.info(message, options),
  dismiss: (id?: string | number) => sonner.dismiss(id),
};

export interface ToastOptions {
  description?: string;
  /** Milliseconds; defaults to 4000. */
  duration?: number;
  /** Stable id: a repeated toast with the same id replaces the previous one. */
  id?: string | number;
  action?: { label: string; onClick: () => void };
}

/** Mount once in the root layout. Styled from the global theme. */
export function Toaster() {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      closeButton
      gap={8}
      icons={{
        success: <CircleCheck size="1rem" className="text-success" />,
        error: <CircleAlert size="1rem" className="text-destructive" />,
        warning: <TriangleAlert size="1rem" className="text-warning" />,
        info: <Info size="1rem" className="text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast: "font-sans! text-xs! shadow-toast! rounded-lg!",
          title: "font-semibold!",
          description: "text-muted-foreground! text-2xs!",
          actionButton: "bg-primary! text-primary-foreground! rounded-sm! text-2xs!",
        },
      }}
      // Sonner reads these variables, so toasts follow our theme in light and dark.
      style={
        {
          zIndex: "var(--z-toast)",
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--r-lg)",
        } as CSSProperties
      }
    />
  );
}
