import "@/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";

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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100","200","300","400","500"],
  variable: "--font-poppins"
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        <TRPCReactProvider><Header/>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
