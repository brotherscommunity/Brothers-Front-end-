import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/Components/Main/Navbar";
import StoreProvider from "@/redux/StoreProvider";
// import { Toaster } from "react-hot-toast";
import Footer from "@/Components/Main/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brotherhood",
  description: "A collabrative and Knowledge sharing Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Toaster /> */}
        <Suspense>
          <Providers>
            <StoreProvider>
              <Navbar />
              <section>{children}</section>
              <Footer />
            </StoreProvider>
          </Providers>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
