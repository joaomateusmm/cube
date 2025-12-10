"use client";
import "ldrs/react/Bouncy.css";

import gsap from "gsap";
import { Bouncy } from "ldrs/react";
import React, { useEffect, useRef, useState } from "react";

interface LoaderPageProps {
  isLoading: boolean;
  // NOVO: Função para avisar o pai que a animação visual acabou
  onAnimationComplete?: () => void;
}

export default function LoaderPage({
  isLoading,
  onAnimationComplete,
}: LoaderPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const backupBackgroundRef = useRef<HTMLDivElement>(null);

  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("resize", resize);
      // Nota: Não removemos o overflow aqui, deixamos para o onComplete do GSAP
    };
  }, []);

  useEffect(() => {
    if (!isLoading && dimension.width > 0) {
      const height = dimension.height;
      const width = dimension.width;

      const proxy = { progress: 0 };
      const tl = gsap.timeline();

      tl.to(backupBackgroundRef.current, {
        opacity: 0,
        duration: 0,
      })
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
        .to(containerRef.current, {
          display: "none",
          duration: 0,
          onComplete: () => {
            document.body.style.overflow = "";
            // NOVO: Avisamos o pai que a animação acabou!
            if (onAnimationComplete) {
              onAnimationComplete();
            }
          },
        });
    }
  }, [isLoading, dimension, onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen z-9999 flex justify-center items-center pointer-events-auto"
    >
      <div
        ref={backupBackgroundRef}
        className="absolute inset-0 w-full h-full bg-[#15052B] z-0"
      />

      <div
        className={`absolute z-50 text-white font-sans text-xl flex flex-col items-center justify-center transition-opacity duration-500 ${
          !isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Bouncy size="45" speed="1.75" color="white" />
        <p className="font-['Clash_Display'] translate-y-100 mt-4">
          Carregando
        </p>
      </div>

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
