import type { Metadata } from "next";
import { Inter, Montserrat, Open_Sans, Poppins } from "next/font/google";
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
  weight: ['300', '400', '700'],
 });

 const poppins = Poppins({ subsets: ["latin"],
  weight: ['300', '400', '700'],
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
      <head>
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet" /> */}
      </head>
      <body className={`${poppins.className} min-h-screen bg-gray-50 dark:bg-dark-900 text-dark-900 dark:text-white transition-colors duration-200`}>
        <Header />
        <main className="container mx-auto px-4 py-8">
        {children}
        </main>
        <ThemeToggle />
      </body>
    </html>
  );
}
