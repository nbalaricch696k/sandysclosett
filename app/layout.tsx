import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sandy's Closet | Fashion • Style • You",
  description: "Discover your next favourite look at Sandy's Closet.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
