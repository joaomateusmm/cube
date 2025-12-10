"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Certifica-te de que o caminho está correto para onde criaste o arquivo no Passo 1
import { SplitHoverText } from "@/components/SplitHoverText";

export function Header() {
  // Estado para controlar a visibilidade
  const [isVisible, setIsVisible] = useState(true);
  // Estado para guardar a última posição do scroll
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Se estivermos no topo da página (menos de 10px), mostrar sempre
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Se estivermos a descer E já passamos do topo -> Esconder
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      // Se estivermos a subir -> Mostrar
      else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    // Container Flutuante com Animação
    <div
      className={`fixed top-0 z-[999] flex w-full justify-center p-6 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <header className="flex w-full max-w-5xl items-center justify-between rounded-lg border border-white/10 bg-black/50 p-2 backdrop-blur-sm shadow-lg">
        {/* LOGO */}
        <Link
          href="/"
          className="group relative flex h-10 w-10 items-center justify-center rounded-md decoration-0 transition-transform active:scale-95 outline-none"
          style={{
            backgroundColor: "rgba(147, 51, 234, 0.08)",
            borderRadius: "8px",
          }}
        >
          {/* Efeitos do Logo (Mantidos) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity ease-in-out duration-[1200ms] opacity-100 group-hover:opacity-0"
            style={{
              background:
                "radial-gradient(35% 50% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
              filter: "blur(8px)",
            }}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none transition-opacity ease-in-out duration-[1200ms] opacity-0 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
              filter: "blur(10px)",
            }}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] opacity-100 group-hover:opacity-0"
            style={{
              background:
                "radial-gradient(40% 60% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
            }}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] opacity-0 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
            }}
          ></div>
          <div
            className="absolute inset-px pointer-events-none z-10 rounded-[7px]"
            style={{
              backgroundColor: "rgb(0, 0, 0)",
              opacity: 1,
            }}
          ></div>
          <div className="relative z-20 flex h-6 w-6 items-center justify-center">
            <Image
              src="/assets/logo.svg"
              alt="Logo da Empresa"
              width={24}
              height={24}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </Link>

        {/* NAVEGAÇÃO COM EFEITO LANDO NORRIS */}
        <nav className="hidden items-center gap-8 md:flex">
          {["Integrações", "Desenvolvedores", "Sobre Nós", "Contato"].map(
            (item) => (
              <Link
                key={item}
                href="#"
                // Mantemos a fonte base e a cor 'apagada' (white/70)
                // Removemos hover:text-white daqui porque o componente SplitHoverText trata da cor do hover
                className="font-montserrat text-sm font-medium text-white/70 block py-2"
              >
                {/* O componente SplitHoverText trata da animação */}
                <SplitHoverText>{item}</SplitHoverText>
              </Link>
            )
          )}
        </nav>

        {/* BOTÃO CRIAR CONTA */}
        <button
          className="group relative flex flex-col items-center justify-center w-[140px] h-11 decoration-0 transition-transform active:scale-[0.98] cursor-pointer outline-none"
          type="button"
          style={{
            backgroundColor: "rgba(147, 51, 234, 0.08)",
            borderRadius: "8px",
            opacity: 1,
            border: "none",
            padding: 0,
          }}
          data-framer-name="desktop"
        >
          {/* Efeitos do Botão (Mantidos) */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity ease-in-out duration-[1200ms] opacity-100 group-hover:opacity-0"
            data-framer-name="Glow"
            style={{
              background:
                "radial-gradient(15% 50% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
              filter: "blur(15px)",
            }}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none transition-opacity ease-in-out duration-[1200ms] opacity-0 group-hover:opacity-100"
            data-framer-name="Glow Hover"
            style={{
              background:
                "radial-gradient(60.6% 50% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
              filter: "blur(18px)",
            }}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] opacity-100 group-hover:opacity-0"
            data-framer-name="Stroke"
            style={{
              background:
                "radial-gradient(10.7% 50% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
            }}
          ></div>
          <div
            className="absolute inset-0 pointer-events-none will-change-auto transition-opacity ease-in-out duration-[1200ms] opacity-0 group-hover:opacity-100"
            data-framer-name="Stroke Hover"
            style={{
              background:
                "radial-gradient(60.1% 50% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
              borderRadius: "8px",
            }}
          ></div>
          <div
            className="absolute inset-px pointer-events-none z-10 rounded-[7px]"
            data-framer-name="Fill"
            style={{
              backgroundColor: "rgb(0, 0, 0)",
              opacity: 1,
            }}
          ></div>
          <div
            className="relative z-20 flex flex-col items-center justify-center opacity-100"
            data-framer-name="text content"
          >
            <div
              className="flex flex-col items-center justify-center transform-none opacity-100"
              data-framer-name="Text"
            >
              <p
                className="m-0 p-0 font-sans text-[14px] font-medium text-white tracking-wide"
                style={{
                  WebkitFontSmoothing: "antialiased",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Criar Conta
              </p>
            </div>
          </div>
        </button>
      </header>
    </div>
  );
}
