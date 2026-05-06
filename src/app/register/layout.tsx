import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro - BULLS AIESEC",
  description: "Crea tu cuenta en la plataforma institucional BULLS - AIESEC en Chiclayo.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
