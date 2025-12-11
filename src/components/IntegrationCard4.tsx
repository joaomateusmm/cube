"use client";

import gsap from "gsap";
import { Component } from "lucide-react";
import Image from "next/image";
import { useEffect,useRef, useState } from "react";

const IntegrationCard = ({ className }: { className?: string }) => {
  const [isConnected, setIsConnected] = useState(false);

  // 1. Definição dos Refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !cardRef.current || !contentRef.current) return;

    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    const content = contentRef.current;

    // Configuração Inicial 3D
    gsap.set(card, {
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
    });

    // Otimização com quickTo
    const xTo = gsap.quickTo(card, "rotationY", {
      duration: 0.4,
      ease: "power3",
    });
    const yTo = gsap.quickTo(card, "rotationX", {
      duration: 0.4,
      ease: "power3",
    });

    const xInnerTo = gsap.quickTo(content, "x", {
      duration: 0.4,
      ease: "power3",
    });
    const yInnerTo = gsap.quickTo(content, "y", {
      duration: 0.4,
      ease: "power3",
    });

    // Função de Movimento baseada no Wrapper
    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = (mouseX / width - 0.5) * 2;
      const yPct = (mouseY / height - 0.5) * 2;

      // Rotação do Card
      xTo(xPct * 5);
      yTo(-yPct * 5);

      // Parallax do Conteúdo
      xInnerTo(xPct * 15);
      yInnerTo(yPct * 15);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      xInnerTo(0);
      yInnerTo(0);
    };

    // Listeners no Wrapper (Hit Box maior)
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    // 2. WRAPPER (Hit Box Invisível)
    <div
      ref={wrapperRef}
      className="relative p-12 flex justify-center items-center cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      {/* 3. CARD VISUAL (Rotação 3D) */}
      <div
        ref={cardRef}
        className={`relative flex h-auto w-[700px] shrink-0 flex-col overflow-hidden rounded-3xl border-2 border-transparent p-10 backdrop-blur-md ${className}`}
        style={{
          background: `
            /* CAMADA 1: Spotlight Amarelo */
            radial-gradient(
              60% 120% at 50% -20%, 
              rgba(237, 221, 83, 0.9) 0%,   /* Amarelo Intenso */
              rgba(237, 221, 83, 0.25) 5%,  /* Amarelo Suave */
              rgba(0, 0, 0, 0) 80%
            ) padding-box,
            
            /* CAMADA 2: Fundo do Card (Vidro Escuro) */
            linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)) padding-box,

            /* CAMADA 3: Borda Iluminada Amarela */
            radial-gradient(
              250px circle at 50% 0%,
              rgba(255, 255, 255, 0.9) 0%, /* Branco brilhante no centro da borda */
              rgba(237, 221, 83, 0.9) 20%, /* Amarelo logo a seguir */
              rgba(255, 255, 255, 0.04) 100% /* Cinza transparente no resto */
            ) border-box
          `,
        }}
      >
        {/* 4. CONTEÚDO INTERNO (Parallax) */}
        <div
          ref={contentRef}
          className="relative z-10 flex h-full flex-col justify-between will-change-transform"
        >
          {/* Background Logo */}
          <div className="absolute -top-18 -right-10 z-0 h-[550px] w-[550px] opacity-10 pointer-events-none select-none">
            <Image
              src="/assets/orbez/bg-logo.svg"
              alt="Background Logo"
              fill
              className="object-contain"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 20%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 20%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative z-10 flex h-auto w-full flex-col justify-between gap-5">
            <div className="flex w-full justify-between items-center">
              <Image
                src="/assets/orbez/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-lg my-shadow inner-shadow my-shadow-3"
              />
              <div className="flex items-center justify-center text-neutral-200/80 backdrop-blur-2xl gap-2 my-shadow-2 rounded-lg py-2 px-5">
                <Component className="h-6 w-6" />
                <p className="text-[20px] font-montserrat">
                  Para todas as Versões
                </p>
              </div>
            </div>

            <div className="flex w-[500px] flex-col gap-3 mt-auto mb-6">
              <h1 className="text-3xl font-normal bg-linear-to-r from-white to-neutral-800 bg-clip-text text-transparent">
                Orbez
              </h1>
              <p className="text-neutral-200/80 text-2xl leading-relaxed">
                Plataforma para icones e ilustrações vetoriais personalizáveis,
                otimizadas com SEO.
              </p>
            </div>

            <div className="w-full border-t border-white/10"></div>

            <div className="flex w-full items-center justify-between pt-6">
              <div className="flex w-full items-center justify-between pt-6">
                <p className="cursor-pointer text-2xl font-light text-neutral-200/80 underline hover:text-white">
                  Ver Completo
                </p>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-light transition-colors text-2xl ${
                      isConnected ? "text-white" : "text-neutral-400"
                    }`}
                  >
                    {isConnected ? "Conectado" : "Conectar"}
                  </p>
                  <label className="switch-4 relative inline-block w-[50px] h-7">
                    <input
                      type="checkbox"
                      className="opacity-0 w-0 h-0"
                      checked={isConnected}
                      onChange={(e) => setIsConnected(e.target.checked)}
                    />
                    <span className="slider-4"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
