"use client";

// Importar hook para monitorizar carregamento 3D
import { useProgress } from "@react-three/drei";
// Importar hooks do Framer Motion
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Seus componentes
import CoinModel1 from "@/components/CoinModel1";
import CoinModel2 from "@/components/CoinModel2";
import CubeScene from "@/components/cube3D";
import FloatingScrollbar from "@/components/FloatingScrollbar";
import GradientText from "@/components/GradientText";
import { Header } from "@/components/header";
import HeroSection3 from "@/components/HeroSection3";
import { HeroText } from "@/components/HeroText";
// O nosso Loader
import CurveLoader from "@/components/LoaderPage";
import { RevealBlockText } from "@/components/RevealBlockText";
import SingleCube from "@/components/SingleCube";

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null);

  // --- LÓGICA DO LOADER ---
  // O hook useProgress dá-nos o progresso (0 a 100) de todos os componentes R3F
  const { progress } = useProgress();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Quando o progresso chegar a 100%, esperamos um pouquinho (500ms)
    // para garantir que não há lags de renderização e removemos o loader.
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);
  // ------------------------

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const springConfig = {
    stiffness: 60,
    damping: 50,
    restDelta: 0.001,
  };

  // --- MODELO ESQUERDA ---
  const x1Raw = useTransform(scrollYProgress, [0, 0.5, 1], [-250, 0, -100]);
  const x1 = useSpring(x1Raw, springConfig);
  const opacity1 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8, 1],
    [0, 1, 1, 0]
  );

  // --- MODELO DIREITA ---
  const x2Raw = useTransform(scrollYProgress, [0, 0.5, 1], [250, 0, 100]);
  const x2 = useSpring(x2Raw, springConfig);
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8, 1],
    [0, 1, 1, 0]
  );

  // Texto Central
  const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacityText = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);

  return (
    <main className="relative w-full bg-black overflow-x-hidden">
      {/* --- INSERÇÃO DO LOADER --- */}
      {/* Ele recebe o estado isLoading. Se for true, cobre a tela. Se false, faz o swipe. */}
      <CurveLoader isLoading={isLoading} />

      <FloatingScrollbar />
      <Header />

      {/* --- O FUJÃO --- */}
      <div className="absolute top-0 left-0 z-40 h-[120vh] w-full pointer-events-none">
        <SingleCube />
      </div>

      {/* --- LUZES DE FUNDO GLOBAIS --- */}
      <div className="absolute top-[100vh] left-0 w-full h-[150vh] pointer-events-none z-10 overflow-visible">
        {/* LUZ DA ESQUERDA */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -left-[600px] w-[1100px] h-[1000px] rounded-full blur-[160px]"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 0.4, x: 0 }}
          viewport={{ once: false, margin: "-10%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(192, 132, 252, 0.6) 0%, rgba(147, 51, 234, 0.4) 50%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* LUZ DA DIREITA */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -right-[600px] w-[1100px] h-[1000px] rounded-full blur-[160px]"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 0.4, x: 0 }}
          viewport={{ once: false, margin: "-10%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(192, 132, 252, 0.6) 0%, rgba(147, 51, 234, 0.4) 50%, rgba(0,0,0,0) 70%)",
          }}
        />
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full p-4 md:p-12 box-border flex items-center justify-center z-20">
        <div className="relative h-full w-full rounded-3xl p-[1px] bg-gradient-to-b from-black to-neutral-600">
          <div className="relative h-full w-full rounded-3xl overflow-hidden bg-gradient-to-br from-black via-black to-purple-900">
            <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src="/assets/grid.jpg"
                  alt="Grid Background"
                  fill
                  className="object-cover opacity-20 mix-blend-screen scale-100 origin-center"
                  priority
                />
              </div>
              <div className="relative z-10 flex h-full w-full items-center justify-center lg:justify-start px-6 lg:pl-16">
                <HeroText />
              </div>
              <div className="relative z-10 h-full w-full flex items-center justify-center pointer-events-none">
                <div className="absolute inset-0 w-full h-full">
                  <CubeScene />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECÇÃO 2: COM SCROLL ANIMATION --- */}
      <section
        ref={sectionRef}
        className="relative z-30 flex min-h-screen w-full flex-col items-center justify-center bg-transparent py-24 px-6 overflow-visible"
      >
        {/* MODELO 1 (Esquerda) */}
        <motion.div
          className="absolute w-full h-full top-0 left-0 pointer-events-none z-30"
          style={{ x: x1, opacity: opacity1 }}
        >
          <CoinModel1 />
        </motion.div>

        {/* MODELO 2 (Direita) */}
        <motion.div
          className="absolute w-full h-full top-0 left-0 pointer-events-none z-30"
          style={{ x: x2, opacity: opacity2 }}
        >
          <CoinModel2 />
        </motion.div>

        {/* Conteúdo Central */}
        <motion.div
          className="relative z-40 flex flex-col items-center max-w-5xl mx-auto w-full mt-3"
          style={{ y: yText, opacity: opacityText }}
        >
          <h2 className="mb-6 font-['Clash_Display'] flex flex-col items-center uppercase text-center text-[40px] md:text-[85px] font-medium leading-[1] md:leading-[0.9] bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            <RevealBlockText>
              <GradientText
                colors={["#C7C7C7", "#7E7E7E", "#FEFEFE", "#7E7E7E", "#FEFEFE"]}
                animationSpeed={6}
                showBorder={false}
                className="custom-class"
              >
                Revolucionando o
              </GradientText>
            </RevealBlockText>
            <RevealBlockText delay={0.4}>
              <GradientText
                colors={["#C7C7C7", "#7E7E7E", "#FEFEFE", "#7E7E7E", "#FEFEFE"]}
                animationSpeed={6}
                showBorder={false}
                className="custom-class"
              >
                futuro do Seo com I.A
              </GradientText>
            </RevealBlockText>
          </h2>

          <div className="font-montserrat max-w-2xl text-center flex flex-col items-center md:text-xl text-gray-400 mt-4 leading-relaxed">
            <RevealBlockText delay={0.6}>
              <p>
                Nosso sistema avançado foi pensado para o mínimo conhecedor,
                desde o
              </p>
            </RevealBlockText>
            <RevealBlockText delay={0.8}>
              <p>
                mais apto profissional, conectando suas palavras até a pesquisa
                do usuário.
              </p>
            </RevealBlockText>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10 w-full justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
          >
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
              data-framer-name="desktop"
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
                <div className="flex flex-col items-center justify-center transform-none opacity-100">
                  <p
                    className="m-0 p-0 font-sans text-[14px] font-medium text-white tracking-wide"
                    style={{
                      WebkitFontSmoothing: "antialiased",
                      textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    }}
                  >
                    Ver Planos
                  </p>
                </div>
              </div>
            </button>

            <button className="rounded-md border border-white/20 text-sm font-medium duration-300 z-50 w-[140px] h-11 hover:bg-black bg-white hover:text-white text-black cursor-pointer transition-all">
              Saiba Mais
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- PRÓXIMA SECÇÃO --- */}
      <section className="relative ">
        <HeroSection3 />
      </section>
    </main>
  );
}
