'use client';

import { Sparkles } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-aura-mint-light via-aura-cream to-aura-lavender-light flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <div className="relative">
        <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-aura-mint via-aura-peach to-aura-lavender flex items-center justify-center shadow-2xl animated-gradient">
          <Sparkles size={48} className="text-white" />
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 h-24 w-24 rounded-3xl bg-gradient-to-br from-aura-mint via-aura-peach to-aura-lavender blur-xl opacity-50 -z-10" />
      </div>

      {/* Brand name */}
      <h1 className="mt-8 text-3xl font-bold bg-gradient-to-r from-aura-mint-dark via-aura-slate to-aura-lavender-dark bg-clip-text text-transparent">
        AuraSync
      </h1>
      <p className="mt-2 text-aura-slate/60 text-sm">
        Твой путь к балансу
      </p>

      {/* Loading indicator */}
      <div className="mt-12 flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-aura-mint animate-pulse"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
