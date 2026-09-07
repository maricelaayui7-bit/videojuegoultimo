import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onInput: (control: 'left' | 'right' | 'jump', active: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({ onInput }) => {
  const handleTouchStart = (control: 'left' | 'right' | 'jump') => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onInput(control, true);
  };

  const handleTouchEnd = (control: 'left' | 'right' | 'jump') => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onInput(control, false);
  };

  return (
    <nav
      id="touch-controls"
      aria-label="Controles táctiles en pantalla"
      className="absolute bottom-4 left-0 right-0 z-30 px-4 flex items-center justify-between pointer-events-none select-none"
    >
      {/* Directional Pad (Left / Right) */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <button
          id="btnLeft"
          type="button"
          role="button"
          aria-label="Mover a la izquierda"
          onTouchStart={handleTouchStart('left')}
          onTouchEnd={handleTouchEnd('left')}
          onTouchCancel={handleTouchEnd('left')}
          onMouseDown={handleTouchStart('left')}
          onMouseUp={handleTouchEnd('left')}
          onMouseLeave={handleTouchEnd('left')}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-orange-600/35 border-2 border-orange-500/90 rounded-full flex items-center justify-center active:bg-orange-500 active:scale-95 transition-all text-white shadow-lg shadow-black/70 backdrop-blur-sm touch-none cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6 pointer-events-none text-white font-black" />
        </button>

        <button
          id="btnRight"
          type="button"
          role="button"
          aria-label="Mover a la derecha"
          onTouchStart={handleTouchStart('right')}
          onTouchEnd={handleTouchEnd('right')}
          onTouchCancel={handleTouchEnd('right')}
          onMouseDown={handleTouchStart('right')}
          onMouseUp={handleTouchEnd('right')}
          onMouseLeave={handleTouchEnd('right')}
          className="w-13 h-13 sm:w-14 sm:h-14 bg-orange-600/35 border-2 border-orange-500/90 rounded-full flex items-center justify-center active:bg-orange-500 active:scale-95 transition-all text-white shadow-lg shadow-black/70 backdrop-blur-sm touch-none cursor-pointer"
        >
          <ArrowRight className="w-6 h-6 pointer-events-none text-white font-black" />
        </button>
      </div>

      {/* Action Pad (Jump) */}
      <div className="pointer-events-auto">
        <button
          id="btnJump"
          type="button"
          role="button"
          aria-label="Saltar hacia arriba"
          onTouchStart={handleTouchStart('jump')}
          onTouchEnd={handleTouchEnd('jump')}
          onTouchCancel={handleTouchEnd('jump')}
          onMouseDown={handleTouchStart('jump')}
          onMouseUp={handleTouchEnd('jump')}
          onMouseLeave={handleTouchEnd('jump')}
          className="w-15 h-15 sm:w-16 sm:h-16 bg-orange-600/50 border-2 border-orange-400 rounded-full flex flex-col items-center justify-center text-white shadow-lg shadow-orange-950/70 backdrop-blur-sm active:bg-orange-500 active:scale-95 transition-all touch-none cursor-pointer"
        >
          <ArrowUp className="w-6 h-6 pointer-events-none drop-shadow font-black" />
          <span className="text-[9px] tracking-wider uppercase font-black drop-shadow">SALTAR</span>
        </button>
      </div>
    </nav>
  );
};
