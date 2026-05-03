import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "BULLS - AIESEC en Chiclayo",
  description: "Plataforma institucional del comité local BULLS - AIESEC en Chiclayo (CLCH).",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: "'Inter', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
