import React from 'react';
import { Heart, Volume2, VolumeX, RotateCcw, Flame, Mountain } from 'lucide-react';
import { GameStats } from '../types';
import heroLogo from '../assets/images/explorer_volcano_hero_1788875674693.jpg';

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
  const isLavaClose = lavaDistance <= 15;

  return (
    <header
      id="game-hud"
      aria-label="Marcador y controles del juego"
      className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-3 pointer-events-none select-none"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* Left: Logo Emblem, Score & Level */}
        <div className="flex gap-1.5 sm:gap-2 items-center">
          {/* Volcano Game Logo Emblem - Full Uncropped */}
          <div className="flex items-center justify-center bg-black/85 border border-orange-500 p-0.5 shadow-md w-9 h-9 sm:w-10 sm:h-10 overflow-hidden rounded-md">
            <img
              id="hud-logo-icon"
              src={heroLogo}
              alt="Explorador y Volcán"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="bg-black/85 border border-orange-600/80 px-2 py-1 flex flex-col items-center min-w-[70px] sm:min-w-[80px] shadow-md">
            <span className="text-[9px] font-black uppercase tracking-tight text-orange-500">
              Puntuación
            </span>
            <span id="scoreDisplay" className="text-sm sm:text-base font-black text-white font-mono leading-tight">
              {stats.score.toLocaleString()}
            </span>
          </div>

          <div className="bg-black/85 border border-orange-600/80 px-2 py-1 flex flex-col items-center min-w-[50px] sm:min-w-[58px] shadow-md">
            <span className="text-[9px] font-black uppercase tracking-tight text-orange-500">
              Nivel
            </span>
            <span id="levelDisplay" className="text-sm sm:text-base font-black text-white font-mono leading-tight">
              {stats.currentLevel}
            </span>
          </div>
        </div>

        {/* Center: Altitude & Lava alert */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden sm:flex flex-col items-center bg-black/85 border border-orange-600/70 px-2 py-1 shadow-md">
            <span className="text-[8px] uppercase tracking-wider text-orange-400 font-bold">
              Zona
            </span>
            <span className="text-[11px] font-black text-amber-200 uppercase tracking-tight">
              {levelName}
            </span>
          </div>

          <div className="bg-black/85 border border-orange-600/70 px-2 py-1 flex items-center gap-1 shadow-md">
            <Mountain className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs font-black text-white tracking-tight font-mono">
              {stats.altitude}m
            </span>
          </div>

          {/* Lava alert indicator */}
          <div
            className={`bg-black/85 border px-2 py-1 flex items-center gap-1 transition-all duration-300 shadow-md ${
              stats.lavaCountdown && stats.lavaCountdown > 0
                ? 'border-amber-400 bg-amber-950/90 text-amber-300 animate-pulse shadow-amber-500/30'
                : isLavaClose
                ? 'border-red-600 bg-red-950/80 text-white animate-pulse shadow-red-600/40'
                : 'border-orange-600/70 text-orange-400'
            }`}
            title={stats.lavaCountdown && stats.lavaCountdown > 0 ? 'Cuenta regresiva para la lava' : 'Distancia a la lava'}
          >
            <Flame className={`w-3.5 h-3.5 ${stats.lavaCountdown && stats.lavaCountdown > 0 ? 'text-amber-400 animate-bounce' : 'text-orange-500'}`} />
            <span className="text-xs font-black font-mono uppercase tracking-tight">
              {stats.lavaCountdown && stats.lavaCountdown > 0
                ? `Lava en: ${Math.max(1, Math.ceil(stats.lavaCountdown))}s`
                : `Lava: ${lavaDistance}m`}
            </span>
          </div>
        </div>

        {/* Right: Lives Hearts and Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Hearts Container */}
          <div
            id="heartContainer"
            className="flex gap-1 items-center bg-black/85 border border-orange-600/80 px-2 py-1 shadow-md"
            aria-label={`${lives} vidas restantes de ${maxLives}`}
          >
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                id={`heart-icon-${i}`}
                className={`w-4 h-4 transition-all duration-200 ${
                  i < lives
                    ? 'fill-red-600 text-red-600 scale-100 drop-shadow-[0_0_4px_rgba(239,68,68,0.8)]'
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
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-black/85 border border-orange-600/80 hover:bg-orange-600 hover:text-black active:scale-95 text-orange-400 flex items-center justify-center transition-colors shadow-md cursor-pointer"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Game */}
          <button
            id="btn-reset-game"
            type="button"
            role="button"
            onClick={onReset}
            aria-label="Reiniciar partida desde el principio"
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 bg-black/85 border border-orange-600/80 hover:bg-orange-600 hover:text-black active:scale-95 text-orange-400 flex items-center justify-center transition-colors shadow-md cursor-pointer"
            title="Reiniciar partida"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
