import React from 'react';
import { Flame, Play, ShieldAlert, Sparkles, Navigation, Heart } from 'lucide-react';
import volcanoLogo from '../assets/images/volcano_escape_logo_1788773009908.jpg';

interface StartModalProps {
  onStart: () => void;
}

export const StartModal: React.FC<StartModalProps> = ({ onStart }) => {
  return (
    <div
      id="start-modal"
      role="dialog"
      aria-labelledby="game-title-word1"
      aria-describedby="game-instructions"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 sm:p-8 bg-black/90 select-none overflow-y-auto"
    >
      <div className="w-full max-w-xl flex flex-col items-center text-center my-auto">
        
        {/* Volcano & Explorer Logo Illustration */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden pixel-border border-2 border-orange-500 bg-black shadow-[0_0_30px_rgba(249,115,22,0.65)] transform hover:scale-105 transition-transform duration-300">
            <img
              id="game-logo-image"
              src={volcanoLogo}
              alt="Ilustración de Escape del Volcán con explorador"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-black/90 border border-orange-500 rounded-full p-1.5 shadow-md">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          </div>
        </div>

        {/* Geometric Balance Typography */}
        <h1
          id="game-title-word1"
          className="text-6xl sm:text-8xl font-black text-orange-600 mb-0 italic tracking-tighter drop-shadow-[0_4px_16px_rgba(234,88,12,0.6)]"
        >
          ESCAPE
        </h1>
        <h2
          id="game-title-word2"
          className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-[0.2em] uppercase"
        >
          DEL VOLCÁN
        </h2>

        {/* Narrative & Instructions */}
        <div
          id="game-instructions"
          className="max-w-md text-center text-orange-200/80 mb-8 text-sm sm:text-base leading-relaxed"
        >
          <p>
            Usa <span className="text-white font-bold">FLECHAS</span> o <span className="text-white font-bold">A/D</span> para moverte. <span className="text-white font-bold">ESPACIO</span> para saltar.
          </p>
          <p className="mt-2 text-stone-400 text-xs sm:text-sm">
            Sube por las plataformas de piedra y evita la lava hirviente y las rocas en caída.
          </p>
        </div>

        {/* Mechanics & Controls Bento with Geometric Balance styling */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-8">
          <div className="bg-black/80 border-2 border-orange-600 p-3.5 flex items-start gap-3 shadow-lg shadow-black/60">
            <Navigation className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-black uppercase tracking-tighter text-orange-400 block">
                Movimiento
              </span>
              <span className="text-xs text-stone-300 leading-snug">
                Flechas [◀] [▶] o teclas [A] [D]. Botones virtuales en móvil.
              </span>
            </div>
          </div>

          <div className="bg-black/80 border-2 border-orange-600 p-3.5 flex items-start gap-3 shadow-lg shadow-black/60">
            <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-black uppercase tracking-tighter text-orange-400 block">
                Salto
              </span>
              <span className="text-xs text-stone-300 leading-snug">
                Barra Espaciadora o tecla [▲]. Botón táctil SALTAR en móvil.
              </span>
            </div>
          </div>

          <div className="bg-black/80 border-2 border-orange-600 p-3.5 flex items-start gap-3 shadow-lg shadow-black/60">
            <Heart className="w-5 h-5 text-red-500 shrink-0 mt-0.5 fill-red-500" />
            <div>
              <span className="text-[11px] font-black uppercase tracking-tighter text-orange-400 block">
                3 Vidas y Peligros
              </span>
              <span className="text-xs text-stone-300 leading-snug">
                La lava sube sin descanso. Si recibes daño tendrás parpadeo temporal.
              </span>
            </div>
          </div>

          <div className="bg-black/80 border-2 border-orange-600 p-3.5 flex items-start gap-3 shadow-lg shadow-black/60">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-black uppercase tracking-tighter text-orange-400 block">
                3 Niveles Progresivos
              </span>
              <span className="text-xs text-stone-300 leading-snug">
                Plataformas móviles y de ceniza frágil. ¡Llega a la cima!
              </span>
            </div>
          </div>
        </div>

        {/* High-Impact Interactive Start Button */}
        <button
          id="startBtn"
          type="button"
          role="button"
          onClick={onStart}
          aria-label="Iniciar Juego Escape del Volcán"
          className="px-10 sm:px-14 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:via-orange-400 hover:to-yellow-400 text-stone-950 font-black text-xl uppercase tracking-widest pixel-border hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_28px_rgba(249,115,22,0.65)] hover:shadow-[0_0_45px_rgba(249,115,22,0.95)]"
        >
          <Play className="w-6 h-6 fill-stone-950 text-stone-950" />
          <span>Iniciar Juego</span>
        </button>

        {/* Interactive Status Indicator */}
        <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 bg-black/85 border-2 border-orange-500/80 shadow-[0_0_16px_rgba(249,115,22,0.4)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            Partida lista • Toca o pulsa Iniciar
          </span>
        </div>
      </div>
    </div>
  );
};
