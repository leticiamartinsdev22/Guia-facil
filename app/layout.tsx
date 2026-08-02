import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guia Fácil",
  description: "Um assistente que ensina tecnologia com calma, passo a passo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
