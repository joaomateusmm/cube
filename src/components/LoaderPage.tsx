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

  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    // --- BLOQUEIO DE SCROLL INICIAL ---
    // Assim que o loader aparece, bloqueamos o scroll e garantimos que está no topo
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("resize", resize);
      // Segurança: se o componente desmontar, devolvemos o scroll
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!isLoading && dimension.width > 0) {
      const height = dimension.height;
      const width = dimension.width;

      const proxy = { progress: 0 };
      const tl = gsap.timeline();

      tl.to(proxy, {
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
      }).to(containerRef.current, {
        display: "none",
        duration: 0,
        // --- DESBLOQUEIO DE SCROLL ---
        // Só devolvemos o scroll quando a animação terminar e a tela preta sumir
        onComplete: () => {
          document.body.style.overflow = "";
        },
      });
    }
  }, [isLoading, dimension]);

  return (
    <div
      ref={containerRef}
      // Removi 'pointer-events-none' para garantir que o user não clica em nada atrás do loader
      // O 'display: none' no final da animação vai resolver isso automaticamente
      className="fixed top-0 left-0 w-full h-screen z-[9999] flex justify-center items-center pointer-events-auto"
    >
      <div
        className={`absolute z-50 text-white font-sans text-xl transition-opacity duration-500 ${
          !isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Bouncy size="45" speed="1.75" color="white" />
      </div>

      <svg className="w-full h-full">
        <path
          ref={pathRef}
          fill="#372AAC"
          d={`M0 0 Q${dimension.width / 2} 0 ${dimension.width} 0 L${dimension.width} ${dimension.height} L0 ${dimension.height} Z`}
        />
      </svg>
    </div>
  );
}
