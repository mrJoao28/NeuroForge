import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "NeuroForge | Neural Lab", description: "Explore and compare neural network training experiments." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
