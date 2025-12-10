import { Flame } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const IntegrationCard = ({ className }: { className?: string }) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div
      className={`relative flex h-auto w-[700px] shrink-0 flex-col overflow-hidden rounded-3xl border-2 border-transparent p-10 backdrop-blur-md ${className}`}
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
      <div className="absolute top-10 right-10 z-0 h-[350px] w-[350px] opacity-10 pointer-events-none select-none">
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

      <div className="relative z-10 flex h-auto w-full flex-col justify-between gap-5">
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
            <p className="text-[20px] font-montserrat">Integração Popular</p>
          </div>
        </div>

        <div className="flex w-[450px] flex-col gap-3 mt-auto mb-6">
          <h1 className="text-3xl font-normal bg-linear-to-r from-white to-neutral-800 bg-clip-text text-transparent">
            WebFlow
          </h1>
          <p className="text-neutral-200/80 text-2xl leading-relaxed">
            É uma plataforma baseada na web, com uma interface simples de
            arrastar e soltar.
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
              <label className="switch relative inline-block w-[50px] h-[28px]">
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
  );
};

export default IntegrationCard;
