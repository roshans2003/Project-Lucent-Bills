import React from 'react';

interface LiquidBackgroundProps {
  variant?: 'ocean' | 'aurora' | 'crystal' | 'dusk';
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ variant = 'ocean' }) => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-[#f6f8fc]">
      {/* Subtle fine optical grid giving refraction texture */}
      <div 
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: 'radial-gradient(rgba(100, 116, 139, 0.16) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Organic Liquid Orb 1 (Top Left / Indigo Sky) */}
      <div
        className="animate-liquid-1 absolute -top-24 -left-20 w-[550px] h-[550px] rounded-full filter blur-[85px] opacity-70 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.38) 0%, rgba(99, 102, 241, 0.32) 50%, rgba(56, 189, 248, 0) 75%)',
        }}
      />

      {/* Floating Organic Liquid Orb 2 (Top Right / Emerald Teal) */}
      <div
        className="animate-liquid-2 absolute top-1/4 -right-24 w-[600px] h-[600px] rounded-full filter blur-[90px] opacity-65 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(52, 211, 153, 0.30) 0%, rgba(14, 165, 233, 0.25) 50%, rgba(16, 185, 129, 0) 75%)',
        }}
      />

      {/* Floating Organic Liquid Orb 3 (Center Bottom / Violet Frost) */}
      <div
        className="animate-liquid-3 absolute -bottom-32 left-1/3 w-[650px] h-[650px] rounded-full filter blur-[100px] opacity-60 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.24) 0%, rgba(99, 102, 241, 0.28) 45%, rgba(168, 85, 247, 0) 75%)',
        }}
      />

      {/* Floating Organic Liquid Orb 4 (Mid Left / Warm Refraction Sheen) */}
      <div
        className="animate-liquid-1 absolute top-2/3 -left-32 w-[450px] h-[450px] rounded-full filter blur-[80px] opacity-50 mix-blend-multiply"
        style={{
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(244, 114, 182, 0.18) 50%, rgba(251, 191, 36, 0) 75%)',
        }}
      />

      {/* Specular Liquid Surface Top Vignette */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
    </div>
  );
};
