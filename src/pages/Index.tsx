import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TypingTest, TestResults } from '@/components/TypingTest';
import { Results } from '@/components/Results';
import { Progress } from '@/components/Progress';
import { saveTestResult, getTestResults, clearTestResults } from '@/utils/storage';
import { Keyboard, TrendingUp, Trophy } from 'lucide-react';
import { toast } from '@/lib/hooks/use-toast';

type AppState = 'test' | 'results' | 'progress';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('test');
  const [currentResults, setCurrentResults] = useState<TestResults | null>(null);
  const [savedResults, setSavedResults] = useState<TestResults[]>([]);
  const [isResultSaved, setIsResultSaved] = useState<boolean>(false);

  // Load saved results on component mount
  useEffect(() => {
    setSavedResults(getTestResults());
  }, []);

  const handleTestComplete = (results: TestResults) => {
    setCurrentResults(results);
    setCurrentState('results');
    setIsResultSaved(false); // Reset save status for new result
  };

  const handleRetakeTest = () => {
    setCurrentResults(null);
    setCurrentState('test');
    setIsResultSaved(false); // Reset save status when retaking test
  };

  const handleSaveResults = () => {
    if (currentResults && !isResultSaved) {
      saveTestResult(currentResults);
      setSavedResults(getTestResults());
      setIsResultSaved(true);
      toast({
        title: "Results Saved!",
        description: "Your test results have been saved to track your progress.",
      });
    }
  };

  const handleViewProgress = () => {
    setCurrentState('progress');
  };

  const handleClearData = () => {
    clearTestResults();
    setSavedResults([]);
    toast({
      title: "Data Cleared",
      description: "All saved test results have been removed.",
    });
  };

  const handleBackToTest = () => {
    setCurrentState('test');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container max-w-6xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Keyboard className="h-4 w-4 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">TypeSpeed</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Master your typing skills</p>
              </div>
            </div>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Button
                variant={currentState === 'test' ? 'default' : 'ghost'}
                onClick={handleBackToTest}
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                Test
              </Button>
              <Button
                variant={currentState === 'progress' ? 'default' : 'ghost'}
                onClick={handleViewProgress}
                size="sm"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <TrendingUp size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Progress</span>
                <span className="sm:hidden">Stats</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {currentState === 'test' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            {savedResults.length > 0 && (
              <div className="flex flex-row gap-2 md:grid md:grid-cols-3 md:gap-4 max-w-2xl mx-auto">
                <Card className="stat-card flex-1 p-3 sm:p-6 text-xs sm:text-base">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl font-bold text-primary">
                    {Math.max(...savedResults.map(r => r.wpm))}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Best WPM</div>
                </Card>
                <Card className="stat-card flex-1 p-3 sm:p-6 text-xs sm:text-base">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl font-bold text-accent">
                    {Math.round(savedResults.reduce((sum, r) => sum + r.wpm, 0) / savedResults.length)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Average WPM</div>
                </Card>
                <Card className="stat-card flex-1 p-3 sm:p-6 text-xs sm:text-base">
                  <Keyboard className="h-5 w-5 sm:h-6 sm:w-6 text-success mx-auto mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl font-bold text-success">
                    {savedResults.length}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Tests Taken</div>
                </Card>
              </div>
            )}

            {/* Typing Test */}
            <TypingTest onComplete={handleTestComplete} />
          </div>
        )}

        {currentState === 'results' && currentResults && (
          <Results
            results={currentResults}
            previousResults={savedResults}
            onRetakeTest={handleRetakeTest}
            onSaveResults={handleSaveResults}
            isResultSaved={isResultSaved}
          />
        )}

        {currentState === 'progress' && (
          <Progress
            results={savedResults}
            onClearData={handleClearData}
            onBackToTest={handleBackToTest}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm mt-8 sm:mt-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            {/* Links */}
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/fighterx11/typing-master"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 group cursor-pointer"
              >
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-sm font-medium">View Source</span>
              </a>
            </div>

            {/* Tech Stack */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground/80">Built with</p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-background/50 rounded-md border">React</span>
                <span className="px-2 py-1 bg-background/50 rounded-md border">TypeScript</span>
                <span className="px-2 py-1 bg-background/50 rounded-md border">Tailwind CSS</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t border-border/50 w-full">
              <p className="text-xs text-muted-foreground/60 text-center">
                © {new Date().getFullYear()} Crafted with ❤️ for typing enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;