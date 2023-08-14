import { Header } from "@/components/header";
import { Providers } from "@/components/providers";

import { SidebarList } from "@/components/sidebar-list";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "Sinapis Shopper",
  description: "Shop beautiful products from shopify",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("font-sans antialiased", fontSans.variable, fontMono.variable)}>
        <Toaster />
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="grid h-full grow grid-cols-4 ">
              <div className="relative col-span-full flex flex-col bg-muted/50 md:col-span-3">{children}</div>
              <div className="hidden  border-s pt-10 md:block">
                <SidebarList />
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
