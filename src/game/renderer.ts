import { Collectible, FallingRock, GameParticle, Platform, Player } from '../types';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  // Draw background cavern with parallax volcanic strata and glowing magma cracks
  public drawBackground(cameraY: number, worldHeight: number) {
    const ctx = this.ctx;
    const progress = Math.min(1, Math.max(0, 1 - cameraY / worldHeight));

    // Dark volcanic cavern gradient matching Geometric Balance #1a0a0a theme
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#1a0a0a'); // Geometric Balance deep black-brown
    bgGrad.addColorStop(0.6, '#24100c');
    bgGrad.addColorStop(1, '#451a03'); // Warm glowing cavern base
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Parallax background rock pillars and cracks
    ctx.save();
    const parallaxOffset1 = (cameraY * 0.25) % 180;
    const parallaxOffset2 = (cameraY * 0.45) % 240;

    // Distant dark stalactites/rock pillars
    ctx.fillStyle = 'rgba(28, 25, 23, 0.65)';
    for (let i = -1; i < this.height / 180 + 2; i++) {
      const y = i * 180 - parallaxOffset1;
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(80, y + 90);
      ctx.lineTo(20, y + 180);
      ctx.lineTo(0, y + 180);
      ctx.lineTo(0, y);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(this.width - 30, y + 40);
      ctx.lineTo(this.width - 90, y + 130);
      ctx.lineTo(this.width - 25, y + 220);
      ctx.lineTo(this.width, y + 220);
      ctx.lineTo(this.width, y + 40);
      ctx.closePath();
      ctx.fill();
    }

    // Glowing magma veins on cavern walls
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.25)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = -1; i < this.height / 240 + 2; i++) {
      const y = i * 240 - parallaxOffset2;
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo(45, y + 60);
      ctx.lineTo(25, y + 110);
      ctx.lineTo(55, y + 170);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.width - 15, y + 30);
      ctx.lineTo(this.width - 40, y + 80);
      ctx.lineTo(this.width - 20, y + 150);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw exit / helicopter rescue zone
  public drawExit(exitPlatform: Platform, cameraY: number, time: number) {
    const ctx = this.ctx;
    const py = exitPlatform.y - cameraY;
    const px = exitPlatform.x;
    const pw = exitPlatform.width;

    ctx.save();
    // Glowing beam of light from the helicopter rescue zone
    const beamGrad = ctx.createLinearGradient(0, py - 180, 0, py);
    beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
    beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0.05)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(px + pw * 0.3, py - 160);
    ctx.lineTo(px + pw * 0.7, py - 160);
    ctx.lineTo(px + pw + 20, py);
    ctx.lineTo(px - 20, py);
    ctx.closePath();
    ctx.fill();

    // Rescue Helicopter / Exit capsule floating at top
    const heliY = py - 130 + Math.sin(time * 3) * 6;
    const heliX = px + pw / 2;

    // Helicopter Blades spinning
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    const bladeSpan = 65 * Math.cos(time * 28);
    ctx.beginPath();
    ctx.moveTo(heliX - bladeSpan, heliY - 22);
    ctx.lineTo(heliX + bladeSpan, heliY - 22);
    ctx.stroke();

    // Rotor hub
    ctx.fillStyle = '#475569';
    ctx.fillRect(heliX - 4, heliY - 22, 8, 8);

    // Helicopter Body (Yellow rescue cartoon chopper)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(heliX, heliY, 32, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Helicopter Cockpit Glass
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(heliX + 12, heliY - 2, 14, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Tail boom
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(heliX - 25, heliY - 6);
    ctx.lineTo(heliX - 60, heliY - 12);
    ctx.lineTo(heliX - 60, heliY - 4);
    ctx.lineTo(heliX - 25, heliY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rescue ladder hanging down to platform
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(heliX - 10, heliY + 16);
    ctx.lineTo(heliX - 10, py);
    ctx.moveTo(heliX + 10, heliY + 16);
    ctx.lineTo(heliX + 10, py);
    // Ladder rungs
    for (let ry = heliY + 24; ry < py - 5; ry += 16) {
      ctx.moveTo(heliX - 10, ry);
      ctx.lineTo(heliX + 10, ry);
    }
    ctx.stroke();

    // Big glowing "ZONA DE RESCATE / SALIDA" banner
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2;
    const bannerW = 180;
    const bannerH = 28;
    const bannerX = px + (pw - bannerW) / 2;
    const bannerY = py - 40;
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¡META DE ESCAPE!', bannerX + bannerW / 2, bannerY + bannerH / 2);

    ctx.restore();
  }

  // Draw platforms with stylized volcanic textures
  public drawPlatforms(platforms: Platform[], cameraY: number) {
    const ctx = this.ctx;

    for (const p of platforms) {
      if (p.isBroken) continue;
      const screenY = p.y - cameraY;

      // Skip if off screen
      if (screenY < -60 || screenY > this.height + 60) continue;

      ctx.save();

      if (p.type === 'exit') {
        // Base landing pad for rescue
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(p.x, screenY, p.width, p.height, 6);
        ctx.fill();
        ctx.stroke();

        // Warning chevrons on landing pad
        ctx.fillStyle = '#fbbf24';
        for (let cx = p.x + 8; cx < p.x + p.width - 15; cx += 25) {
          ctx.beginPath();
          ctx.moveTo(cx, screenY + 2);
          ctx.lineTo(cx + 10, screenY + 2);
          ctx.lineTo(cx + 4, screenY + p.height - 2);
          ctx.lineTo(cx - 6, screenY + p.height - 2);
          ctx.closePath();
          ctx.fill();
        }
      } else if (p.type === 'moving') {
        // Moving Magma Slabs: fiery borders and glowing engine/runes
        ctx.fillStyle = '#44403c';
        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.roundRect(p.x, screenY, p.width, p.height, 8);
        ctx.fill();
        ctx.stroke();

        // Glowing core line
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x + 8, screenY + p.height / 2);
        ctx.lineTo(p.x + p.width - 8, screenY + p.height / 2);
        ctx.stroke();

        // Directional arrows
        ctx.fillStyle = '#ffedd5';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('◄►', p.x + p.width / 2, screenY + p.height / 2);
      } else if (p.type === 'crumbly') {
        // Crumbly ash platforms: cracked, shaking if stepped
        const shakeX = p.isStepped ? (Math.random() - 0.5) * 4 : 0;
        const shakeY = p.isStepped ? (Math.random() - 0.5) * 4 : 0;

        ctx.fillStyle = '#57534e';
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(p.x + shakeX, screenY + shakeY, p.width, p.height, 6);
        ctx.fill();
        ctx.stroke();

        // Cracks on the crumbly rock
        ctx.strokeStyle = p.isStepped ? '#ef4444' : '#78716c';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x + shakeX + 15, screenY + shakeY + 2);
        ctx.lineTo(p.x + shakeX + 25, screenY + shakeY + p.height - 2);
        ctx.moveTo(p.x + shakeX + p.width - 20, screenY + shakeY + 3);
        ctx.lineTo(p.x + shakeX + p.width - 32, screenY + shakeY + p.height - 2);
        ctx.stroke();

        if (p.isStepped) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('¡CUIDADO!', p.x + p.width / 2, screenY - 6);
        }
      } else {
        // Standard Volcanic Rock Platform
        ctx.fillStyle = '#292524';
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(p.x, screenY, p.width, p.height, 8);
        ctx.fill();
        ctx.stroke();

        // Stylized top crust / volcanic stone cap
        ctx.fillStyle = '#44403c';
        ctx.fillRect(p.x + 2, screenY + 2, p.width - 4, 4);

        // Warm cracks
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x + 12, screenY + 6);
        ctx.lineTo(p.x + 24, screenY + p.height - 3);
        ctx.moveTo(p.x + p.width - 18, screenY + 5);
        ctx.lineTo(p.x + p.width - 30, screenY + p.height - 4);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Draw Collectibles: rubies, gold artifacts, heart power-ups
  public drawCollectibles(collectibles: Collectible[], cameraY: number, time: number) {
    const ctx = this.ctx;

    for (const c of collectibles) {
      if (c.collected) continue;
      const sy = c.y - cameraY + Math.sin(time * 4 + c.bobOffset) * 5;
      if (sy < -40 || sy > this.height + 40) continue;

      ctx.save();
      ctx.translate(c.x, sy);

      // Glowing aura
      const auraGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, c.radius + 8);
      if (c.type === 'gem') {
        auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
        auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else if (c.type === 'ancient_gold') {
        auraGrad.addColorStop(0, 'rgba(250, 204, 21, 0.8)');
        auraGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      } else {
        auraGrad.addColorStop(0, 'rgba(236, 72, 153, 0.8)');
        auraGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      }
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, c.radius + 10, 0, Math.PI * 2);
      ctx.fill();

      if (c.type === 'gem') {
        // Red Ruby
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#fee2e2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -c.radius);
        ctx.lineTo(c.radius, -c.radius * 0.3);
        ctx.lineTo(c.radius * 0.7, c.radius);
        ctx.lineTo(-c.radius * 0.7, c.radius);
        ctx.lineTo(-c.radius, -c.radius * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shimmer facet
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(0, -c.radius);
        ctx.lineTo(c.radius * 0.5, -c.radius * 0.3);
        ctx.lineTo(0, c.radius * 0.2);
        ctx.closePath();
        ctx.fill();
      } else if (c.type === 'ancient_gold') {
        // Golden volcanic idol / coin
        ctx.fillStyle = '#f59e0b';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Star inside
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('★', 0, 0);
      } else {
        // Extra Life Heart
        ctx.fillStyle = '#f43f5e';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const r = c.radius * 0.7;
        ctx.moveTo(0, r * 0.8);
        ctx.bezierCurveTo(-r * 1.3, -r * 0.5, -r * 1.5, -r * 1.5, 0, -r * 0.6);
        ctx.bezierCurveTo(r * 1.5, -r * 1.5, r * 1.3, -r * 0.5, 0, r * 0.8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Draw Falling Rocks with danger warning indicators
  public drawFallingRocks(rocks: FallingRock[], cameraY: number) {
    const ctx = this.ctx;

    for (const r of rocks) {
      const sy = r.y - cameraY;

      // Draw danger warning arrow if rock is just above the visible screen
      if (sy < 0 && sy > -180) {
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(r.x, 26);
        ctx.lineTo(r.x - 10, 10);
        ctx.lineTo(r.x + 10, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 11px Fredoka, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('!', r.x, 20);
        ctx.restore();
      }

      // Draw rock if on screen
      if (sy < -40 || sy > this.height + 60) continue;

      ctx.save();
      ctx.translate(r.x, sy);
      ctx.rotate(r.rotation);

      // Outer fiery trail glow
      const rockGlow = ctx.createRadialGradient(0, 0, r.radius * 0.4, 0, 0, r.radius * 1.4);
      rockGlow.addColorStop(0, r.color);
      rockGlow.addColorStop(0.7, r.glowColor);
      rockGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = rockGlow;
      ctx.beginPath();
      ctx.arc(0, 0, r.radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // Irregular polygonal rock body
      ctx.fillStyle = '#292524';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      r.vertices.forEach((v, idx) => {
        if (idx === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing cracks on the rock
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r.vertices[0].x * 0.7, r.vertices[0].y * 0.7);
      ctx.moveTo(0, 0);
      ctx.lineTo(r.vertices[2]?.x * 0.6 || 0, r.vertices[2]?.y * 0.6 || 0);
      ctx.stroke();

      ctx.restore();
    }
  }

  // Draw Explorer Player Character
  public drawPlayer(player: Player, cameraY: number) {
    const ctx = this.ctx;
    const px = player.x;
    const py = player.y - cameraY;

    // Invulnerability blink effect
    if (player.invulnerableTimer > 0) {
      if (Math.floor(player.invulnerableTimer * 12) % 2 === 0) {
        return; // skip frame to blink
      }
    }

    ctx.save();
    ctx.translate(px + player.width / 2, py + player.height / 2);

    const w = player.width;
    const h = player.height;

    // 1. Warm radial torch illumination halo around the player person
    const torchGlow = ctx.createRadialGradient(0, -h / 4, 10, 0, 0, 95);
    torchGlow.addColorStop(0, 'rgba(254, 215, 170, 0.45)');
    torchGlow.addColorStop(0.35, 'rgba(249, 115, 22, 0.22)');
    torchGlow.addColorStop(0.8, 'rgba(234, 88, 12, 0.08)');
    torchGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = torchGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 95, 0, Math.PI * 2);
    ctx.fill();

    // 2. High-contrast character rim highlight so the person pops against dark rocks
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-w / 2 - 4, -h / 2 - 1, w + 8, h + 5, 8);
    ctx.stroke();

    // 3. Player Beacon / "TÚ" indicator so the person is 100% visible and unmistakable
    const markerBob = Math.sin(Date.now() / 220) * 3;
    const markerY = -h / 2 - 18 + markerBob;

    // Small beacon badge "TÚ"
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.roundRect(-10, markerY - 12, 20, 11, 3);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TÚ', 0, markerY - 6);

    // Downward pointing arrow
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(0, markerY + 4);
    ctx.lineTo(-4, markerY);
    ctx.lineTo(4, markerY);
    ctx.closePath();
    ctx.fill();

    // Flip horizontal if facing left
    if (player.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Shadow on ground when close
    if (player.isGrounded) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, h / 2 - 2, w / 2, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Backpack on back
    ctx.fillStyle = '#854d0e'; // Rich leather brown
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-w / 2 - 4, -h / 2 + 12, 9, 20, 3);
    ctx.fill();
    ctx.stroke();

    // Bedroll / sleeping mat on top of backpack
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(-w / 2 - 4, -h / 2 + 8, 9, 4);

    // Legs / Boots with walking animation
    const legOffset = player.isGrounded
      ? Math.sin(player.walkFrame) * 6
      : 4; // bent if jumping

    // Back leg
    ctx.fillStyle = '#1e40af'; // Vibrant blue adventurer pants
    ctx.fillRect(-6 - legOffset * 0.5, h / 2 - 14, 7, 10);
    ctx.fillStyle = '#451a03'; // Boot
    ctx.fillRect(-7 - legOffset * 0.5, h / 2 - 5, 9, 7);

    // Front leg
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(1 + legOffset * 0.5, h / 2 - 14, 7, 10);
    ctx.fillStyle = '#5c2b09';
    ctx.fillRect(1 + legOffset * 0.5, h / 2 - 5, 9, 7);

    // Explorer Torso / Khaki Vest with bright accents
    ctx.fillStyle = '#ea580c'; // Vibrant explorer shirt
    ctx.beginPath();
    ctx.roundRect(-w / 2 + 3, -h / 2 + 12, w - 6, 17, 4);
    ctx.fill();
    ctx.strokeStyle = '#9a3412';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Utility belt with gold buckle
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-w / 2 + 3, -h / 2 + 24, w - 6, 4);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-2, -h / 2 + 23, 5, 6);

    // Head / Face (warm clear skin tone)
    ctx.fillStyle = '#fed7aa'; // Clean bright peach skin
    ctx.beginPath();
    ctx.arc(2, -h / 2 + 7, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Cartoon Explorer Eyes (bright & expressive)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(5, -h / 2 + 6, 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a'; // Pupil looking forward
    ctx.beginPath();
    ctx.arc(6.2, -h / 2 + 6, 2, 0, Math.PI * 2);
    ctx.fill();
    // Tiny eye spark
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7, -h / 2 + 5, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrow and confident / focused smile
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(3, -h / 2 + 2);
    ctx.lineTo(7.5, -h / 2 + 3);
    ctx.stroke();

    // Smile / mouth
    ctx.beginPath();
    ctx.arc(5, -h / 2 + 9, 2.5, 0.1, Math.PI * 0.9);
    ctx.stroke();

    // Explorer Safari Hat (Iconic Pith Helmet)
    ctx.fillStyle = '#fef3c7'; // Cream safari hat
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    // Hat brim
    ctx.beginPath();
    ctx.ellipse(2, -h / 2 + 2, 15, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Hat dome
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(2, -h / 2 + 1, 9.5, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Red decorative band on hat
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-7, -h / 2, 18, 3);

    // Explorer Flashlight / Torch in hand
    const armAngle = player.isGrounded ? Math.cos(player.walkFrame) * 0.4 : -0.6;
    ctx.save();
    ctx.translate(w / 4, -h / 2 + 16);
    ctx.rotate(armAngle);
    // Arm
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(-2, 0, 5, 10);
    // Torch handle
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-1, 8, 3, 11);
    // Torch head
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-3, 6, 7, 3);
    // Torch animated flame
    const flameFlicker = Math.sin(Date.now() / 80) * 1.5;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-3, 6);
    ctx.lineTo(4, 6);
    ctx.lineTo(0.5 + flameFlicker, -3);
    ctx.closePath();
    ctx.fill();
    // Flame inner core
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-1.5, 6);
    ctx.lineTo(2.5, 6);
    ctx.lineTo(0.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // Draw Rising Animated Fluid Lava
  public drawLava(lavaY: number, cameraY: number, time: number) {
    const ctx = this.ctx;
    const screenLavaY = lavaY - cameraY;

    // If lava is below view, don't waste draw calls
    if (screenLavaY > this.height + 50) return;

    ctx.save();

    // Draw ambient fiery heat glow above the lava surface
    const glowHeight = 120;
    const glowGrad = ctx.createLinearGradient(0, screenLavaY - glowHeight, 0, screenLavaY);
    glowGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
    glowGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.2)');
    glowGrad.addColorStop(1, 'rgba(251, 191, 36, 0.55)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, Math.max(0, screenLavaY - glowHeight), this.width, glowHeight);

    // Multi-layer animated sine waves for bubbling, viscous fluid lava
    const waveCount = 3;
    const waveConfigs = [
      { amp: 8, freq: 0.015, speed: 2.4, color: '#dc2626', offset: 0 },
      { amp: 10, freq: 0.022, speed: 3.1, color: '#ea580c', offset: 4 },
      { amp: 7, freq: 0.028, speed: 4.0, color: '#f59e0b', offset: 8 },
    ];

    waveConfigs.forEach((wc) => {
      ctx.fillStyle = wc.color;
      ctx.beginPath();
      ctx.moveTo(0, this.height);
      ctx.lineTo(0, screenLavaY + wc.offset);

      for (let x = 0; x <= this.width; x += 10) {
        const y =
          screenLavaY +
          wc.offset +
          Math.sin(x * wc.freq + time * wc.speed) * wc.amp +
          Math.cos(x * 0.01 + time * 1.5) * 4;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(this.width, this.height);
      ctx.closePath();
      ctx.fill();
    });

    // Main deep lava body with radiant gradient
    const deepLavaGrad = ctx.createLinearGradient(0, screenLavaY, 0, this.height);
    deepLavaGrad.addColorStop(0, '#fde047'); // Incandescent bright yellow top
    deepLavaGrad.addColorStop(0.12, '#ea580c');
    deepLavaGrad.addColorStop(0.5, '#b91c1c');
    deepLavaGrad.addColorStop(1, '#450a0a'); // Deep dark magma depths
    ctx.fillStyle = deepLavaGrad;
    ctx.beginPath();
    ctx.moveTo(0, this.height);
    ctx.lineTo(0, screenLavaY + 6);

    for (let x = 0; x <= this.width; x += 8) {
      const y =
        screenLavaY +
        6 +
        Math.sin(x * 0.025 + time * 3.5) * 6 +
        Math.sin(x * 0.05 + time * 2) * 3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(this.width, this.height);
    ctx.closePath();
    ctx.fill();

    // Boiling magma bubbles floating on surface
    for (let i = 0; i < 6; i++) {
      const bubbleX = (this.width * (i * 0.18 + (time * 0.04) % 0.2)) % this.width;
      const bubbleY =
        screenLavaY +
        6 +
        Math.sin(bubbleX * 0.025 + time * 3.5) * 6 -
        Math.sin(time * 6 + i) * 3;
      const bubbleRadius = 5 + Math.sin(time * 5 + i) * 2;

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, Math.max(1, bubbleRadius), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw Particles (Embers, smoke puffs, debris)
  public drawParticles(particles: GameParticle[], cameraY: number) {
    const ctx = this.ctx;

    for (const p of particles) {
      const sy = p.y - cameraY;
      if (sy < -20 || sy > this.height + 20) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(p.x, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'spark') {
        ctx.fillRect(p.x - p.size / 2, sy - p.size / 2, p.size, p.size);
      } else if (p.shape === 'smoke') {
        ctx.beginPath();
        ctx.arc(p.x, sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'bubble') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(p.x, sy, p.size, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // Draw 3-second countdown before lava starts rising & alert banner
  public drawLavaCountdown(lavaDelayTimer: number, flashTimer: number) {
    const ctx = this.ctx;
    ctx.save();

    const centerX = this.width / 2;

    if (lavaDelayTimer > 0) {
      const seconds = Math.max(1, Math.ceil(lavaDelayTimer));
      const fraction = lavaDelayTimer - Math.floor(lavaDelayTimer); // 0 to 1 for pop animation
      const popScale = 1 + fraction * 0.18;

      const cardW = 310;
      const cardH = 88;
      const cardX = centerX - cardW / 2;
      const cardY = 55;

      // Dark volcanic alert container with lava glow
      ctx.shadowColor = 'rgba(234, 88, 12, 0.7)';
      ctx.shadowBlur = 20;
      ctx.fillStyle = 'rgba(17, 7, 3, 0.9)';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 14);
      ctx.fill();

      // Border with warm gradient
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#f97316';
      ctx.stroke();

      // Top caution label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('⚠️ ¡PREPÁRATE! LA LAVA SUBE EN', centerX, cardY + 20);

      // Large animated countdown number
      ctx.save();
      ctx.translate(centerX, cardY + 48);
      ctx.scale(popScale, popScale);

      // Radial backlight
      const numGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 32);
      numGlow.addColorStop(0, 'rgba(254, 240, 138, 0.5)');
      numGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = numGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0, Math.PI * 2);
      ctx.fill();

      // Number text
      ctx.font = '900 36px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 4;
      ctx.strokeText(`${seconds}`, 0, 0);

      const grad = ctx.createLinearGradient(0, -18, 0, 18);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#ea580c');
      ctx.fillStyle = grad;
      ctx.fillText(`${seconds}`, 0, 0);
      ctx.restore();

      // Progress bar underneath
      const barW = 200;
      const barH = 6;
      const barX = centerX - barW / 2;
      const barY = cardY + cardH - 14;

      // Bar track
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 3);
      ctx.fill();

      // Bar fill (drains down as timer decreases)
      const fillW = Math.max(4, barW * (lavaDelayTimer / 3.0));
      const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      barGrad.addColorStop(0, '#ef4444');
      barGrad.addColorStop(0.6, '#f97316');
      barGrad.addColorStop(1, '#fde047');
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, 3);
      ctx.fill();

    } else if (flashTimer > 0) {
      // Flashing "¡¡LA LAVA ESTÁ SUBIENDO!!" alert
      const isFlashBright = Math.sin(flashTimer * 16) > 0;
      const bannerW = 340;
      const bannerH = 46;
      const bannerX = centerX - bannerW / 2;
      const bannerY = 65;

      ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = isFlashBright ? 'rgba(185, 28, 28, 0.96)' : 'rgba(127, 29, 29, 0.92)';
      ctx.beginPath();
      ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 12);
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isFlashBright ? '#fef08a' : '#ea580c';
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 15px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🔥 ¡¡LA LAVA ESTÁ SUBIENDO!! ¡ESCALA! 🔥', centerX, bannerY + bannerH / 2);
    }

    ctx.restore();
  }
}
