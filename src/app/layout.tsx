import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "BhoomiIntel | Land Governance Platform",
  description: "India's National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          inter.variable,
          fraunces.variable,
          "antialiased min-h-screen bg-background font-sans text-foreground"
        )}
      >
        {children}
      </body>
    </html>
  );
}
