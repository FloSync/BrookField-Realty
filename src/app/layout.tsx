import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PublicChrome } from "@/components/layout/PublicChrome";

export const metadata: Metadata = {
  title: {
    default: "Brookfield Realty | Real Estate · Investment · Development",
    template: "%s | Brookfield Realty",
  },
  description:
    "Comfortable homes and land across Lagos and beyond. Real estate development, land sales, property investment and estate management.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <PublicChrome>
          <Header />
        </PublicChrome>
        <main className="flex-1">{children}</main>
        <PublicChrome>
          <Footer />
        </PublicChrome>
      </body>
    </html>
  );
}
