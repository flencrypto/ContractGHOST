import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "ContractGHOST",
  description: "AI-native Bid + Delivery OS for Data Centre Refurbs & New Builds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-white antialiased font-sans">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
