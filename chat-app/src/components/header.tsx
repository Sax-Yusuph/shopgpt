import { IconOpenAI, IconSeparator } from "@/components/ui/icons";
import { Suspense } from "react";
import { AppErrorBoundary } from "./error-boundary";
import { ThemeToggle } from "./mode-toggle";
import { Sidebar } from "./sidebar";
import { SidebarList } from "./sidebar-list";

export function Header() {
  return (
    <AppErrorBoundary>
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
        <div className="flex items-center">
          <IconOpenAI className="mr-2 h-6 w-6" />

          <div className="flex items-center">
            <IconSeparator className="h-6 w-6 text-muted-foreground/50" />

            <span className="font-bold lg:text-lg">ShopAi</span>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <ThemeToggle />

          <Sidebar>
            <Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList />
            </Suspense>
          </Sidebar>
        </div>
      </header>
    </AppErrorBoundary>
  );
}
