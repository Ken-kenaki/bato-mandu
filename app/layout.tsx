import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/language-context";
import { AuthProvider } from "./lib/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BatoMandu | Navigate Kathmandu's Public Transport",
  description: "Find bus routes, fares, and AI travel assistance for Kathmandu Valley.",
  keywords: [
    "Kathmandu transport",
    "Nepal public transport",
    "bus fares Kathmandu",
    "BatoMandu",
    "काठमाडौं बस",
    "Nepal transport app",
  ],
  openGraph: {
    title: "BatoMandu — काठमाडौंको बाटो अब सजिलो",
    description:
      "All public transport routes, fares & travel info for Kathmandu — in one app.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
