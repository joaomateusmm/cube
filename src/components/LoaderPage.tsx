"use client";
import "ldrs/react/Bouncy.css";

import gsap from "gsap";
import { Bouncy } from "ldrs/react";
import React, { useEffect, useRef, useState } from "react";

interface LoaderPageProps {
  isLoading: boolean;
}

export default function LoaderPage({ isLoading }: LoaderPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  // Nova referência para o fundo de backup
  const backupBackgroundRef = useRef<HTMLDivElement>(null);

  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    // --- BLOQUEIO DE SCROLL INICIAL ---
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("resize", resize);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isLoading && dimension.width > 0) {
      const height = dimension.height;
      const width = dimension.width;

      const proxy = { progress: 0 };
      const tl = gsap.timeline();

      // --- INÍCIO DA ANIMAÇÃO ---
      tl
        // 1. Removemos o fundo estático instantaneamente para deixar apenas o SVG visível
        // Isso é necessário porque o SVG vai começar a "encolher" e precisamos ver o site por trás dele,
        // não o fundo estático.
        .to(backupBackgroundRef.current, {
          opacity: 0,
          duration: 0,
        })
        // 2. Iniciamos a animação do SVG "derretendo"
        .to(proxy, {
          progress: 1,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            const p = proxy.progress;
            const ySides = height * p;
            const curveAmount = height * 0.5 * Math.sin(p * Math.PI);
            const yCenter = ySides + curveAmount;

            const newPath = `M0 ${ySides} Q${width / 2} ${yCenter} ${width} ${ySides} L${width} ${height} L0 ${height} Z`;

            if (pathRef.current) {
              pathRef.current.setAttribute("d", newPath);
            }
          },
        })
        // 3. Removemos o container principal do DOM
        .to(containerRef.current, {
          display: "none",
          duration: 0,
          onComplete: () => {
            document.body.style.overflow = "";
          },
        });
    }
  }, [isLoading, dimension]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen z-[9999] flex justify-center items-center pointer-events-auto"
    >
      {/* --- BACKGROUND DE BACKUP (CSS Puro) --- */}
      {/* Este div carrega instantaneamente antes do JS/SVG, evitando o flash branco */}
      <div
        ref={backupBackgroundRef}
        className="absolute inset-0 w-full h-full bg-[#15052B] z-0"
      />

      {/* --- ICONE DE LOADING --- */}
      <div
        className={`absolute z-50 text-white font-sans text-xl transition-opacity duration-500 ${
          !isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Bouncy size="45" speed="1.75" color="white" />
      </div>

      {/* --- SVG (A Cortina Animada) --- */}
      {/* z-10 garante que o SVG fique por cima do background de backup */}
      <svg className="absolute top-0 left-0 w-full h-full z-10">
        <path
          ref={pathRef}
          fill="#15052B"
          d={`M0 0 Q${dimension.width / 2} 0 ${dimension.width} 0 L${dimension.width} ${dimension.height} L0 ${dimension.height} Z`}
        />
      </svg>
    </div>
  );
}
