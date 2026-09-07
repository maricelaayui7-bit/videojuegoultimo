import React from 'react';
import { Skull, RotateCcw, Play, Trophy, Mountain, Gem, Zap } from 'lucide-react';
import { GameStats } from '../types';
import volcanoLogo from '../assets/images/volcano_escape_logo_1788773009908.jpg';

interface GameOverModalProps {
  stats: GameStats;
  onRetryLevel: () => void;
  onRestartAll: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onRetryLevel,
  onRestartAll,
}) => {
  return (
    <div
      id="game-over-modal"
      role="dialog"
      aria-labelledby="resultTitle"
      aria-describedby="game-over-summary"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 sm:p-8 bg-black/90 select-none overflow-y-auto"
    >
      <div className="w-full max-w-lg flex flex-col items-center text-center my-auto">
        
        {/* Volcano Logo Illustration with Red Alert Border */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 rounded-2xl overflow-hidden pixel-border-red border-2 border-red-600 bg-black shadow-[0_0_25px_rgba(220,38,38,0.7)]">
          <img
            src={volcanoLogo}
            alt="Escape del Volcán"
            className="w-full h-full object-cover filter contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Geometric Balance Huge Italic Title */}
        <h2
          id="resultTitle"
          className="text-6xl sm:text-7xl md:text-8xl font-black text-red-600 mb-2 italic tracking-tighter drop-shadow-[0_4px_16px_rgba(220,38,38,0.7)]"
        >
          ¡HAS CAÍDO!
        </h2>

        <p
          id="resultStats"
          className="text-base sm:text-lg text-orange-200/90 font-bold mb-6 tracking-wide"
        >
          Puntuación: <span className="text-white font-black font-mono">{stats.score.toLocaleString()}</span> | Nivel Alcanzado: <span className="text-white font-black font-mono">{stats.currentLevel}</span>
        </p>

        {/* Score & Achievements Grid with Geometric Balance */}
        <div className="w-full bg-black/80 border-2 border-orange-600 p-4 mb-8 grid grid-cols-2 gap-3 text-left shadow-xl shadow-black/70">
          <div className="bg-stone-950/80 border border-orange-600/40 p-3 flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-orange-500 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-black tracking-tighter text-orange-400 block">Puntuación</span>
              <span className="text-base font-black text-white font-mono">{stats.score.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-orange-600/40 p-3 flex items-center gap-2.5">
            <Mountain className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-black tracking-tighter text-orange-400 block">Altitud Máxima</span>
              <span className="text-base font-black text-white font-mono">{stats.altitude} m</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-orange-600/40 p-3 flex items-center gap-2.5">
            <Gem className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-black tracking-tighter text-orange-400 block">Tesoros</span>
              <span className="text-base font-black text-white font-mono">{stats.gemsCollected}</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-orange-600/40 p-3 flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-orange-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-black tracking-tighter text-orange-400 block">Rocas Esquivadas</span>
              <span className="text-base font-black text-white font-mono">{stats.rocksEvaded}</span>
            </div>
          </div>
        </div>

        {/* Geometric Balance Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            id="restartBtn"
            type="button"
            role="button"
            onClick={onRetryLevel}
            aria-label="Reintentar este nivel"
            className="px-8 sm:px-10 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:via-orange-400 hover:to-yellow-400 text-stone-950 font-black text-lg uppercase tracking-widest pixel-border hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(249,115,22,0.65)]"
          >
            <Play className="w-5 h-5 fill-stone-950 text-stone-950" />
            <span>Intentar de nuevo</span>
          </button>

          <button
            id="btn-restart-game-over"
            type="button"
            role="button"
            onClick={onRestartAll}
            aria-label="Reiniciar desde el Nivel 1"
            className="px-6 py-4 bg-black/80 border-2 border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-black font-black text-sm uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Todo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
