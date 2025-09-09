import React from 'react';
import { Button } from '@/components/ui/button';
import { Keyboard, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

type AppState = 'test' | 'results' | 'progress';

interface HeaderProps {
  currentState: AppState;
  onBackToTest: () => void;
  onViewProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentState,
  onBackToTest,
  onViewProgress,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <Keyboard className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">TypeSpeed</h1>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant={currentState === 'test' ? 'default' : 'ghost'}
              onClick={onBackToTest}
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Test
            </Button>
            <Button
              variant={currentState === 'progress' ? 'default' : 'ghost'}
              onClick={onViewProgress}
              size="sm"
              className="h-8 px-2"
            >
              <TrendingUp size={16} />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/25">
              <Keyboard className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                TypeSpeed
              </h1>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant={currentState === 'test' ? 'default' : 'ghost'}
              onClick={onBackToTest}
              size="sm"
              className="text-sm px-4 h-9 font-medium"
            >
              Test
            </Button>
            <Button
              variant={currentState === 'progress' ? 'default' : 'ghost'}
              onClick={onViewProgress}
              size="sm"
              className="gap-2 text-sm px-4 h-9 font-medium"
            >
              <TrendingUp size={16} />
              Progress
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};