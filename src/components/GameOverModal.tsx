import React from 'react';
import { RotateCcw, Play, Trophy, Mountain, Gem, Zap } from 'lucide-react';
import { GameStats } from '../types';
import heroLogo from '../assets/images/explorer_volcano_hero_1788875674693.jpg';

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
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-5 bg-black/90 select-none overflow-y-auto"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto">
        
        {/* Explorer Hero Logo Illustration - Full Uncropped */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2 rounded-2xl overflow-hidden pixel-border-red border-2 border-red-600 bg-black/90 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.7)]">
          <img
            src={heroLogo}
            alt="Explorador y Volcán"
            className="w-full h-full object-contain filter contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Proportional Balanced Title */}
        <h2
          id="resultTitle"
          className="text-3xl sm:text-4xl font-black text-red-500 mb-1 italic tracking-tighter drop-shadow-[0_2px_10px_rgba(220,38,38,0.7)]"
        >
          ¡HAS CAÍDO!
        </h2>

        <p
          id="resultStats"
          className="text-xs sm:text-sm text-orange-200/90 font-bold mb-3 tracking-wide"
        >
          Puntuación: <span className="text-white font-black font-mono">{stats.score.toLocaleString()}</span> | Nivel: <span className="text-white font-black font-mono">{stats.currentLevel}</span>
        </p>

        {/* Score & Achievements Grid */}
        <div className="w-full bg-black/80 border border-orange-600/80 p-2.5 mb-4 grid grid-cols-2 gap-2 text-left shadow-lg">
          <div className="bg-stone-950/80 border border-orange-600/40 p-2 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange-500 shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-black tracking-tight text-orange-400 block">Puntuación</span>
              <span className="text-xs font-black text-white font-mono">{stats.score.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-orange-600/40 p-2 flex items-center gap-2">
            <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-black tracking-tight text-orange-400 block">Altitud</span>
              <span className="text-xs font-black text-white font-mono">{stats.altitude} m</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-orange-600/40 p-2 flex items-center gap-2">
            <Gem className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-black tracking-tight text-orange-400 block">Tesoros</span>
              <span className="text-xs font-black text-white font-mono">{stats.gemsCollected}</span>
            </div>
          </div>

          <div className="bg-stone-950/80 border border-orange-600/40 p-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <span className="text-[9px] uppercase font-black tracking-tight text-orange-400 block">Esquives</span>
              <span className="text-xs font-black text-white font-mono">{stats.rocksEvaded}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center">
          <button
            id="restartBtn"
            type="button"
            role="button"
            onClick={onRetryLevel}
            aria-label="Reintentar este nivel"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:via-orange-400 hover:to-yellow-400 text-stone-950 font-black text-sm uppercase tracking-widest pixel-border hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_18px_rgba(249,115,22,0.65)]"
          >
            <Play className="w-4 h-4 fill-stone-950 text-stone-950" />
            <span>Reintentar</span>
          </button>

          <button
            id="btn-restart-game-over"
            type="button"
            role="button"
            onClick={onRestartAll}
            aria-label="Reiniciar desde el Nivel 1"
            className="px-4 py-2.5 bg-black/80 border border-orange-600/80 text-orange-400 hover:bg-orange-600 hover:text-black font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Todo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
