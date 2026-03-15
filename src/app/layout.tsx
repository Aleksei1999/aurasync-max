import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MaxProvider } from "@/components/MaxProvider";
import { AuthProvider } from "@/components/AuthProvider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "AuraSync",
  description: "Your personal hormonal wellness manager",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://st.max.ru/js/max-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <MaxProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </MaxProvider>
      </body>
    </html>
  );
}
