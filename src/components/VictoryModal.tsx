import React from 'react';
import { ArrowRight, RotateCcw, CheckCircle2, Sparkles, Gem } from 'lucide-react';
import { GameStats, LevelConfig } from '../types';
import volcanoLogo from '../assets/images/volcano_drawing_logo_1788773415330.jpg';

interface VictoryModalProps {
  isFinalVictory: boolean;
  stats: GameStats;
  currentLevel: LevelConfig;
  nextLevel?: LevelConfig;
  onNextLevel: () => void;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isFinalVictory,
  stats,
  currentLevel,
  nextLevel,
  onNextLevel,
  onPlayAgain,
}) => {
  return (
    <div
      id="victory-modal"
      role="dialog"
      aria-labelledby="victory-title"
      aria-describedby="victory-desc"
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-3 sm:p-5 bg-black/90 select-none overflow-y-auto"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto">
        
        {/* Volcano Logo Illustration - Full Uncropped */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2 rounded-2xl overflow-hidden pixel-border-green border-2 border-green-500 bg-black/90 p-1 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.7)]">
          <img
            src={volcanoLogo}
            alt="Escape del Volcán Éxito"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Proportional Balanced Typography */}
        <h2
          id="victory-title"
          className={`text-3xl sm:text-4xl font-black mb-1 italic tracking-tighter drop-shadow-[0_2px_12px_rgba(34,197,94,0.6)] ${
            isFinalVictory ? 'text-green-500' : 'text-orange-500'
          }`}
        >
          {isFinalVictory ? '¡VICTORIA!' : '¡SUPERADO!'}
        </h2>

        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-[0.15em] uppercase">
          {isFinalVictory ? 'ESCAPE TOTAL' : `NIVEL ${currentLevel.levelNumber}`}
        </h3>

        <p
          id="victory-desc"
          className="text-stone-300 text-xs sm:text-sm max-w-xs mb-3 leading-snug"
        >
          {isFinalVictory
            ? '¡Has alcanzado la cima y el helicóptero de rescate te ha evacuado sano y salvo!'
            : `¡Excelente! Superaste "${currentLevel.name}" antes de que la lava te alcanzara.`}
        </p>

        {/* Stats Card */}
        <div className="w-full bg-black/80 border border-orange-600/80 p-3 mb-3 space-y-2 text-left shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-orange-400 flex items-center gap-1 font-black uppercase tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Puntuación Total
            </span>
            <span className="text-sm font-black text-white font-mono">
              {stats.score.toLocaleString()} pts
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-orange-600/40 pt-1.5">
            <span className="text-[11px] text-orange-400 flex items-center gap-1 font-black uppercase tracking-tight">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Bonificación Meta
            </span>
            <span className="text-xs font-black text-green-400 font-mono">
              +{isFinalVictory ? '2,000' : '1,000'} pts
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-orange-600/40 pt-1.5">
            <span className="text-[11px] text-orange-400 flex items-center gap-1 font-black uppercase tracking-tight">
              <Gem className="w-3.5 h-3.5 text-rose-500" /> Tesoros Recogidos
            </span>
            <span className="text-xs font-black text-white font-mono">
              {stats.gemsCollected}
            </span>
          </div>
        </div>

        {/* Next Level Preview */}
        {!isFinalVictory && nextLevel && (
          <div className="w-full bg-black/80 border border-orange-600/60 p-2.5 mb-3 text-left shadow-md">
            <span className="text-[9px] uppercase font-black text-orange-500 block tracking-wider">
              Próximo Desafío: Nivel {nextLevel.levelNumber} - {nextLevel.name}
            </span>
            <span className="text-[11px] text-stone-300 block mt-0.5">
              {nextLevel.description}
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full flex justify-center">
          {isFinalVictory ? (
            <button
              id="btn-play-again"
              type="button"
              role="button"
              onClick={onPlayAgain}
              aria-label="Jugar de nuevo desde el Nivel 1"
              className="px-6 py-2.5 bg-green-500 text-black font-black text-base uppercase tracking-widest pixel-border-green hover:bg-green-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar de Nuevo</span>
            </button>
          ) : (
            <button
              id="btn-next-level"
              type="button"
              role="button"
              onClick={onNextLevel}
              aria-label="Continuar al siguiente nivel"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:via-orange-400 hover:to-yellow-400 text-stone-950 font-black text-base uppercase tracking-widest pixel-border hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_18px_rgba(249,115,22,0.65)]"
            >
              <span>Siguiente Nivel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

