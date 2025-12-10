import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { Toaster } from "sonner";

import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BarberFy - Agendamento de Cortes",
  description: "Agende seu corte na BarberFy de forma rápida e fácil",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${montserrat.variable} ${geistMono.variable} antialiased`}
        // Importante: garantir que o body ocupe a tela toda para o trail funcionar
        style={{ position: "relative", minHeight: "100vh" }}
      >
        {/* CORREÇÃO: PixelTrail agora está DENTRO do body */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        ></div>

        <SmoothScroll>{children}</SmoothScroll>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
