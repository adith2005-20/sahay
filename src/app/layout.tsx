import "@/styles/globals.css";

import { type Metadata } from "next";
import { Martel_Sans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "./_components/Header";
import Iridescence from '@/components/Iridescence'
import Footer from "./_components/Footer";
export const metadata: Metadata = {
  title: "Sahay",
  description: "Built for Smart India Hackathon '25",
  icons: [{ rel: "icon", url: "/sahay-sm.svg" }],
};

// const geist = Geist({
//   subsets: ["latin"],
//   variable: "--font-geist-sans",
// });

const martelSans = Martel_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-martel-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Add fonts for different languages */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${martelSans.className} antialiased`}>
        <Iridescence className='w-full min-h-svh'>
          <LanguageProvider>
            <TRPCReactProvider>
              <Header />
              <div className="pt-28 pb-16">{children}</div>
              <Footer />
            </TRPCReactProvider>
          </LanguageProvider>
        </Iridescence>
      </body>
    </html>
  );
}
