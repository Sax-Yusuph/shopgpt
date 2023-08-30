import { TailwindIndicator } from "@/components/tailwind-indicator";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@mdxeditor/editor/style.css";

import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { SidebarList } from "@/components/sidebar-list";
import "./globals.css";

export const metadata = {
  title: "Sinapis Shopper",
  description: "Shop beautiful products from shopify",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", fontSans.variable, fontMono.variable)}>
        <Providers attribute="class">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="grid h-full grow grid-cols-6">
              <div className="relative col-span-full flex flex-col bg-muted/50 lg:col-span-4">{children}</div>
              <div className="hidden  border-s pt-10 lg:block fixed right-0 w-[34vw] bg-background h-full">
                <SidebarList />
              </div>
            </main>
          </div>
        </Providers>

        <TailwindIndicator />
      </body>
    </html>
  );
}
