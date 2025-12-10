"use client";
import { motion } from "framer-motion";

interface SplitHoverTextProps {
  children: string;
  className?: string;
}

export const SplitHoverText = ({
  children,
  className,
}: SplitHoverTextProps) => {
  const letters = children.split("");

  return (
    <motion.div
      initial="initial"
      whileHover="hovered"
      className={`relative block overflow-hidden whitespace-nowrap leading-none cursor-pointer ${className}`}
      style={{ lineHeight: 1.2 }} // Garante que a altura da linha não corte o texto
    >
      {/* CAMADA 1: Texto Original (que sobe e some) */}
      <div>
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              initial: { y: 0 },
              hovered: { y: "-100%" },
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
              delay: 0.025 * i, // O atraso cria o efeito de onda
            }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>

      {/* CAMADA 2: Texto Novo (que vem de baixo e aparece) */}
      <div className="absolute inset-0">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="inline-block text-indigo-500" // Forçamos a cor branca no texto que entra
            variants={{
              initial: { y: "100%" },
              hovered: { y: 0 },
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
              delay: 0.025 * i,
            }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
