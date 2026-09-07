import React from 'react';
import { Trophy, ArrowRight, RotateCcw, Award, CheckCircle2, Sparkles, Gem } from 'lucide-react';
import { GameStats, LevelConfig } from '../types';
import volcanoLogo from '../assets/images/volcano_escape_logo_1788773009908.jpg';

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
      className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 sm:p-8 bg-black/90 select-none overflow-y-auto"
    >
      <div className="w-full max-w-lg flex flex-col items-center text-center my-auto">
        
        {/* Volcano Logo Illustration with Celebratory Pixel-Border */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mb-3 rounded-2xl overflow-hidden pixel-border-green border-2 border-green-500 bg-black shadow-[0_0_25px_rgba(34,197,94,0.7)]">
          <img
            src={volcanoLogo}
            alt="Escape del Volcán Éxito"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Geometric Balance Typography */}
        <h2
          id="victory-title"
          className={`text-6xl sm:text-7xl font-black mb-2 italic tracking-tighter drop-shadow-[0_4px_16px_rgba(34,197,94,0.6)] ${
            isFinalVictory ? 'text-green-500' : 'text-orange-500'
          }`}
        >
          {isFinalVictory ? '¡VICTORIA!' : '¡SUPERADO!'}
        </h2>

        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-[0.2em] uppercase">
          {isFinalVictory ? 'ESCAPE TOTAL' : `NIVEL ${currentLevel.levelNumber}`}
        </h3>

        <p
          id="victory-desc"
          className="text-stone-300 text-sm sm:text-base max-w-md mb-6 leading-relaxed"
        >
          {isFinalVictory
            ? '¡Has alcanzado la cima y el helicóptero de rescate te ha evacuado sano y salvo!'
            : `¡Excelente escalada! Has superado "${currentLevel.name}" antes de que la lava te alcanzara.`}
        </p>

        {/* Stats Card with Geometric Balance styling */}
        <div className="w-full bg-black/80 border-2 border-orange-600 p-4 mb-6 space-y-3 text-left shadow-xl shadow-black/70">
          <div className="flex items-center justify-between">
            <span className="text-xs text-orange-400 flex items-center gap-1.5 font-black uppercase tracking-tighter">
              <Sparkles className="w-4 h-4 text-orange-500" /> Puntuación Total
            </span>
            <span className="text-lg font-black text-white font-mono">
              {stats.score.toLocaleString()} pts
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-orange-600/40 pt-2.5">
            <span className="text-xs text-orange-400 flex items-center gap-1.5 font-black uppercase tracking-tighter">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Bonificación de Meta
            </span>
            <span className="text-base font-black text-green-400 font-mono">
              +{isFinalVictory ? '2,000' : '1,000'} pts
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-orange-600/40 pt-2.5">
            <span className="text-xs text-orange-400 flex items-center gap-1.5 font-black uppercase tracking-tighter">
              <Gem className="w-4 h-4 text-rose-500" /> Tesoros Recogidos
            </span>
            <span className="text-base font-black text-white font-mono">
              {stats.gemsCollected}
            </span>
          </div>
        </div>

        {/* Next Level Preview */}
        {!isFinalVictory && nextLevel && (
          <div className="w-full bg-black/80 border-2 border-orange-600/60 p-3.5 mb-6 text-left shadow-lg">
            <span className="text-[10px] uppercase font-black text-orange-500 block tracking-widest">
              Próximo Desafío: Nivel {nextLevel.levelNumber} - {nextLevel.name}
            </span>
            <span className="text-xs text-stone-300 block mt-0.5">
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
              className="px-10 py-4 bg-green-500 text-black font-black text-xl uppercase tracking-widest pixel-border-green hover:bg-green-400 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-6 h-6" />
              <span>Jugar de Nuevo</span>
            </button>
          ) : (
            <button
              id="btn-next-level"
              type="button"
              role="button"
              onClick={onNextLevel}
              aria-label="Continuar al siguiente nivel"
              className="px-10 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:via-orange-400 hover:to-yellow-400 text-stone-950 font-black text-xl uppercase tracking-widest pixel-border hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_24px_rgba(249,115,22,0.65)]"
            >
              <span>Siguiente Nivel</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
