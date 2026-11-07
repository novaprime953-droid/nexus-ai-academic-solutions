import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  maxTilt?: number;
  glowColor?: string;
}

export const CardTilt: React.FC<CardTiltProps> = ({
  children,
  className = '',
  onClick,
  maxTilt = 7,
  glowColor = 'rgba(0, 217, 255, 0.15)',
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, opacity: 0 });

  const springConfig = { damping: 20, stiffness: 260 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;

    // Inverted Y for natural 3D tilt
    rotateX.set(-normalizedY * maxTilt);
    rotateY.set(normalizedX * maxTilt);

    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseEnter = () => {
    scale.set(1.015);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    setGlowPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d',
        }}
        className={`relative h-full overflow-hidden transition-colors ${className}`}
      >
        {/* Dynamic cursor-following glow highlight */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: glowPos.opacity,
            background: `radial-gradient(circle 240px at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 75%)`,
          }}
        />

        {/* Card Content with 3D depth */}
        <div style={{ transform: 'translateZ(12px)' }} className="relative z-10 h-full flex flex-col justify-between">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
