import type { Metadata } from "next";
import Script from "next/script";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://battletheory.net"),
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager (GTM) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PXTH65GP');
            `,
          }}
        />

        {/* Google Analytics Tracking - BattleTheory */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-RPZ1F7N6Q4"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-RPZ1F7N6Q4');
          `}
        </Script>
      </head>
      <body className="bg-[#0b0f19] text-gray-100 min-h-screen flex flex-col">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PXTH65GP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

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