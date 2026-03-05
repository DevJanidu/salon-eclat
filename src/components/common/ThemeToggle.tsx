import React from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        "p-2 rounded-full transition-colors hover:bg-salon-gold/10 text-text-primary",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-salon-gold" />
      ) : (
        <Moon className="w-5 h-5 text-salon-gold" />
      )}
    </button>
  );
}
