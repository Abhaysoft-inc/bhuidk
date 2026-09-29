import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
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

      <body className="min-h-full flex flex-col font-normal text-slate-800 bg-[#f8fafc]">
        {children}

        {/* Google Translate Hidden Element */}
        <div id="google_translate_element"></div>

        {/* Google Translate Scripts */}
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
