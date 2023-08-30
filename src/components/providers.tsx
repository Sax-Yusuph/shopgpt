"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    </NextThemesProvider>
  );
}
