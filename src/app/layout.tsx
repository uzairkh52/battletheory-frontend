import type { Metadata } from "next";
import "./globals.scss";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Battle Theory | High-Performance Military Intelligence",
    template: "%s | Battle Theory",
  },
  description:
    "Tactical history, battle maps, declassified archives, and modern military tech analysis.",
  keywords: [
    "Military History",
    "Tactical Intelligence",
    "Battle Maps",
    "World War History",
    "Defense News",
    "Battle Theory",
  ],
  authors: [{ name: "Battle Theory Command" }],
  creator: "Battle Theory",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Battle Theory | High-Performance Military Intelligence",
    description:
      "Tactical history, battle maps, declassified archives, and modern military tech analysis.",
    url: "/",
    siteName: "Battle Theory",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Battle Theory Tactical Intelligence Portal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Battle Theory | Military Intelligence & History",
    description:
      "Tactical history, battle maps, and declassified defense analysis.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
          {/* Main flex container for edge-to-edge layout support */}
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}