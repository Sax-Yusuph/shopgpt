"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { IconSettings } from "@/components/ui/icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="block lg:hidden">
          <IconSettings className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="inset-y-0 flex h-auto w-min min-w-[500px] flex-col p-0 font-mono">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="text-base text-start">Finetune Settings</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
