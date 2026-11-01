'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('utsav_theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('utsav_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('utsav_theme', 'light');
    }
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Bright Mode' : 'Switch to Cosmic Dark Mode'}
      className="p-2 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold
        border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-300 dark:border-white/15 dark:bg-white/[0.06] dark:hover:bg-white/10"
      title={isDark ? 'Switch to Bright Mode (Day Celebration)' : 'Switch to Dark Mode (Cosmic Night)'}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="hidden sm:inline">Bright Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-purple-600" />
          <span className="hidden sm:inline">Dark Mode</span>
        </>
      )}
    </button>
  );
};
