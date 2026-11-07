import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ThreeDIconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  gradient?: string;
  className?: string;
}

export const ThreeDIcon: React.FC<ThreeDIconProps> = ({
  icon: Icon,
  size = 24,
  color = 'text-cyan-400',
  gradient = 'from-blue-600/30 via-indigo-600/30 to-cyan-400/30',
  className = '',
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotateY: 10, rotateX: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative p-3.5 rounded-2xl bg-gradient-to-br ${gradient} border border-cyan-400/30 shadow-lg shadow-blue-500/20 backdrop-blur-xl flex items-center justify-center ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-50 pointer-events-none" />
      <Icon className={`w-${Math.round(size / 4)} h-${Math.round(size / 4)} ${color} relative z-10 drop-shadow-[0_2px_8px_rgba(0,217,255,0.4)]`} />
    </motion.div>
  );
};
