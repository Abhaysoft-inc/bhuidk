import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "VEDA — National Digital Platform for Land Governance | DoLR, MoRD, Govt of India",
  description: "VEDA: National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance - Department of Land Resources, Ministry of Rural Development, Government of India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]">{children}</body>
    </html>
  );
}
