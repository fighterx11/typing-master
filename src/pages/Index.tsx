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
      <footer className="border-t border-border bg-card/30 mt-8 sm:mt-16">
        <div className="container max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;