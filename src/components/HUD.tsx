import React from 'react';
import { Heart, Volume2, VolumeX, RotateCcw, Flame, Trophy, Mountain } from 'lucide-react';
import { GameStats } from '../types';
import volcanoLogo from '../assets/images/volcano_escape_logo_1788773009908.jpg';

interface HUDProps {
  stats: GameStats;
  lives: number;
  maxLives: number;
  levelName: string;
  isMuted: boolean;
  lavaDistance: number; // in meters
  onToggleMute: () => void;
  onReset: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  lives,
  maxLives,
  levelName,
  isMuted,
  lavaDistance,
  onToggleMute,
  onReset,
}) => {
  const isLavaClose = lavaDistance < 15;

  return (
    <header
      id="game-hud"
      aria-label="Marcador y controles del juego"
      className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-5 pointer-events-none select-none"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left: Logo Emblem, Score & Level in Geometric Balance blocks */}
        <div className="flex gap-2.5 sm:gap-3 items-center">
          {/* Volcano Game Logo Emblem */}
          <div className="hidden sm:flex items-center justify-center bg-black/85 border-2 border-orange-600 p-1 shadow-lg shadow-black/50 w-12 h-12 overflow-hidden">
            <img
              id="hud-logo-icon"
              src={volcanoLogo}
              alt="Logo Escape del Volcán"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="bg-black/85 border-2 border-orange-600 p-2 sm:p-2.5 flex flex-col items-center min-w-[90px] sm:min-w-[110px] shadow-lg shadow-black/50">
            <span className="text-[10px] font-black uppercase tracking-tighter text-orange-500">
              Puntuación
            </span>
            <span id="scoreDisplay" className="text-xl sm:text-2xl font-black text-white font-mono leading-none mt-0.5">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="bg-black/85 border-2 border-orange-600 p-2 sm:p-2.5 flex flex-col items-center min-w-[75px] sm:min-w-[90px] shadow-lg shadow-black/50">
            <span className="text-[10px] font-black uppercase tracking-tighter text-orange-500">
              Nivel
            </span>
            <span id="levelDisplay" className="text-xl sm:text-2xl font-black text-white font-mono leading-none mt-0.5">
              {stats.currentLevel}
            </span>
          </div>
        </div>

        {/* Center: Level Name & Altitude & Lava alert */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex flex-col items-center bg-black/85 border-2 border-orange-600/70 px-3 py-1.5 shadow-lg shadow-black/50">
            <span className="text-[9px] uppercase tracking-widest text-orange-400/80 font-bold">
              Zona Actual
            </span>
            <span className="text-xs font-black text-amber-200 uppercase tracking-wide">
              {levelName}
            </span>
          </div>

          <div className="bg-black/85 border-2 border-orange-600/70 px-3 py-2 flex items-center gap-1.5 shadow-lg shadow-black/50">
            <Mountain className="w-4 h-4 text-orange-400" />
            <span className="text-xs sm:text-sm font-black text-white tracking-tight font-mono">
              {stats.altitude}m
            </span>
          </div>

          {/* Lava alert indicator */}
          <div
            className={`bg-black/85 border-2 px-3 py-2 flex items-center gap-1.5 transition-all duration-300 shadow-lg ${
              isLavaClose
                ? 'border-red-600 bg-red-950/80 text-white animate-pulse shadow-red-600/40'
                : 'border-orange-600/70 text-orange-400'
            }`}
            title="Distancia a la lava"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-black font-mono uppercase tracking-tighter">
              Lava: {lavaDistance}m
            </span>
          </div>
        </div>

        {/* Right: Lives Hearts and Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hearts Container */}
          <div
            id="heartContainer"
            className="flex gap-1.5 items-center bg-black/85 border-2 border-orange-600 p-2 sm:p-2.5 shadow-lg shadow-black/50"
            aria-label={`${lives} vidas restantes de ${maxLives}`}
          >
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                id={`heart-icon-${i}`}
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${
                  i < lives
                    ? 'fill-red-600 text-red-600 scale-100 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]'
                    : 'fill-stone-900 text-stone-800 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            id="muteBtn"
            type="button"
            role="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
            className="w-10 h-10 sm:w-11 sm:h-11 bg-black/85 border-2 border-orange-600 hover:bg-orange-600 hover:text-black active:scale-95 text-orange-400 flex items-center justify-center transition-colors shadow-lg shadow-black/50 cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Reset Game */}
          <button
            id="btn-reset-game"
            type="button"
            role="button"
            onClick={onReset}
            aria-label="Reiniciar partida desde el principio"
            className="w-10 h-10 sm:w-11 sm:h-11 bg-black/85 border-2 border-orange-600 hover:bg-orange-600 hover:text-black active:scale-95 text-orange-400 flex items-center justify-center transition-colors shadow-lg shadow-black/50 cursor-pointer"
            title="Reiniciar partida"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
