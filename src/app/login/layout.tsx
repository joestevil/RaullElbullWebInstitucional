import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión - BULLS AIESEC",
  description: "Inicia sesión en la plataforma institucional BULLS - AIESEC en Chiclayo.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
