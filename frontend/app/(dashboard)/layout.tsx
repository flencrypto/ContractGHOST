import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden bg-color-background text-color-text-main">
      {/* Blueprint grid overlay */}
      <div className="fixed inset-0 pointer-events-none bg-blueprint opacity-30 z-0" />
      {/* Hex grid overlay for futuristic depth */}
      <div className="fixed inset-0 pointer-events-none hex-grid opacity-20 z-0" />
      {/* Radial gradient overlay for depth */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.04)_0%,transparent_50%)]" />
      {/* Secondary depth gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.03)_0%,transparent_50%)]" />
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-auto relative z-10">
        {children}
        <Footer />
      </main>
    </div>
  );
}
