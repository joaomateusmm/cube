"use client";

export default function SplineScene() {
  return (
    <div className="w-full h-full relative">
      <iframe
        src="https://my.spline.design/connectingcard-QikBaXRxuSX18zr5BxV3kgbN/"
        frameBorder="0"
        width="100%"
        height="100%"
        className="w-full h-full border-none"
        title="Spline 3D Scene"
      ></iframe>

      {/* (Opcional) Camada para esconder a logo do Spline no canto inferior direito */}
      <div className="absolute bottom-0 right-0 w-32 h-12 bg-black z-50 pointer-events-none"></div>
    </div>
  );
}
