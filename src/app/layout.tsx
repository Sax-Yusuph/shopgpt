import { Header } from "@/components/header";
import { Providers } from "@/components/providers";

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
            <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
