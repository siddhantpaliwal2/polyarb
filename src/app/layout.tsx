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
        <div className="bg-black text-white font-sans relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-green-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <header className="sticky top-0 border-b border-gray-800/50 backdrop-blur-md">
              <div className="container mx-auto flex justify-between items-center py-6 px-4">
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
            
            <main className="flex-grow relative">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
