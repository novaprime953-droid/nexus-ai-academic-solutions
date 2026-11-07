import React, { useEffect, useRef } from 'react';

export type AIAnimationVariant =
  | 'home'
  | 'academy'
  | 'tools'
  | 'services'
  | 'about'
  | 'dashboard'
  | 'login'
  | 'blog'
  | 'contact';

interface AnimatedAIBackgroundProps {
  variant?: AIAnimationVariant;
  className?: string;
  opacity?: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number; // depth: 0.2 (far) to 1.3 (near)
  vx: number;
  vy: number;
  baseRadius: number;
  colorType: 'cyan' | 'blue' | 'purple' | 'violet' | 'white';
  pulseSpeed: number;
  pulsePhase: number;
  orbitAngle: number;
  orbitRadius: number;
  isHub: boolean;
}

interface SynapticPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  color: string;
}

export const AnimatedAIBackground: React.FC<AnimatedAIBackgroundProps> = ({
  variant = 'home',
  className = '',
  opacity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;

    // Palette tokens
    const cyan = '#00D9FF';
    const blue = '#4263FF';
    const purple = '#8B5CF6';
    const violet = '#A855F7';
    const softWhite = '#F1F5FF';

    // Track smooth mouse position & velocity
    const mouse = {
      x: width * 0.5,
      y: height * 0.45,
      targetX: width * 0.5,
      targetY: height * 0.45,
      vx: 0,
      vy: 0,
      active: false,
    };

    // Track scroll offset for vertical parallax through the depth field
    let scrollY = window.scrollY || 0;
    let targetScrollY = scrollY;

    const handleScroll = () => {
      targetScrollY = window.scrollY || 0;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = width * 0.5;
      mouse.targetY = height * 0.45;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // ==================================================
    // 1. OFFSCREEN SPRITE CACHE FOR HIGH-PERFORMANCE GLOW
    // Pre-rendering radial glow sprites gives 60FPS with 200+ particles
    // ==================================================
    const spriteCache: Record<string, HTMLCanvasElement> = {};
    const spriteColors = {
      cyan: 'rgba(0, 217, 255,',
      blue: 'rgba(66, 99, 255,',
      purple: 'rgba(139, 92, 246,',
      violet: 'rgba(168, 85, 247,',
      white: 'rgba(241, 245, 255,',
    };

    Object.entries(spriteColors).forEach(([name, rgbPrefix]) => {
      const sCanvas = document.createElement('canvas');
      sCanvas.width = 64;
      sCanvas.height = 64;
      const sCtx = sCanvas.getContext('2d');
      if (sCtx) {
        const radGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
        radGrad.addColorStop(0, `${rgbPrefix} 1)`);
        radGrad.addColorStop(0.25, `${rgbPrefix} 0.55)`);
        radGrad.addColorStop(0.6, `${rgbPrefix} 0.15)`);
        radGrad.addColorStop(1, `${rgbPrefix} 0)`);
        sCtx.fillStyle = radGrad;
        sCtx.fillRect(0, 0, 64, 64);
        spriteCache[name] = sCanvas;
      }
    });

    // ==================================================
    // 2. HUNDREDS OF MULTI-DEPTH PARTICLES (120 to 220)
    // ==================================================
    const particleCount = isMobile ? 110 : (variant === 'dashboard' ? 140 : 210);
    const particles: Particle3D[] = [];

    const colorKeys: ('cyan' | 'blue' | 'purple' | 'violet' | 'white')[] = [
      'cyan',
      'blue',
      'purple',
      'violet',
      'cyan',
      'white',
    ];

    for (let i = 0; i < particleCount; i++) {
      // Depth z: 0.25 (far background) to 1.35 (near foreground)
      const z = 0.25 + Math.random() * 1.1;
      const isHub = i % 14 === 0;
      const baseRadius = isHub ? 3.5 : 1.2 + Math.random() * 1.8;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * 0.45 * z,
        vy: (Math.random() - 0.5) * 0.45 * z,
        baseRadius,
        colorType: colorKeys[i % colorKeys.length],
        pulseSpeed: 0.015 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 15 + Math.random() * 35,
        isHub,
      });
    }

    // ==================================================
    // 3. SYNAPTIC ACTION POTENTIALS (TRAVERSING PULSES)
    // ==================================================
    const pulses: SynapticPulse[] = [];
    const maxPulses = isMobile ? 12 : 28;

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse easing with momentum
      const prevMx = mouse.x;
      const prevMy = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * 0.055;
      mouse.y += (mouse.targetY - mouse.y) * 0.055;
      mouse.vx = mouse.x - prevMx;
      mouse.vy = mouse.y - prevMy;

      // Smooth scroll parallax
      scrollY += (targetScrollY - scrollY) * 0.08;

      // --------------------------------------------------
      // A. BASE DEEP MIDNIGHT BLUE CANVAS (NO PURE BLACK)
      // --------------------------------------------------
      const baseGrad = ctx.createLinearGradient(0, 0, width, height);
      baseGrad.addColorStop(0, '#101A3B');
      baseGrad.addColorStop(0.35, '#131F46');
      baseGrad.addColorStop(0.7, '#172554');
      baseGrad.addColorStop(1, '#0F1735');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // --------------------------------------------------
      // B. BEAUTIFULLY MOVING GRADIENT LIGHTING SPOTLIGHTS
      // --------------------------------------------------
      // Spotlight 1: Electric Cyan (orbits smoothly near mouse)
      const spot1X = mouse.x + Math.cos(time * 0.5) * 80;
      const spot1Y = mouse.y + Math.sin(time * 0.6) * 60;
      const spot1Radius = Math.max(width, height) * 0.48;
      const spot1Grad = ctx.createRadialGradient(spot1X, spot1Y, 0, spot1X, spot1Y, spot1Radius);
      spot1Grad.addColorStop(0, 'rgba(0, 217, 255, 0.12)');
      spot1Grad.addColorStop(0.4, 'rgba(66, 99, 255, 0.06)');
      spot1Grad.addColorStop(0.85, 'rgba(16, 26, 59, 0)');
      ctx.fillStyle = spot1Grad;
      ctx.fillRect(0, 0, width, height);

      // Spotlight 2: AI Violet / Neon Purple (drifting counter-orbit top-right)
      const spot2X = width * 0.75 + Math.sin(time * 0.35) * 160;
      const spot2Y = height * 0.28 + Math.cos(time * 0.4) * 110;
      const spot2Radius = Math.max(width, height) * 0.55;
      const spot2Grad = ctx.createRadialGradient(spot2X, spot2Y, 0, spot2X, spot2Y, spot2Radius);
      spot2Grad.addColorStop(0, 'rgba(139, 92, 246, 0.11)');
      spot2Grad.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
      spot2Grad.addColorStop(0.9, 'rgba(16, 26, 59, 0)');
      ctx.fillStyle = spot2Grad;
      ctx.fillRect(0, 0, width, height);

      // Spotlight 3: Deep Royal Blue (lower mid atmospheric haze)
      const spot3X = width * 0.3 + Math.cos(time * 0.25) * 140;
      const spot3Y = height * 0.75 + Math.sin(time * 0.3) * 90;
      const spot3Radius = Math.max(width, height) * 0.52;
      const spot3Grad = ctx.createRadialGradient(spot3X, spot3Y, 0, spot3X, spot3Y, spot3Radius);
      spot3Grad.addColorStop(0, 'rgba(66, 99, 255, 0.09)');
      spot3Grad.addColorStop(0.5, 'rgba(23, 37, 84, 0.05)');
      spot3Grad.addColorStop(1, 'rgba(16, 26, 59, 0)');
      ctx.fillStyle = spot3Grad;
      ctx.fillRect(0, 0, width, height);

      // --------------------------------------------------
      // C. SUBTLE HOLOGRAPHIC NEURAL PERSPECTIVE GRID
      // --------------------------------------------------
      ctx.save();
      const gridHorizon = height * 0.38;
      const gridBottom = height;
      const gridLines = isMobile ? 12 : 22;

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(66, 99, 255, 0.05)';
      ctx.beginPath();

      // Horizontal perspective grid rungs with sinusoidal wave ripple
      for (let gy = gridHorizon; gy <= gridBottom; gy += (gridBottom - gridHorizon) / 10) {
        const factor = (gy - gridHorizon) / (gridBottom - gridHorizon);
        const yWarp = Math.sin(time * 1.2 + factor * Math.PI) * 4;
        ctx.moveTo(0, gy + yWarp);
        ctx.lineTo(width, gy + yWarp);
      }

      // Vanishing convergence lines radiating from horizon
      const vanishX = width * 0.5 + Math.sin(time * 0.2) * 50;
      for (let gx = 0; gx <= gridLines; gx++) {
        const bottomX = (width / gridLines) * gx;
        ctx.moveTo(vanishX, gridHorizon);
        ctx.lineTo(bottomX, gridBottom);
      }
      ctx.stroke();
      ctx.restore();

      // --------------------------------------------------
      // D. SLOWLY FLOWING ENERGY WAVES (ORGANIC AI CURVES)
      // --------------------------------------------------
      for (let w = 0; w < 3; w++) {
        ctx.save();
        ctx.beginPath();
        const baseWaveY = height * (0.35 + w * 0.22);
        const waveAmp = (30 + w * 16) * (isMobile ? 0.6 : 1);
        const waveSpeed = 0.8 + w * 0.4;
        const waveFreq = 0.0022 + w * 0.001;

        ctx.moveTo(0, baseWaveY);
        for (let x = 0; x <= width; x += isMobile ? 25 : 15) {
          const y =
            baseWaveY +
            Math.sin(x * waveFreq + time * waveSpeed) * waveAmp +
            Math.cos(x * (waveFreq * 0.5) - time * 0.5) * (waveAmp * 0.45);
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle =
          w === 0
            ? 'rgba(0, 217, 255, 0.16)'
            : w === 1
            ? 'rgba(66, 99, 255, 0.14)'
            : 'rgba(168, 85, 247, 0.12)';
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Subtle gradient under-flow
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        const flowGrad = ctx.createLinearGradient(0, baseWaveY - waveAmp, 0, baseWaveY + waveAmp * 2);
        flowGrad.addColorStop(
          0,
          w === 0
            ? 'rgba(0, 217, 255, 0.035)'
            : w === 1
            ? 'rgba(66, 99, 255, 0.025)'
            : 'rgba(139, 92, 246, 0.02)'
        );
        flowGrad.addColorStop(1, 'rgba(16, 26, 59, 0)');
        ctx.fillStyle = flowGrad;
        ctx.fill();
        ctx.restore();
      }

      // --------------------------------------------------
      // E. VARIANT SPECIFIC PROCEDURAL ELEMENTS
      // --------------------------------------------------
      if (variant === 'home' || variant === 'login') {
        const orbX = width * 0.5;
        const orbY = height * (variant === 'login' ? 0.36 : 0.42);
        const orbR = Math.min(width, height) * 0.16;

        // Central Holographic Energy Core
        const coreGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbR * 1.6);
        coreGrad.addColorStop(0, 'rgba(0, 217, 255, 0.28)');
        coreGrad.addColorStop(0.35, 'rgba(66, 99, 255, 0.18)');
        coreGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.08)');
        coreGrad.addColorStop(1, 'rgba(16, 26, 59, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(orbX, orbY, orbR * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Holographic Gyroscope Orbit Rings
        for (let r = 0; r < 3; r++) {
          ctx.save();
          ctx.translate(orbX, orbY);
          const rotDir = r % 2 === 0 ? 1 : -1;
          ctx.rotate(time * (0.01 + r * 0.006) * rotDir);
          const curR = orbR * (0.8 + r * 0.42) + Math.sin(time + r) * 5;

          ctx.beginPath();
          ctx.ellipse(0, 0, curR, curR * 0.42, 0, 0, Math.PI * 2);
          ctx.strokeStyle =
            r === 0
              ? 'rgba(0, 217, 255, 0.36)'
              : r === 1
              ? 'rgba(66, 99, 255, 0.26)'
              : 'rgba(168, 85, 247, 0.22)';
          ctx.lineWidth = 1.3;
          ctx.setLineDash([12, 16]);
          ctx.stroke();

          // Luminous Satellite Node
          const satAngle = time * (0.65 + r * 0.3);
          const sx = Math.cos(satAngle) * curR;
          const sy = Math.sin(satAngle) * (curR * 0.42);

          const sSprite = spriteCache[r === 0 ? 'cyan' : r === 1 ? 'blue' : 'violet'];
          if (sSprite) {
            ctx.drawImage(sSprite, sx - 16, sy - 16, 32, 32);
          }
          ctx.restore();
        }
      }

      // --------------------------------------------------
      // F. UPDATE & RENDER MULTI-DEPTH PARTICLES & CONNECTIONS
      // --------------------------------------------------
      // Parallax scroll vertical offset based on depth
      const scrollFactor = scrollY * 0.15;

      // Update positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Kinetic motion scaled by depth (3D parallax)
        p.x += p.vx;
        p.y += p.vy;

        // Subtle organic sine turbulence
        p.x += Math.sin(time * 0.8 + p.orbitAngle) * (0.25 * p.z);
        p.y += Math.cos(time * 0.7 + p.orbitAngle) * (0.25 * p.z);

        // Screen boundary wrapping
        if (p.x < -30) p.x = width + 30;
        else if (p.x > width + 30) p.x = -30;

        if (p.y < -30) p.y = height + 30;
        else if (p.y > height + 30) p.y = -30;

        // Interactive mouse displacement (deflects nearby particles)
        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const distM = Math.hypot(dxM, dyM);
        const mouseRadius = isMobile ? 120 : 180;

        if (distM < mouseRadius && distM > 0) {
          const force = (mouseRadius - distM) / mouseRadius;
          const pushX = (dxM / distM) * force * 2.2 * p.z;
          const pushY = (dyM / distM) * force * 2.2 * p.z;
          p.x += pushX;
          p.y += pushY;
        }

        // Pulse calculation
        p.pulsePhase += p.pulseSpeed;
      }

      // Dynamic Synaptic Neural Connections
      // Only connect particles on similar depth planes (|z1 - z2| < 0.45)
      const connectionThreshold = isMobile ? 90 : 125;
      const connThresholdSq = connectionThreshold * connectionThreshold;

      ctx.save();
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Parallax Y position
        const p1DrawY = p1.y - (scrollFactor * p1.z) % (height + 60);
        const clampedP1Y = p1DrawY < 0 ? p1DrawY + height + 60 : p1DrawY;

        // Interactive mouse connection for near particles
        if (mouse.active && p1.z > 0.75) {
          const dMx = p1.x - mouse.x;
          const dMy = clampedP1Y - mouse.y;
          const dDistM = Math.hypot(dMx, dMy);
          if (dDistM < 160) {
            const alphaM = (1 - dDistM / 160) * 0.35 * p1.z;
            ctx.strokeStyle = `rgba(0, 217, 255, ${alphaM})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p1.x, clampedP1Y);
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];

          // Check depth compatibility for 3D realism
          if (Math.abs(p1.z - p2.z) > 0.42) continue;

          const p2DrawY = p2.y - (scrollFactor * p2.z) % (height + 60);
          const clampedP2Y = p2DrawY < 0 ? p2DrawY + height + 60 : p2DrawY;

          const dx = p2.x - p1.x;
          const dy = clampedP2Y - clampedP1Y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connThresholdSq) {
            const dist = Math.sqrt(distSq);
            const avgZ = (p1.z + p2.z) * 0.5;
            const alpha = (1 - dist / connectionThreshold) * 0.28 * avgZ;

            // Line stroke
            ctx.strokeStyle =
              p1.colorType === 'cyan' || p2.colorType === 'cyan'
                ? `rgba(0, 217, 255, ${alpha})`
                : `rgba(66, 99, 255, ${alpha})`;
            ctx.lineWidth = 0.9 * avgZ;
            ctx.beginPath();
            ctx.moveTo(p1.x, clampedP1Y);
            ctx.lineTo(p2.x, clampedP2Y);
            ctx.stroke();

            // Spawn synaptic pulses periodically
            if (pulses.length < maxPulses && Math.random() < 0.0035) {
              pulses.push({
                fromIdx: i,
                toIdx: j,
                progress: 0,
                speed: 0.015 + Math.random() * 0.02,
                color: p1.colorType === 'purple' || p2.colorType === 'purple' ? violet : cyan,
              });
            }
          }
        }
      }
      ctx.restore();

      // Render Synaptic Pulses (Energy Packets Traveling Across Links)
      for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
        const pulse = pulses[pIdx];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(pIdx, 1);
          continue;
        }

        const pA = particles[pulse.fromIdx];
        const pB = particles[pulse.toIdx];
        if (!pA || !pB) {
          pulses.splice(pIdx, 1);
          continue;
        }

        const pAY = (pA.y - (scrollFactor * pA.z) % (height + 60) + height + 60) % (height + 60);
        const pBY = (pB.y - (scrollFactor * pB.z) % (height + 60) + height + 60) % (height + 60);

        const curX = pA.x + (pB.x - pA.x) * pulse.progress;
        const curY = pAY + (pBY - pAY) * pulse.progress;
        const avgZ = (pA.z + pB.z) * 0.5;

        // Draw glowing packet using sprite
        const sprite = spriteCache[pulse.color === violet ? 'violet' : 'cyan'];
        const pSize = 16 * avgZ;
        if (sprite) {
          ctx.drawImage(sprite, curX - pSize * 0.5, curY - pSize * 0.5, pSize, pSize);
        }
      }

      // Draw All Particles with Depth Sorting
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const drawY = (p.y - (scrollFactor * p.z) % (height + 60) + height + 60) % (height + 60);

        // Radius with breathing pulse
        const radius = (p.baseRadius + Math.sin(p.pulsePhase) * 0.6) * p.z;
        const sprite = spriteCache[p.colorType];

        // Draw soft glow halo from sprite
        const glowSize = p.isHub ? 42 * p.z : 22 * p.z;
        if (sprite) {
          ctx.drawImage(sprite, p.x - glowSize * 0.5, drawY - glowSize * 0.5, glowSize, glowSize);
        }

        // Draw sharp inner core
        ctx.fillStyle =
          p.colorType === 'cyan'
            ? cyan
            : p.colorType === 'blue'
            ? blue
            : p.colorType === 'purple'
            ? purple
            : p.colorType === 'violet'
            ? violet
            : softWhite;

        ctx.beginPath();
        ctx.arc(p.x, drawY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [variant]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
