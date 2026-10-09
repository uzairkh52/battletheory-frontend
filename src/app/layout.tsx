import type { Metadata } from "next";
import "./globals.scss";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Battle Theory | High-Performance Military Intelligence",
  description: "Tactical history, battle maps, and modern military tech analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          {/* Main se max-w-7xl aur p-6 hata diya hai taake sections apni marzi ki width le sakein */}
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}