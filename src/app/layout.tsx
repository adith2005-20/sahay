import "@/styles/globals.css";

import { type Metadata } from "next";
import { Martel_Sans } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Header from "./_components/Header";

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
  weight: ["200","300","400"],
  variable: "--font-martel-sans"
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${martelSans.className} antialiased`}>
        <TRPCReactProvider><Header/>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
