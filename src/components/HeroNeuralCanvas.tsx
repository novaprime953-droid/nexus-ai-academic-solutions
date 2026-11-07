import React, { useEffect, useRef } from 'react';

interface HeroNeuralCanvasProps {
  className?: string;
}

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  color: string;
  pulsePhase: number;
}

export const HeroNeuralCanvas: React.FC<HeroNeuralCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Color definitions
    const colors = ['#4361FF', '#8B5CF6', '#00D9FF'];

    // Mouse tracking
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovered: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = width / 2;
      mouse.targetY = height / 2;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Generate Nodes
    const nodeCount = Math.min(Math.floor((width * height) / 14000), 75);
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const baseRadius = Math.random() * 2 + 1.5;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        baseRadius,
        radius: baseRadius,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // Deep dark ambient background gradient
      const bgGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      bgGrad.addColorStop(0, 'rgba(15, 23, 62, 0.45)');
      bgGrad.addColorStop(0.5, 'rgba(8, 11, 24, 0.25)');
      bgGrad.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw Central AI Energy Orb (holographic core)
      const centerX = width * 0.5;
      const centerY = height * 0.48;

      // Central Orb ambient glow
      const orbRadius = Math.min(width, height) * 0.16;
      const orbGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        orbRadius * 1.8
      );
      orbGrad.addColorStop(0, 'rgba(0, 217, 255, 0.22)');
      orbGrad.addColorStop(0.3, 'rgba(67, 97, 255, 0.18)');
      orbGrad.addColorStop(0.7, 'rgba(139, 92, 246, 0.08)');
      orbGrad.addColorStop(1, 'rgba(5, 8, 22, 0)');

      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Holographic Rings
      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        const rotationSpeed = (r % 2 === 0 ? 1 : -1) * (0.008 + r * 0.004);
        ctx.rotate(time * rotationSpeed);

        const currentRingRadius = orbRadius * (0.8 + r * 0.35) + Math.sin(time + r) * 4;
        ctx.beginPath();
        // Elliptical perspective
        ctx.ellipse(0, 0, currentRingRadius, currentRingRadius * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = r === 0 ? 'rgba(0, 217, 255, 0.35)' : r === 1 ? 'rgba(67, 97, 255, 0.25)' : 'rgba(139, 92, 246, 0.2)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 12]);
        ctx.stroke();

        // Orb Ring Satellite Nodes
        const satAngle = time * (0.6 + r * 0.3);
        const satX = Math.cos(satAngle) * currentRingRadius;
        const satY = Math.sin(satAngle) * (currentRingRadius * 0.5);

        ctx.fillStyle = '#00D9FF';
        ctx.shadowColor = '#00D9FF';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update and Draw Interconnected Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Move
        node.x += node.vx;
        node.y += node.vy;

        // Bounce on boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse Gravitation / Repulsion
        const dxMouse = mouse.x - node.x;
        const dyMouse = mouse.y - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 180) {
          const force = (180 - distMouse) / 180;
          node.x -= (dxMouse / distMouse) * force * 1.5;
          node.y -= (dyMouse / distMouse) * force * 1.5;
        }

        // Pulse
        node.pulsePhase += 0.03;
        node.radius = node.baseRadius + Math.sin(node.pulsePhase) * 0.8;

        // Connect to nearest nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.28;
            ctx.strokeStyle = `rgba(67, 97, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Energy Pulse traversing links periodically
            if ((i + j) % 7 === 0 && Math.sin(time * 2 + i) > 0.7) {
              const pulsePos = (Math.sin(time * 3 + j) + 1) / 2;
              const px = node.x + dx * pulsePos;
              const py = node.y + dy * pulsePos;
              ctx.fillStyle = '#00D9FF';
              ctx.shadowColor = '#00D9FF';
              ctx.shadowBlur = 6;
              ctx.beginPath();
              ctx.arc(px, py, 1.6, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }

        // Draw Node Point
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-auto ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};
