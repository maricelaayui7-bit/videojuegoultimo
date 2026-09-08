export type GameStatus = 'start' | 'playing' | 'level_complete' | 'game_over' | 'victory';

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  invulnerableTimer: number; // in seconds
  lives: number;
  maxLives: number;
  isAlive: boolean;
  walkFrame: number;
}

export type PlatformType = 'standard' | 'moving' | 'crumbly' | 'exit';

export interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  // Moving platforms
  movingSpeed?: number;
  minX?: number;
  maxX?: number;
  direction?: number;
  // Crumbly platforms
  isStepped?: boolean;
  crumbleTimer?: number;
  isBroken?: boolean;
}

export interface FallingRock {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  rotationSpeed: number;
  vertices: { x: number; y: number }[];
  color: string;
  glowColor: string;
  hasWarned: boolean;
}

export interface Collectible {
  id: number;
  x: number;
  y: number;
  radius: number;
  type: 'gem' | 'ancient_gold' | 'extra_life';
  value: number;
  collected: boolean;
  bobOffset: number;
}

export interface GameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'spark' | 'smoke' | 'bubble';
}

export interface LevelConfig {
  levelNumber: number;
  name: string;
  subtitle: string;
  worldHeight: number; // in pixels
  lavaSpeed: number; // px per second
  rockSpawnRate: number; // seconds between spawns
  rockSpeedMin: number;
  rockSpeedMax: number;
  movingPlatforms: boolean;
  crumblyPlatforms: boolean;
  description: string;
}

export interface GameStats {
  score: number;
  altitude: number; // in meters
  currentLevel: number;
  gemsCollected: number;
  rocksEvaded: number;
  lavaCountdown?: number; // seconds remaining before lava starts rising (3s countdown)
}
