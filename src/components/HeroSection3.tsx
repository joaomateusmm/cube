"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import GradientText from "@/components/GradientText";
import { RevealBlockText } from "@/components/RevealBlockText";

// Importa os teus componentes de card
import IntegrationCard from "./IntegrationCard";
import IntegrationCard2 from "./IntegrationCard2";
import IntegrationCard3 from "./IntegrationCard3";
import IntegrationCard4 from "./IntegrationCard4";

gsap.registerPlugin(ScrollTrigger);

export default function VerticalScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const cardsWrapper = cardsWrapperRef.current;

    if (!container || !cardsWrapper) return;

    const ctx = gsap.context(() => {
      // Cálculo do scroll vertical dos cards
      const getScrollAmount = () => {
        const wrapperHeight = cardsWrapper.scrollHeight;
        const windowHeight = window.innerHeight;
        // Sobe até mostrar o último card com uma folga
        return -(wrapperHeight - windowHeight + 100);
      };

      const tween = gsap.to(cardsWrapper, {
        y: getScrollAmount,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: () => `+=${cardsWrapper.scrollHeight}`,
        pin: true,
        animation: tween,
        scrub: 1,
        invalidateOnRefresh: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full bg-black text-white">
      <section
        ref={containerRef}
        className="relative flex h-screen w-full overflow-hidden"
      >
        {/* --- EFEITO DE LUZ ROXA (AJUSTADO PARA SAÍDA) --- */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[140vw] h-[500px] z-10 pointer-events-none"
          initial={{ opacity: 0, y: 100 }} // Estado inicial (invisível, em baixo)
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 1.2, ease: "easeOut" }, // Suavidade na entrada
          }}
          // O segredo está aqui: define o estado de saída quando deixa de estar "InView"
          viewport={{ once: false, margin: "-100px" }}
          // Quando sai da viewport, volta ao estado inicial suavemente
          onViewportLeave={() => ({
            opacity: 0,
            y: 100,
            transition: { duration: 1.0, ease: "easeIn" }, // Suavidade na saída
          })}
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(192, 132, 252, 0.25) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* --- LAYOUT GRID --- */}
        <div className="relative z-20 flex w-full h-full">
          {/* LADO ESQUERDO: Cards (Animado Verticalmente) */}
          <div className="w-[50%] h-full relative pl-50">
            <div
              ref={cardsWrapperRef}
              className="flex flex-col gap-[50px] will-change-transform pt-20 pb-48 mt-56"
            >
              <IntegrationCard />
              <IntegrationCard2 />
              <IntegrationCard3 />
              <IntegrationCard4 />
            </div>
          </div>

          {/* LADO DIREITO: Texto (Fixo) */}
          <div className="w-[800px] h-full flex flex-col justify-center items-start ml-12 z-30">
            <div>
              <h2 className="text-8xl font-medium text-start font-['Clash_Display'] mb-6 text-white leading-tight">
                <RevealBlockText>Use nossas</RevealBlockText>
                <RevealBlockText>
                  <GradientText
                    colors={[
                      "#4E25F1",
                      "#271179",
                      "#7857FF",
                      "#271179",
                      "#4E25F1",
                    ]}
                    animationSpeed={6}
                    showBorder={false}
                    className="custom-class"
                  >
                    Integrações
                  </GradientText>
                </RevealBlockText>
                <RevealBlockText>oficiais.</RevealBlockText>
              </h2>

              <p className="text-xl text-neutral-400 leading-relaxed">
                <RevealBlockText>
                  Conecte suas ferramentas favoritas em segundos. Nosso sistema
                  suporta as plataformas
                </RevealBlockText>
                <RevealBlockText>
                  mais populares do mercado para garantir que seu fluxo de
                  trabalho nunca pare.
                </RevealBlockText>
              </p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mt-10 w-full justify-start"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* BOTÃO COMPLEXO */}
                <button
                  className="group relative flex flex-col items-center justify-center w-[140px] h-[44px] decoration-0 transition-transform active:scale-[0.98] cursor-pointer outline-none"
                  type="button"
                  style={{
                    backgroundColor: "rgba(147, 51, 234, 0.15)",
                    borderRadius: "8px",
                    opacity: 1,
                    border: "none",
                    padding: 0,
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity ease-in-out duration-[1200ms] opacity-100 group-hover:opacity-0"
                    style={{
                      background:
                        "radial-gradient(15% 50% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
                      borderRadius: "8px",
                      filter: "blur(15px)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity ease-in-out duration-[1200ms] opacity-0 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(60.6% 50% at 50% 100%, rgb(147, 51, 234) 0%, rgba(147, 51, 234, 0) 100%)",
                      borderRadius: "8px",
                      filter: "blur(18px)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-px pointer-events-none z-10 rounded-[7px]"
                    style={{ backgroundColor: "rgb(0, 0, 0)", opacity: 1 }}
                  ></div>
                  <div className="relative z-20 flex flex-col items-center justify-center opacity-100">
                    <p
                      className="m-0 p-0 font-sans text-[14px] font-medium text-white tracking-wide"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      Ver Todas
                    </p>
                  </div>
                </button>

                {/* BOTÃO SIMPLES */}
                <button className="rounded-md border border-white/20 text-sm font-medium duration-300 z-50 w-[140px] h-11 hover:bg-black bg-white hover:text-white text-black cursor-pointer transition-all">
                  Como Usar
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Secção extra para scroll */}
      <section className="h-screen w-full bg-neutral-900 flex items-center justify-center">
        <h2 className="text-3xl text-gray-500">Próxima Secção</h2>
      </section>
    </div>
  );
}
