import type { Metadata } from "next";
import {Toaster} from "sonner";

import "./globals.css";


export const metadata: Metadata = {
  title: "Signalist",
  description: "Track real-time stock prices, get personalized alerts and explore more detailed company insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased"
      >
        {children}
      <Toaster/>
      </body>
    </html>
  );
}
