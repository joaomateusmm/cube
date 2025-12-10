"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  boxColor?: string;
  delay?: number;
}

export const RevealBlockText = ({
  children,
  width = "fit-content",
  boxColor = "#372AAC",
  delay = 0.1,
}: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInView, mainControls, slideControls]);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width,
        overflow: "hidden",
      }}
    >
      {/* O TEXTO */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 0 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{
          duration: 0.01,
          delay: delay + 0.45, // Ajustei levemente para sincronizar com o meio da passagem do bloco
        }}
      >
        {children}
      </motion.div>

      {/* O BLOCO COLORIDO */}
      <motion.div
        variants={{
          hidden: { left: "-100%" }, // Começa fora, na direita
          visible: { left: "100%" }, // Termina fora, na esquerda
        }}
        initial="hidden"
        animate={slideControls}
        transition={{
          duration: 0.9,
          ease: "easeInOut", // Um movimento suave de entrada e saída
          delay: delay,
        }}
        style={{
          position: "absolute",
          top: 4,
          bottom: 4,
          // Removi left: 0 e right: 0 que causavam o travamento
          width: "100%", // O bloco ocupa toda a largura do pai
          background: boxColor,
          zIndex: 20,
        }}
      />
    </div>
  );
};
