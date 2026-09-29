import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEDA — National Digital Platform for Land Governance | DoLR, MoRD, Govt of India",
  description: "VEDA: National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance - Department of Land Resources, Ministry of Rural Development, Government of India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${jakarta.variable} ${jakarta.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-normal text-slate-800 bg-[#f8fafc]">{children}</body>
    </html>
  );
}
