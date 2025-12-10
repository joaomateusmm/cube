import React from "react";

export function HeroText() {
  return (
    // z-20: Aumentei um pouco para garantir prioridade dentro do container pai
    <div className="flex flex-1 flex-col justify-center pl-16 xl:pl-24 z-[90] pointer-events-none gap-8 ">
      {/* Badge / Selo */}
      {/* Adicionei 'pointer-events-auto' caso vc queira clicar aqui futuramente */}
      <div className="pointer-events-auto border border-gray-400/40 flex rounded-full p-2 pr-4 items-center w-auto max-w-max backdrop-blur-sm">
        <div className="bg-indigo-800 text-black text-xs font-bold font-montserrat px-3 py-1 rounded-full flex items-center mr-3">
          <p>NEW</p>
        </div>
        <p className="text-indigo-800 text-sm font-medium">
          Nova integração já está disponível!
        </p>
      </div>

      {/* Título */}
      <h1 className="font-['Clash_Display'] text-7xl lg:text-8xl xl:text-9xl font-normal bg-gradient-to-tl from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent leading-[0.9]">
        Eleve seu
        <br />
        <span className=" whitespace-nowrap">Score de SEO.</span>
      </h1>

      {/* Parágrafo */}
      <p className="font-montserrat w-full max-w-[650px] text-lg lg:text-2xl xl:text-3xl text-neutral-400 leading-snug">
        Desbloqueie todo o potencial que um bom SEO pode proporcionar para o seu
        negócio.
      </p>

      {/* --- FORMULÁRIO DE E-MAIL --- */}
      {/* pointer-events-auto: Reabilita o clique */}
      <form className="pointer-events-auto relative z-[100] mt-10 flex w-full max-w-lg items-center justify-between rounded-2xl border border-neutral-900 bg-black/40 backdrop-blur-md p-1.5 transition-colors hover:border-neutral-800">
        {/* Input */}
        <input
          type="email"
          placeholder="Seu email..."
          className="w-full bg-transparent px-4 text-lg font-light text-white outline-none placeholder:text-neutral-500 cursor-text"
        />

        {/* Botão */}
        <button
          type="button"
          className="whitespace-nowrap rounded-md bg-white/90 px-10 py-2 text-lg font-normal text-black transition-transform hover:bg-white/95 duration-200 active:scale-95 cursor-pointer"
        >
          Saiba Mais
        </button>
      </form>
    </div>
  );
}
