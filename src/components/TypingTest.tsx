
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RotateCcw } from 'lucide-react';
import { TypingDisplay } from './TypingDisplay';
import { useTypingTest } from '@/hooks/useTypingTest';

interface TypingTestProps {
  onComplete: (results: TestResults) => void;
}

export interface TestResults {
  wpm: number;
  accuracy: number;
  duration: number;
  totalChars: number;
  correctChars: number;
  timestamp: Date;
}

export const TypingTest: React.FC<TypingTestProps> = ({ onComplete }) => {
  const {
    timeLimit,
    timeRemaining,
    hasStarted,
    currentWordIndex,
    currentCharIndex,
    userInput,
    words,
    typedWords,
    setTimeLimit,
    resetTest,
    handleKeyPress,
    handleInputChange,
    inputRef,
  } = useTypingTest(onComplete);

  const handleTimeLimitChange = (value: string) => {
    const newLimit = parseInt(value);
    setTimeLimit(newLimit);
  };

  // Determine if device is mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={timeLimit.toString()} onValueChange={handleTimeLimitChange} disabled={hasStarted}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
              <SelectItem value="120">120 seconds</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-2xl font-bold text-primary">
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <Button
          onClick={resetTest}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RotateCcw size={16} />
          Reset
        </Button>
      </div>

      {/* Typing Area */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text relative"
      >
        <TypingDisplay
          words={words}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
          userInput={userInput}
          typedWords={typedWords}
        />

        {/* Input field for both desktop and mobile */}
        <input
          ref={inputRef}
          className="absolute opacity-0 pointer-events-none focus:outline-none"
          onKeyDown={handleKeyPress}
          onChange={handleInputChange}
          autoFocus={!isMobile}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={timeRemaining === 0}
          inputMode="text"
          style={{
            width: '1px',
            height: '1px',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            color: 'transparent',
            overflow: 'hidden',
            left: 0,
            top: 0,
          }}
        />
      </div>

      {/* Instructions */}
      {!hasStarted && (
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-muted-foreground/60">
            <Play size={14} className="sm:size-4" />
            <span className="hidden sm:inline text-sm">Start typing to begin the test</span>
            <span className="sm:hidden text-xs">Tap above to start typing</span>
          </p>
        </div>
      )}
    </div>
  );
};