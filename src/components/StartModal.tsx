import React from 'react';
import { Flame, Play, ShieldAlert, Sparkles, Navigation, Heart } from 'lucide-react';
import volcanoLogo from '../assets/images/volcano_drawing_logo_1788773415330.jpg';

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
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-5 bg-black/90 select-none overflow-y-auto"
    >
      <div className="w-full max-w-md flex flex-col items-center text-center my-auto">
        
        {/* Volcano Drawing Logo Emblem - Full Uncropped View */}
        <div className="relative mb-2.5 flex items-center justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden pixel-border border-2 border-orange-500 bg-black/90 p-1 flex items-center justify-center shadow-[0_0_24px_rgba(249,115,22,0.6)] transform hover:scale-105 transition-transform duration-200">
            <img
              id="game-logo-image"
              src={volcanoLogo}
              alt="Dibujo del Volcán en erupción"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-black/90 border border-orange-500 rounded-full p-1 shadow-md">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
          </div>
        </div>

        {/* Proportional Balanced Typography */}
        <h1
          id="game-title-word1"
          className="text-4xl sm:text-5xl font-black text-orange-500 mb-0 italic tracking-tighter drop-shadow-[0_2px_12px_rgba(234,88,12,0.6)]"
        >
          ESCAPE
        </h1>
        <h2
          id="game-title-word2"
          className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-[0.2em] uppercase"
        >
          DEL VOLCÁN
        </h2>

        {/* Narrative & Instructions */}
        <div
          id="game-instructions"
          className="max-w-sm text-center text-orange-200/90 mb-4 text-xs sm:text-sm leading-relaxed"
        >
          <p>
            Usa <span className="text-white font-bold">FLECHAS</span> o <span className="text-white font-bold">A/D</span> para moverte. <span className="text-white font-bold">ESPACIO</span> para saltar.
          </p>
          <p className="mt-1 text-stone-400 text-[11px] sm:text-xs">
            Escala las plataformas de piedra y evita la lava hirviente y las rocas en caída.
          </p>
        </div>

        {/* Mechanics & Controls Bento with Normal Compact Proportions */}
        <div className="w-full grid grid-cols-2 gap-2 text-left mb-4">
          <div className="bg-black/85 border border-orange-600/80 p-2.5 flex items-start gap-2 shadow-md">
            <Navigation className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-tight text-orange-400 block">
                Movimiento
              </span>
              <span className="text-[10px] text-stone-300 leading-tight">
                [◀] [▶] o [A] [D]
              </span>
            </div>
          </div>

          <div className="bg-black/85 border border-orange-600/80 p-2.5 flex items-start gap-2 shadow-md">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-tight text-orange-400 block">
                Salto
              </span>
              <span className="text-[10px] text-stone-300 leading-tight">
                [ESPACIO] o [▲]
              </span>
            </div>
          </div>

          <div className="bg-black/85 border border-orange-600/80 p-2.5 flex items-start gap-2 shadow-md">
            <Heart className="w-4 h-4 text-red-500 shrink-0 mt-0.5 fill-red-500" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-tight text-orange-400 block">
                3 Vidas
              </span>
              <span className="text-[10px] text-stone-300 leading-tight">
                Evita la lava y rocas
              </span>
            </div>
          </div>

          <div className="bg-black/85 border border-orange-600/80 p-2.5 flex items-start gap-2 shadow-md">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-tight text-orange-400 block">
                3 Niveles
              </span>
              <span className="text-[10px] text-stone-300 leading-tight">
                Escala hasta la meta
              </span>
            </div>
          </div>
        </div>

        {/* High-Impact Interactive Start Button with Normal Size */}
        <button
          id="startBtn"
          type="button"
          role="button"
          onClick={onStart}
          aria-label="Iniciar Juego Escape del Volcán"
          className="px-8 sm:px-10 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:via-orange-400 hover:to-yellow-400 text-stone-950 font-black text-base sm:text-lg uppercase tracking-widest pixel-border hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:shadow-[0_0_35px_rgba(249,115,22,0.9)]"
        >
          <Play className="w-5 h-5 fill-stone-950 text-stone-950" />
          <span>Iniciar Juego</span>
        </button>

        {/* Interactive Status Indicator */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-black/85 border border-orange-500/80 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
            Partida lista • Toca o pulsa Iniciar
          </span>
        </div>
      </div>
    </div>
  );
};
