"use client";

import gsap from "gsap";
import { Flame } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const IntegrationCard = ({ className }: { className?: string }) => {
  const [isConnected, setIsConnected] = useState(false);

  // 1. Criamos um Ref extra para o Wrapper (a Hit Box)
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificamos se todos os elementos existem
    if (!wrapperRef.current || !cardRef.current || !contentRef.current) return;

    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    const content = contentRef.current;

    // Configuração do GSAP no CARD VISUAL (não no wrapper)
    gsap.set(card, {
      transformPerspective: 1000,
      transformStyle: "preserve-3d",
    });

    // As animações continuam a ser aplicadas ao card e ao conteúdo
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

    const handleMouseMove = (e: MouseEvent) => {
      // 2. O cálculo agora é baseado no WRAPPER (Hit Box maior)
      const rect = wrapper.getBoundingClientRect();

      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = (mouseX / width - 0.5) * 2;
      const yPct = (mouseY / height - 0.5) * 2;

      // Aplicamos a rotação.
      // Como a hit box é maior, o movimento será mais suave nas bordas.
      xTo(xPct * 5);
      yTo(-yPct * 5);

      xInnerTo(xPct * 15);
      yInnerTo(yPct * 15);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      xInnerTo(0);
      yInnerTo(0);
    };

    // 3. Adicionamos os Listeners ao WRAPPER, não ao card
    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    // 4. WRAPPER (Hit Box):
    // - Adicionei 'p-12' (padding de ~48px). Essa é a área extra invisível.
    // - 'cursor-pointer' para indicar interatividade nessa área extra.
    // - 'perspective-1000' ajuda na renderização 3D do filho.
    <div
      ref={wrapperRef}
      className="relative p-12 flex justify-center items-center cursor-pointer"
      style={{ perspective: "1000px" }}
    >
      {/* O CARD VISUAL (Mantém o tamanho original w-[700px]) */}
      <div
        ref={cardRef}
        className={`relative flex h-auto w-[700px] shrink-0 flex-col overflow-hidden rounded-3xl border-2 border-transparent p-10 backdrop-blur-md ${className}`}
        // Importante: pointer-events-none no card visual para que o mouse
        // "atravesse" e seja lido pelo wrapper, ou pointer-events-auto se tiver botões clicáveis dentro.
        // Como tens botões, deixamos o padrão (auto), o evento "bubbling" resolve.
        style={{
          background: `
            radial-gradient(
              60% 120% at 50% -20%, 
              rgba(91, 49, 255, 0.9) 0%, 
              rgba(91, 49, 255, 0.25) 5%, 
              rgba(0, 0, 0, 0) 80%
            ) padding-box,
            linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)) padding-box,
            radial-gradient(
              250px circle at 50% 0%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(91, 49, 255, 1) 20%,
              rgba(255, 255, 255, 0.04) 100%
            ) border-box
          `,
        }}
      >
        <div
          ref={contentRef}
          className="relative z-10 flex h-full flex-col justify-between will-change-transform"
        >
          {/* Background Logo */}
          <div className="absolute top-10 right-10 z-0 h-[350px] w-[350px] opacity-10 pointer-events-none select-none translate-x-10 -translate-y-10">
            <Image
              src="/assets/webflow/bg-logo.svg"
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

          {/* Cabeçalho */}
          <div className="relative z-10 flex w-full flex-col gap-5">
            <div className="flex w-full justify-between items-center">
              <Image
                src="/assets/webflow/logo.svg"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-lg my-shadow inner-shadow my-shadow-3 p-3"
              />
              <div className="flex items-center justify-center text-neutral-200/80 backdrop-blur-2xl gap-2 my-shadow-2 rounded-lg py-2 px-5">
                <Flame className="h-6 w-6" />
                <p className="text-[20px] font-montserrat">
                  Integração Popular
                </p>
              </div>
            </div>

            <div className="flex w-[450px] flex-col gap-3 mt-10 mb-6">
              <h1 className="text-3xl font-normal bg-linear-to-r from-white to-neutral-800 bg-clip-text text-transparent">
                WebFlow
              </h1>
              <p className="text-neutral-200/80 text-2xl leading-relaxed">
                É uma plataforma baseada na web, com uma interface simples de
                arrastar e soltar.
              </p>
            </div>
          </div>

          {/* Rodapé */}
          <div className="relative z-10 mt-auto">
            <div className="w-full border-t border-white/10"></div>
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
                <label className="switch relative inline-block w-[50px] h-7">
                  <input
                    type="checkbox"
                    className="opacity-0 w-0 h-0"
                    checked={isConnected}
                    onChange={(e) => setIsConnected(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
