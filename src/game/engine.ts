import { sound } from '../audio';
import { Collectible, FallingRock, GameParticle, GameStats, GameStatus, LevelConfig, Platform, Player } from '../types';
import { LEVELS } from './levels';
import { GameRenderer } from './renderer';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: GameRenderer;

  // Game configuration
  public readonly worldWidth: number = 640;
  private currentLevelIndex: number = 0;
  private currentLevel: LevelConfig;
  private status: GameStatus = 'start';

  // Game entities
  private player: Player;
  private platforms: Platform[] = [];
  private rocks: FallingRock[] = [];
  private collectibles: Collectible[] = [];
  private particles: GameParticle[] = [];
  private lavaY: number = 0;
  private cameraY: number = 0;

  // Physics & Mechanics
  private gravity: number = 980; // px/s^2
  private jumpForce: number = -520; // px/s
  private moveSpeed: number = 290; // px/s
  private rockTimer: number = 0;
  private lavaBubbleTimer: number = 0;
  private gameTime: number = 0;
  private maxAltitudeReached: number = 0;
  private totalScore: number = 0;
  private gemsCollected: number = 0;
  private rocksEvaded: number = 0;

  // 3-second countdown before lava starts rising
  private lavaDelayTimer: number = 3.0;
  private lavaAlertFlashTimer: number = 0;
  private lastBeepSecond: number = -1;

  // Controls input state
  private inputState = {
    left: false,
    right: false,
    jump: false,
  };

  // Event callbacks for UI
  private onStateChange: (status: GameStatus) => void;
  private onStatsUpdate: (stats: GameStats) => void;
  private onAnnouncement: (message: string) => void;

  private animationFrameId: number | null = null;
  private lastTime: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    callbacks: {
      onStateChange: (status: GameStatus) => void;
      onStatsUpdate: (stats: GameStats) => void;
      onAnnouncement: (message: string) => void;
    }
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas 2D context');
    this.ctx = context;

    const scale = canvas.width > 0 ? canvas.width / this.worldWidth : 1;
    const initialVHeight = scale > 0 ? canvas.height / scale : 600;
    this.renderer = new GameRenderer(this.ctx, this.worldWidth, initialVHeight);

    this.onStateChange = callbacks.onStateChange;
    this.onStatsUpdate = callbacks.onStatsUpdate;
    this.onAnnouncement = callbacks.onAnnouncement;

    this.currentLevel = LEVELS[0];

    // Initial player state (larger, clearer dimensions for prominent visibility)
    this.player = {
      x: this.worldWidth / 2 - 19,
      y: this.currentLevel.worldHeight - 120,
      vx: 0,
      vy: 0,
      width: 38,
      height: 50,
      isGrounded: true,
      facing: 'right',
      invulnerableTimer: 0,
      lives: 3,
      maxLives: 3,
      isAlive: true,
      walkFrame: 0,
    };

    this.setupListeners();
    this.initLevel(0);
    this.render(); // initial frame
  }

  public getVirtualHeight(): number {
    const scale = this.canvas.width > 0 ? this.canvas.width / this.worldWidth : 1;
    return scale > 0 ? this.canvas.height / scale : 600;
  }

  public setCanvasSize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    const scale = width > 0 ? width / this.worldWidth : 1;
    const vHeight = scale > 0 ? height / scale : 600;
    this.renderer.resize(this.worldWidth, vHeight);
    if (this.status === 'start') {
      this.cameraY = Math.max(0, this.currentLevel.worldHeight - vHeight);
      this.render();
    }
  }

  // Keyboard controls
  private setupListeners() {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.inputState.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.inputState.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
        if (!this.inputState.jump) {
          this.handleJump();
        }
        this.inputState.jump = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.inputState.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.inputState.right = false;
      }
      if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
        this.inputState.jump = false;
      }
    });
  }

  // Mobile virtual controls input
  public setMobileInput(control: 'left' | 'right' | 'jump', active: boolean) {
    if (control === 'left') this.inputState.left = active;
    if (control === 'right') this.inputState.right = active;
    if (control === 'jump') {
      if (active && !this.inputState.jump) {
        this.handleJump();
      }
      this.inputState.jump = active;
    }
  }

  private handleJump() {
    if (this.status !== 'playing') return;
    if (this.player.isGrounded) {
      this.player.vy = this.jumpForce;
      this.player.isGrounded = false;
      sound.playJump();

      // Jump dust particles
      this.spawnDust(this.player.x + this.player.width / 2, this.player.y + this.player.height, 6);
    }
  }

  // Level initialization and procedural generation
  public initLevel(levelIdx: number, keepScoreAndLives: boolean = false) {
    this.currentLevelIndex = levelIdx;
    this.currentLevel = LEVELS[levelIdx] || LEVELS[0];
    const worldH = this.currentLevel.worldHeight;

    if (!keepScoreAndLives) {
      this.player.lives = 3;
      this.totalScore = 0;
      this.gemsCollected = 0;
      this.rocksEvaded = 0;
      this.maxAltitudeReached = 0;
    }

    // Reset player position at bottom ground platform
    this.player.x = this.worldWidth / 2 - 19;
    this.player.y = worldH - 120;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.isGrounded = true;
    this.player.invulnerableTimer = 0;
    this.player.isAlive = true;

    // Reset Lava below ground and position camera to clearly frame player and ground
    const vHeight = this.getVirtualHeight();
    this.lavaY = worldH + 60;
    this.cameraY = Math.max(0, worldH - vHeight);

    // Reset 3-second lava delay countdown
    this.lavaDelayTimer = 3.0;
    this.lavaAlertFlashTimer = 0;
    this.lastBeepSecond = -1;

    this.rocks = [];
    this.collectibles = [];
    this.particles = [];
    this.rockTimer = 0;

    // Generate platforms for the world
    this.generatePlatforms();

    this.notifyStats();
  }

  private generatePlatforms() {
    this.platforms = [];
    const worldH = this.currentLevel.worldHeight;

    // 1. Solid Ground platform at bottom
    this.platforms.push({
      id: 0,
      x: 0,
      y: worldH - 50,
      width: this.worldWidth,
      height: 60,
      type: 'standard',
    });

    let currentY = worldH - 150;
    let nextId = 1;
    let lastX = this.worldWidth / 2;

    // Step-by-step ascending platforms
    while (currentY > 160) {
      // Platform width varies from 95px to 160px based on level
      const minW = this.currentLevelIndex === 0 ? 120 : this.currentLevelIndex === 1 ? 100 : 85;
      const maxW = this.currentLevelIndex === 0 ? 175 : this.currentLevelIndex === 1 ? 140 : 125;
      const width = minW + Math.random() * (maxW - minW);

      // Distribute platforms across left, center, right to create fun jumping lines
      const minX = 40;
      const maxX = this.worldWidth - width - 40;
      
      // Keep next platform reachable from previous
      let x = lastX + (Math.random() > 0.5 ? 1 : -1) * (140 + Math.random() * 120);
      if (x < minX) x = minX + Math.random() * 60;
      if (x > maxX) x = maxX - Math.random() * 60;
      lastX = x;

      // Determine platform type
      let type: Platform['type'] = 'standard';
      const rand = Math.random();

      if (this.currentLevel.crumblyPlatforms && rand < 0.28) {
        type = 'crumbly';
      } else if (this.currentLevel.movingPlatforms && rand < 0.58) {
        type = 'moving';
      }

      const platform: Platform = {
        id: nextId++,
        x,
        y: currentY,
        width,
        height: 20,
        type,
      };

      if (type === 'moving') {
        platform.movingSpeed = 60 + Math.random() * 70;
        platform.direction = Math.random() > 0.5 ? 1 : -1;
        platform.minX = Math.max(30, x - 100);
        platform.maxX = Math.min(this.worldWidth - width - 30, x + 100);
      }

      this.platforms.push(platform);

      // Chance to spawn collectible on this platform
      if (Math.random() < 0.45) {
        const itemType = Math.random() < 0.65 ? 'gem' : Math.random() < 0.88 ? 'ancient_gold' : 'extra_life';
        this.collectibles.push({
          id: nextId++,
          x: x + width / 2,
          y: currentY - 22,
          radius: itemType === 'extra_life' ? 12 : 10,
          type: itemType,
          value: itemType === 'gem' ? 100 : itemType === 'ancient_gold' ? 250 : 500,
          collected: false,
          bobOffset: Math.random() * Math.PI * 2,
        });
      }

      // Vertical distance between platforms (85px - 115px)
      const stepY = 85 + Math.random() * 25;
      currentY -= stepY;
    }

    // Top Goal Platform / Helicopter extraction ledge
    this.platforms.push({
      id: nextId++,
      x: this.worldWidth / 2 - 130,
      y: 120,
      width: 260,
      height: 24,
      type: 'exit',
    });
  }

  // Start game flow
  public startGame() {
    this.status = 'playing';
    this.lastTime = performance.now();
    this.lavaDelayTimer = 3.0;
    this.lavaAlertFlashTimer = 0;
    this.lastBeepSecond = -1;
    this.onStateChange(this.status);
    this.onAnnouncement(`¡Nivel ${this.currentLevel.levelNumber}: ${this.currentLevel.name}! La lava empezará a subir en 3 segundos. ¡Prepárate!`);

    if (!this.animationFrameId) {
      this.loop(this.lastTime);
    }
  }

  // Next level flow
  public nextLevel() {
    if (this.currentLevelIndex < LEVELS.length - 1) {
      this.initLevel(this.currentLevelIndex + 1, true);
      this.startGame();
    } else {
      this.status = 'victory';
      this.onStateChange(this.status);
      this.onAnnouncement('¡Felicidades! Has completado todos los niveles y escapado con vida del volcán.');
      sound.playVictory();
    }
  }

  // Restart current level
  public restartCurrentLevel() {
    this.initLevel(this.currentLevelIndex, true);
    this.startGame();
  }

  // Full reset (back to Level 1, score 0, 3 lives)
  public resetGame() {
    this.initLevel(0, false);
    this.startGame();
  }

  // Main game loop
  private loop = (timestamp: number) => {
    if (!this.lastTime) this.lastTime = timestamp;
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1); // Cap delta to avoid physics tunneling
    this.lastTime = timestamp;
    this.gameTime += dt;

    if (this.status === 'playing') {
      this.update(dt);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  public stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Physics, entities and collisions update
  private update(dt: number) {
    const p = this.player;

    // 1. Horizontal Movement
    if (this.inputState.left) {
      p.vx = -this.moveSpeed;
      p.facing = 'left';
      if (p.isGrounded) p.walkFrame += dt * 14;
    } else if (this.inputState.right) {
      p.vx = this.moveSpeed;
      p.facing = 'right';
      if (p.isGrounded) p.walkFrame += dt * 14;
    } else {
      p.vx *= 0.75; // Friction
      if (Math.abs(p.vx) < 5) p.vx = 0;
    }

    p.x += p.vx * dt;

    // Constrain player horizontally to world bounds
    if (p.x < 10) p.x = 10;
    if (p.x + p.width > this.worldWidth - 10) p.x = this.worldWidth - 10 - p.width;

    // 2. Vertical Movement & Gravity
    p.vy += this.gravity * dt;
    p.y += p.vy * dt;

    // 3. Invulnerability Timer
    if (p.invulnerableTimer > 0) {
      p.invulnerableTimer = Math.max(0, p.invulnerableTimer - dt);
    }

    // 4. Platform Collisions & Moving Platforms logic
    let onPlatform = false;
    for (const plat of this.platforms) {
      // Update moving platforms
      if (plat.type === 'moving' && plat.movingSpeed && plat.minX !== undefined && plat.maxX !== undefined) {
        const dir = plat.direction || 1;
        plat.x += plat.movingSpeed * dir * dt;
        if (plat.x <= plat.minX) {
          plat.x = plat.minX;
          plat.direction = 1;
        } else if (plat.x >= plat.maxX) {
          plat.x = plat.maxX;
          plat.direction = -1;
        }
      }

      // Update crumbly platforms
      if (plat.type === 'crumbly' && plat.isStepped && !plat.isBroken) {
        plat.crumbleTimer = (plat.crumbleTimer || 0) + dt;
        if (plat.crumbleTimer > 0.85) {
          plat.isBroken = true;
          this.spawnDebris(plat.x + plat.width / 2, plat.y + plat.height / 2, 12, '#57534e');
          sound.playHit();
        }
      }

      if (plat.isBroken) continue;

      // Check collision from above
      const prevY = p.y - p.vy * dt;
      const isFalling = p.vy >= 0;
      const overlapX = p.x + p.width > plat.x && p.x < plat.x + plat.width;
      const wasAbove = prevY + p.height <= plat.y + 12;
      const nowTouching = p.y + p.height >= plat.y && p.y + p.height <= plat.y + 24;

      if (overlapX && wasAbove && nowTouching && isFalling) {
        p.y = plat.y - p.height;
        p.vy = 0;
        p.isGrounded = true;
        onPlatform = true;

        // If on moving platform, drag player
        if (plat.type === 'moving' && plat.movingSpeed && plat.direction) {
          p.x += plat.movingSpeed * plat.direction * dt;
        }

        // If on crumbly platform, activate crumble timer
        if (plat.type === 'crumbly' && !plat.isStepped) {
          plat.isStepped = true;
          plat.crumbleTimer = 0;
        }

        // Check Victory / Exit platform reached
        if (plat.type === 'exit') {
          this.handleExitReached();
          return;
        }
      }
    }

    if (!onPlatform && p.vy !== 0) {
      p.isGrounded = false;
    }

    // 5. Lava Delay Countdown & Rising
    if (this.lavaDelayTimer > 0) {
      const currentIntSec = Math.ceil(this.lavaDelayTimer);
      if (currentIntSec !== this.lastBeepSecond && currentIntSec >= 1 && currentIntSec <= 3) {
        this.lastBeepSecond = currentIntSec;
        sound.playCountdownBeep(false);
      }

      this.lavaDelayTimer = Math.max(0, this.lavaDelayTimer - dt);

      if (this.lavaDelayTimer === 0) {
        this.lavaAlertFlashTimer = 1.0;
        sound.playCountdownBeep(true);
        sound.playLavaSizzle();
        this.onAnnouncement('¡La lava ha comenzado a subir! ¡Escala rápido!');
      }
    } else {
      // Lava actively rises
      this.lavaY -= this.currentLevel.lavaSpeed * dt;
      if (this.lavaAlertFlashTimer > 0) {
        this.lavaAlertFlashTimer = Math.max(0, this.lavaAlertFlashTimer - dt);
      }
    }

    // Lava Spurt / Bubble Particles
    this.lavaBubbleTimer += dt;
    if (this.lavaBubbleTimer > 0.12) {
      this.lavaBubbleTimer = 0;
      const bx = Math.random() * this.worldWidth;
      this.particles.push({
        x: bx,
        y: this.lavaY + 4,
        vx: (Math.random() - 0.5) * 30,
        vy: -30 - Math.random() * 60,
        size: 3 + Math.random() * 4,
        color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
        alpha: 0.9,
        life: 0,
        maxLife: 0.8 + Math.random() * 0.6,
        shape: 'spark',
      });
    }

    // 6. Lava Collision
    if (p.y + p.height >= this.lavaY - 6) {
      this.handleLavaDamage();
    }

    // 7. Falling Rocks Spawning & Update (spawns once lava starts rising)
    if (this.lavaDelayTimer <= 0) {
      this.rockTimer += dt;
      if (this.rockTimer >= this.currentLevel.rockSpawnRate) {
        this.rockTimer = 0;
        this.spawnFallingRock();
      }
    }

    // Update rocks
    for (let i = this.rocks.length - 1; i >= 0; i--) {
      const r = this.rocks[i];
      r.x += r.vx * dt;
      r.y += r.vy * dt;
      r.rotation += r.rotationSpeed * dt;

      // Rock smoke trail
      if (Math.random() < 0.35) {
        this.particles.push({
          x: r.x + (Math.random() - 0.5) * r.radius,
          y: r.y - r.radius,
          vx: (Math.random() - 0.5) * 15,
          vy: -20 - Math.random() * 20,
          size: 2.5 + Math.random() * 3,
          color: '#ea580c',
          alpha: 0.7,
          life: 0,
          maxLife: 0.5,
          shape: 'smoke',
        });
      }

      // Check Rock Collision with Player
      const dist = Math.hypot(p.x + p.width / 2 - r.x, p.y + p.height / 2 - r.y);
      if (dist < r.radius + p.width / 2 - 4) {
        // Player hit by rock
        if (p.invulnerableTimer <= 0) {
          this.handlePlayerHit('rock');
          this.spawnDebris(r.x, r.y, 14, '#b91c1c');
          this.rocks.splice(i, 1);
          continue;
        }
      }

      // Evaded rock successfully (passed below player and camera)
      const vHeight = this.getVirtualHeight();
      if (r.y > this.cameraY + vHeight + 80) {
        this.rocksEvaded++;
        this.totalScore += 25;
        this.rocks.splice(i, 1);
        continue;
      }

      // Melted in lava
      if (r.y >= this.lavaY) {
        this.spawnDust(r.x, this.lavaY, 4, '#fbbf24');
        this.rocks.splice(i, 1);
        continue;
      }
    }

    // 8. Collectibles collision
    for (const c of this.collectibles) {
      if (c.collected) continue;
      const dist = Math.hypot(p.x + p.width / 2 - c.x, p.y + p.height / 2 - c.y);
      if (dist < c.radius + p.width / 2) {
        c.collected = true;
        this.gemsCollected++;
        this.totalScore += c.value;
        if (c.type === 'extra_life' && p.lives < p.maxLives) {
          p.lives = Math.min(p.maxLives, p.lives + 1);
          this.onAnnouncement('¡Corazón obtenido! Has recuperado 1 vida.');
        } else {
          this.onAnnouncement(`¡Tesoro recogido! +${c.value} puntos.`);
        }
        sound.playCollect();
        this.spawnSparks(c.x, c.y, 12, c.type === 'gem' ? '#ef4444' : '#f59e0b');
      }
    }

    // 9. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.x += part.vx * dt;
      part.y += part.vy * dt;
      part.life += dt;
      part.alpha = 1 - part.life / part.maxLife;

      if (part.life >= part.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    // 10. Update Altitude & Score
    const currentAltitude = Math.max(0, Math.floor((this.currentLevel.worldHeight - p.y - p.height) / 12));
    if (currentAltitude > this.maxAltitudeReached) {
      const diff = currentAltitude - this.maxAltitudeReached;
      this.totalScore += diff * 4;
      this.maxAltitudeReached = currentAltitude;
    }

    // 11. Smooth Camera Tracking (keep player comfortably centered and clearly visible)
    const currentVHeight = this.getVirtualHeight();
    const targetCameraY = p.y - currentVHeight * 0.6;
    this.cameraY += (targetCameraY - this.cameraY) * 0.12;

    // Clamp camera within world bounds
    const maxCamY = this.currentLevel.worldHeight - currentVHeight;
    if (this.cameraY > maxCamY) this.cameraY = maxCamY;
    if (this.cameraY < 0) this.cameraY = 0;

    this.notifyStats();
  }

  // Spawn a falling rock
  private spawnFallingRock() {
    const radius = 14 + Math.random() * 16;
    const x = 50 + Math.random() * (this.worldWidth - 100);
    // Spawn just above top of camera view
    const y = this.cameraY - 60;
    const vy = this.currentLevel.rockSpeedMin + Math.random() * (this.currentLevel.rockSpeedMax - this.currentLevel.rockSpeedMin);
    const vx = (Math.random() - 0.5) * 40;

    // Generate polygonal vertices for realistic cartoon rock shape
    const numPoints = 7;
    const vertices: { x: number; y: number }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const r = radius * (0.8 + Math.random() * 0.4);
      vertices.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
      });
    }

    this.rocks.push({
      id: Math.random(),
      x,
      y,
      vx,
      vy,
      radius,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 4,
      vertices,
      color: '#44403c',
      glowColor: '#ea580c',
      hasWarned: true,
    });
  }

  // Damage handling when hit by rock
  private handlePlayerHit(source: 'rock' | 'lava') {
    const p = this.player;
    p.lives -= 1;
    p.invulnerableTimer = 2.0; // 2 seconds of flashing invulnerability
    sound.playHit();

    this.onAnnouncement(`¡Cuidado! Recibiste daño de una ${source === 'rock' ? 'roca' : 'lava'}. Vidas restantes: ${p.lives}`);

    if (p.lives <= 0) {
      this.triggerGameOver('rocks');
    } else {
      // Knockback
      p.vy = -280;
      p.vx = (p.facing === 'left' ? 1 : -1) * 200;
    }
    this.notifyStats();
  }

  // Damage handling when player touches lava
  private handleLavaDamage() {
    const p = this.player;
    if (p.invulnerableTimer > 0) {
      // If invulnerable, push upward so player doesn't submerge
      p.y = this.lavaY - p.height - 10;
      p.vy = -340;
      return;
    }

    p.lives -= 1;
    sound.playLavaSizzle();
    sound.playHit();
    this.spawnSparks(p.x + p.width / 2, this.lavaY, 20, '#f97316');

    if (p.lives <= 0) {
      this.triggerGameOver('lava');
    } else {
      // Bounce player onto the lowest available platform above the lava
      p.invulnerableTimer = 2.2;
      const safePlats = this.platforms.filter((pl) => !pl.isBroken && pl.y < this.lavaY - 80);
      safePlats.sort((a, b) => b.y - a.y); // nearest above lava
      const targetPlat = safePlats[0] || this.platforms[0];

      p.x = targetPlat.x + targetPlat.width / 2 - p.width / 2;
      p.y = targetPlat.y - p.height - 20;
      p.vy = -380;
      p.vx = 0;

      this.onAnnouncement(`¡Caíste en la lava! Pierdes 1 vida. Vidas restantes: ${p.lives}`);
    }
    this.notifyStats();
  }

  // Exit platform reached: complete level or win game
  private handleExitReached() {
    if (this.status !== 'playing') return;

    if (this.currentLevelIndex >= LEVELS.length - 1) {
      this.status = 'victory';
      this.totalScore += 2000;
      this.onStateChange(this.status);
      this.onAnnouncement('¡INCREÍBLE! ¡Has escapado del volcán en erupción y alcanzado el helicóptero de rescate!');
      sound.playVictory();
    } else {
      this.status = 'level_complete';
      this.totalScore += 1000;
      this.onStateChange(this.status);
      this.onAnnouncement(`¡Nivel ${this.currentLevel.levelNumber} completado! Prepárate para el siguiente desafío.`);
      sound.playLevelUp();
    }
    this.notifyStats();
  }

  // Trigger game over
  private triggerGameOver(reason: 'lava' | 'rocks') {
    this.status = 'game_over';
    this.player.isAlive = false;
    sound.playGameOver();
    this.onStateChange(this.status);
    const reasonText = reason === 'lava' ? 'atrapado por la lava hirviente' : 'golpeado por las rocas volcánicas';
    this.onAnnouncement(`Fin de la partida. Has sido ${reasonText}. Puntuación final: ${this.totalScore}`);
  }

  private notifyStats() {
    this.onStatsUpdate({
      score: this.totalScore,
      altitude: this.maxAltitudeReached,
      currentLevel: this.currentLevel.levelNumber,
      gemsCollected: this.gemsCollected,
      rocksEvaded: this.rocksEvaded,
      lavaCountdown: this.lavaDelayTimer,
    });
  }

  // Particle generators
  private spawnDust(x: number, y: number, count: number, color: string = '#78716c') {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 60,
        vy: -10 - Math.random() * 30,
        size: 3 + Math.random() * 3,
        color,
        alpha: 0.8,
        life: 0,
        maxLife: 0.4 + Math.random() * 0.3,
        shape: 'smoke',
      });
    }
  }

  private spawnSparks(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 120,
        vy: (Math.random() - 0.5) * 120,
        size: 2.5 + Math.random() * 3,
        color,
        alpha: 1,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
        shape: 'spark',
      });
    }
  }

  private spawnDebris(x: number, y: number, count: number, color: string) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 180,
        vy: -80 - Math.random() * 120,
        size: 3 + Math.random() * 4,
        color,
        alpha: 0.9,
        life: 0,
        maxLife: 0.7 + Math.random() * 0.4,
        shape: 'circle',
      });
    }
  }

  // Render method
  public render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dynamic scale to fit virtual world width (640px) to actual canvas dimensions
    const scale = this.canvas.width / this.worldWidth;

    this.ctx.save();
    this.ctx.scale(scale, scale);

    // 1. Cavern Background
    this.renderer.drawBackground(this.cameraY, this.currentLevel.worldHeight);

    // 2. Goal / Exit zone
    const exitPlat = this.platforms.find((p) => p.type === 'exit');
    if (exitPlat) {
      this.renderer.drawExit(exitPlat, this.cameraY, this.gameTime);
    }

    // 3. Platforms
    this.renderer.drawPlatforms(this.platforms, this.cameraY);

    // 4. Collectibles
    this.renderer.drawCollectibles(this.collectibles, this.cameraY, this.gameTime);

    // 5. Falling Rocks
    this.renderer.drawFallingRocks(this.rocks, this.cameraY);

    // 6. Player
    this.renderer.drawPlayer(this.player, this.cameraY);

    // 7. Particles
    this.renderer.drawParticles(this.particles, this.cameraY);

    // 8. Rising Lava
    this.renderer.drawLava(this.lavaY, this.cameraY, this.gameTime);

    // 9. 3-Second Lava Delay Countdown & Rising Alert
    if (this.status === 'playing' && (this.lavaDelayTimer > 0 || this.lavaAlertFlashTimer > 0)) {
      this.renderer.drawLavaCountdown(this.lavaDelayTimer, this.lavaAlertFlashTimer);
    }

    this.ctx.restore();
  }

  public getPlayerLives(): number {
    return this.player.lives;
  }

  public getCurrentLevelConfig(): LevelConfig {
    return this.currentLevel;
  }

  public getLavaDistance(): number {
    return Math.max(0, Math.floor((this.lavaY - (this.player.y + this.player.height)) / 10));
  }
}
