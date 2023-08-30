"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { IconSettings } from "@/components/ui/icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="inset-y-0 flex h-auto w-min flex-col p-0 font-mono">
        <SheetHeader className="p-4">
          <SheetTitle className="text-base text-start">Finetune Settings</SheetTitle>
        </SheetHeader>
        <Separator />
        {children}
      </SheetContent>
    </Sheet>
  );
}
