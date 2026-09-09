import { useCallback, useEffect, useRef, useState } from 'react';
import { sound } from './audio';
import { GameOverModal } from './components/GameOverModal';
import { HUD } from './components/HUD';
import { StartModal } from './components/StartModal';
import { TouchControls } from './components/TouchControls';
import { VictoryModal } from './components/VictoryModal';
import { GameEngine } from './game/engine';
import { LEVELS } from './game/levels';
import { GameStats, GameStatus } from './types';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameStatus, setGameStatus] = useState<GameStatus>('start');
  const [lives, setLives] = useState<number>(4);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [lavaDistance, setLavaDistance] = useState<number>(50);
  const [announcement, setAnnouncement] = useState<string>('Bienvenido a Escape del Volcán');
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    altitude: 0,
    currentLevel: 1,
    gemsCollected: 0,
    rocksEvaded: 0,
  });

  // Detect touch device on mount
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 840
      );
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Initialize game engine
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    const handleResize = () => {
      if (!canvas || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      if (engineRef.current) {
        engineRef.current.setCanvasSize(width, height);
      }
    };

    handleResize();

    const engine = new GameEngine(canvas, {
      onStateChange: (newStatus) => {
        setGameStatus(newStatus);
        if (engineRef.current) {
          setLives(engineRef.current.getPlayerLives());
        }
      },
      onStatsUpdate: (newStats) => {
        setStats(newStats);
        if (engineRef.current) {
          setLives(engineRef.current.getPlayerLives());
          setLavaDistance(engineRef.current.getLavaDistance());
        }
      },
      onAnnouncement: (msg) => {
        setAnnouncement(msg);
      },
    });

    engineRef.current = engine;

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      engine.stop();
    };
  }, []);

  // Game control handlers
  const handleStart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.startGame();
    }
  }, []);

  const handleNextLevel = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.nextLevel();
    }
  }, []);

  const handleRetryLevel = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.restartCurrentLevel();
    }
  }, []);

  const handleResetGame = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resetGame();
    }
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    setAnnouncement(muted ? 'Sonido silenciado' : 'Sonido activado');
  }, []);

  const handleTouchInput = useCallback((control: 'left' | 'right' | 'jump', active: boolean) => {
    if (engineRef.current) {
      engineRef.current.setMobileInput(control, active);
    }
  }, []);

  const currentLevelConfig = engineRef.current ? engineRef.current.getCurrentLevelConfig() : LEVELS[0];
  const nextLevelConfig = LEVELS[stats.currentLevel]; // Next level if available

  return (
    <main
      id="game-root-container"
      className="relative w-screen h-screen overflow-hidden bg-[#120505] flex items-center justify-center p-0 md:p-3 select-none"
    >
      {/* Screen Reader ARIA Live Region for Accessibility */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
        aria-atomic="true"
      >
        {announcement}
      </div>

      {/* Normal Proportional Game Stage Area */}
      <div
        ref={containerRef}
        id="game-wrapper"
        className="relative w-full h-full max-w-[800px] max-h-[600px] md:aspect-[4/3] mx-auto bg-[#1a0a0a] overflow-hidden select-none flex flex-col shadow-2xl border-stone-800 md:border-2 md:rounded-xl"
      >
        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          className="absolute inset-0 z-0 w-full h-full block cursor-default touch-none"
          tabIndex={0}
          aria-label="Área de juego interactiva Escape del Volcán"
        />

        {/* HUD (Heads-Up Display) */}
        <HUD
          stats={stats}
          lives={lives}
          maxLives={3}
          levelName={currentLevelConfig.name}
          isMuted={isMuted}
          lavaDistance={lavaDistance}
          onToggleMute={handleToggleMute}
          onReset={handleResetGame}
        />

        {/* Mobile On-Screen Virtual Controls */}
        {isTouchDevice && gameStatus === 'playing' && (
          <TouchControls onInput={handleTouchInput} />
        )}

        {/* Start Game Modal */}
        {gameStatus === 'start' && (
          <StartModal onStart={handleStart} />
        )}

        {/* Game Over Modal */}
        {gameStatus === 'game_over' && (
          <GameOverModal
            stats={stats}
            onRetryLevel={handleRetryLevel}
            onRestartAll={handleResetGame}
          />
        )}

        {/* Victory / Level Complete Modal */}
        {(gameStatus === 'level_complete' || gameStatus === 'victory') && (
          <VictoryModal
            isFinalVictory={gameStatus === 'victory'}
            stats={stats}
            currentLevel={currentLevelConfig}
            nextLevel={nextLevelConfig}
            onNextLevel={handleNextLevel}
            onPlayAgain={handleResetGame}
          />
        )}
      </div>
    </main>
  );
}
