import type { Metadata } from "next";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-montserrat',
});
const opensans = Open_Sans({ subsets: ["latin"],
  variable: '--font-open-sans',
 });

export const metadata: Metadata = {
  title: "Vallena - Boutique de vêtements",
  description: "Boutique en ligne de vêtements sur mesure",
  icons: {
    icon: '/Logo-Vallena.png',
    shortcut: '/Logo-Vallena.png',
    apple: '/Logo-Vallena.png',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${montserrat.className} ${opensans.variable} min-h-screen bg-gray-50 dark:bg-dark-900 text-dark-900 dark:text-white transition-colors duration-200`}>
        <Header />
        <main className="container mx-auto px-4 py-8">
        {children}
        </main>
        <ThemeToggle />
      </body>
    </html>
  );
}
