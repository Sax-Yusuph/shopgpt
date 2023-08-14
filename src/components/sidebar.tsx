"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { IconSettings } from "@/components/ui/icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./mode-toggle";
import { Separator } from "./ui/separator";

export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <IconSettings className="h-4 w-4" />
          {/* <span className="ml-2 hidden md:flex">Configure</span> */}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="inset-y-0 flex h-auto w-[300px] flex-col p-0 font-mono">
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">Finetune Settings</SheetTitle>
        </SheetHeader>
        <Separator />
        <ThemeToggle />
        {children}
      </SheetContent>
    </Sheet>
  );
}
