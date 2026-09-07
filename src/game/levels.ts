import { LevelConfig } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    levelNumber: 1,
    name: 'Cráter Inferior',
    subtitle: 'El despertar del gigante',
    worldHeight: 2800,
    lavaSpeed: 40, // px per second
    rockSpawnRate: 2.4, // seconds
    rockSpeedMin: 140,
    rockSpeedMax: 240,
    movingPlatforms: false,
    crumblyPlatforms: false,
    description: 'Aprende los saltos básicos. La lava comienza a subir y caen las primeras piedras volcánicas.',
  },
  {
    levelNumber: 2,
    name: 'Conducto Magmático',
    subtitle: 'Túneles de obsidiana',
    worldHeight: 3600,
    lavaSpeed: 58,
    rockSpawnRate: 1.7,
    rockSpeedMin: 200,
    rockSpeedMax: 340,
    movingPlatforms: true,
    crumblyPlatforms: true,
    description: 'Plataformas móviles y rocas frágiles de ceniza que se rompen al pisarlas. La lava sube con más fuerza.',
  },
  {
    levelNumber: 3,
    name: 'Cúspide en Erupción',
    subtitle: 'Escape final a la cumbre',
    worldHeight: 4600,
    lavaSpeed: 76,
    rockSpawnRate: 1.1,
    rockSpeedMin: 260,
    rockSpeedMax: 440,
    movingPlatforms: true,
    crumblyPlatforms: true,
    description: '¡Erupción violenta! Lluvia incesante de meteoros ígneos. Llega al helicóptero de rescate en la cima.',
  },
];
