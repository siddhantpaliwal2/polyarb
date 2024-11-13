import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Polyarb",
  description: "Find arbitrage opportunities between Polymarket and Kalshi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="bg-black text-white font-sans relative min-h-screen">
          {/* Background gradients */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-green-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          </div>

          {/* Fixed header */}
          <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50  backdrop-blur-md">
            <div className="container mx-auto flex justify-between items-center py-6 px-3">
              <h1 className="text-2xl font-bold text-green-500">PolyArb</h1>
              <nav>
                <ul className="flex space-x-6 items-center">
                  <li><a href="#" className="hover:text-green-500 transition-colors">Home</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-green-500 transition-colors">Contact</a></li>
                </ul>
              </nav>
            </div>
          </header>
            
          {/* Main content with padding for header */}
          <main className="pt-[80px] relative z-0 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
