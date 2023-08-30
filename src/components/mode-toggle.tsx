"use client";

import { useTheme } from "next-themes";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@/components/ui/icons";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [_, startTransition] = React.useTransition();

  return (
    <Button
      variant="outline"
      onClick={() => {
        startTransition(() => {
          setTheme(theme === "light" ? "dark" : "light");
        });
      }}
    >
      <IconMoon className="transition-all [display:--theme-toggle-moon-icon-display]" />

      <IconSun className="transition-all [display:--theme-toggle-sun-icon-display]" />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
