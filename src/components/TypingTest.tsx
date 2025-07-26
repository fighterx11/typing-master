
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';
import { TypingDisplay } from './TypingDisplay';

// Common words for generating random text
const COMMON_WORDS = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'and', 'runs', 'through', 'forest',
  'where', 'many', 'animals', 'live', 'peacefully', 'together', 'under', 'bright', 'blue', 'sky',
  'while', 'birds', 'sing', 'beautiful', 'songs', 'that', 'echo', 'across', 'the', 'meadow',
  'with', 'flowers', 'blooming', 'everywhere', 'creating', 'wonderful', 'landscape', 'for', 'everyone',
  'who', 'visits', 'this', 'magical', 'place', 'filled', 'with', 'joy', 'and', 'happiness',
  'people', 'often', 'come', 'here', 'to', 'relax', 'and', 'enjoy', 'nature', 'beauty',
  'watching', 'clouds', 'drift', 'slowly', 'across', 'endless', 'horizon', 'while', 'listening',
  'to', 'gentle', 'sound', 'of', 'wind', 'rustling', 'through', 'leaves', 'above'
];

interface TypingTestProps {
  onComplete: (results: TestResults) => void;
}

export interface TestResults {
  wpm: number;
  accuracy: number;
  consistency: number;
  duration: number;
  totalChars: number;
  correctChars: number;
  timestamp: Date;
}

export const TypingTest: React.FC<TypingTestProps> = ({ onComplete }) => {

  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [keystrokeTimes, setKeystrokeTimes] = useState<number[]>([]);
  const [totalChars, setTotalChars] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const lastKeystrokeRef = useRef<number>(0);
  const correctCharsRef = useRef<number>(0);
  const totalCharsRef = useRef<number>(0);

  // Update refs when state changes
  useEffect(() => {
    correctCharsRef.current = correctChars;
  }, [correctChars]);

  useEffect(() => {
    totalCharsRef.current = totalChars;
  }, [totalChars]);

  // Generate random words
  const generateWords = useCallback((count: number = 1000) => {
    const generated = [];
    for (let i = 0; i < count; i++) {
      generated.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
    }
    return generated;
  }, []);

  // Generate more words when needed
  const generateMoreWords = useCallback(() => {
    const newWords = generateWords(500);
    setWords(prev => [...prev, ...newWords]);
  }, [generateWords]);

  // Initialize words on component mount
  useEffect(() => {
    const initialWords = generateWords();
    setWords(initialWords);
  }, [generateWords]);

  // Timer effect - runs independently once started
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (hasStarted && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            // Handle test completion
            setIsActive(false);

            // Calculate results using ref values to avoid dependency issues
            const actualDuration = timeLimit;
            const wpm = Math.round((correctCharsRef.current / 5) / (actualDuration / 60));
            const accuracy = totalCharsRef.current > 0 ? Math.round((correctCharsRef.current / totalCharsRef.current) * 100) : 0;

            const results: TestResults = {
              wpm,
              accuracy,
              consistency: 0, // Not used anymore
              duration: actualDuration,
              totalChars: totalCharsRef.current,
              correctChars: correctCharsRef.current,
              timestamp: new Date()
            };

            onComplete(results);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [hasStarted, timeRemaining, timeLimit, onComplete]);

  const startTest = useCallback(() => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsActive(true);
      lastKeystrokeRef.current = Date.now();
    }
  }, [hasStarted]);

  const resetTest = useCallback(() => {
    setIsActive(false);
    setHasStarted(false);
    setTimeRemaining(timeLimit);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setUserInput('');
    setKeystrokeTimes([]);
    setTotalChars(0);
    setCorrectChars(0);
    setTypedWords([]);
    const newWords = generateWords();
    setWords(newWords);
    inputRef.current?.focus();
  }, [timeLimit, generateWords]);

  // Handle input change for mobile compatibility only
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent double processing - only handle on mobile and prevent event bubbling
    e.preventDefault();
    e.stopPropagation();

    // Only handle mobile input, desktop uses keydown
    if (window.innerWidth > 768) return;

    const value = e.target.value;
    if (!value) return; // Ignore empty values

    const lastChar = value[value.length - 1];
    if (!lastChar) return; // Ignore if no character

    if (!hasStarted) {
      startTest();
    }

    const now = Date.now();
    if (lastKeystrokeRef.current > 0) {
      setKeystrokeTimes(prev => [...prev, now]);
    }
    lastKeystrokeRef.current = now;

    // Check if we need more words
    if (currentWordIndex >= words.length - 100) {
      generateMoreWords();
    }

    // Handle character input
    if (lastChar !== ' ') {
      const newInput = userInput + lastChar;
      setUserInput(newInput);
      setCurrentCharIndex(prev => prev + 1);
      setTotalChars(prev => prev + 1);

      // Check if character is correct
      const currentWord = words[currentWordIndex];
      if (currentWord && currentCharIndex < currentWord.length && lastChar === currentWord[currentCharIndex]) {
        setCorrectChars(prev => prev + 1);
      }
    } else {
      // Handle space on mobile
      setTypedWords(prev => {
        const newTypedWords = [...prev];
        newTypedWords[currentWordIndex] = userInput;
        return newTypedWords;
      });
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setUserInput('');
      }
    }

    // Clear the input field to prevent accumulation
    setTimeout(() => {
      if (e.target) e.target.value = '';
    }, 0);
  }, [hasStarted, startTest, currentWordIndex, currentCharIndex, userInput, words, generateMoreWords]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasStarted) {
      startTest();
    }

    const now = Date.now();
    if (lastKeystrokeRef.current > 0) {
      setKeystrokeTimes(prev => [...prev, now]);
    }
    lastKeystrokeRef.current = now;

    // Check if we need more words
    if (currentWordIndex >= words.length - 100) {
      generateMoreWords();
    }

    if (e.key === ' ') {
      e.preventDefault();
      // Save what was typed for the current word
      setTypedWords(prev => {
        const newTypedWords = [...prev];
        newTypedWords[currentWordIndex] = userInput;
        return newTypedWords;
      });
      // Move to next word on spacebar
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentCharIndex(0);
        setUserInput('');
      }
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentCharIndex === 0 && currentWordIndex > 0) {
        // Save current word before moving back
        setTypedWords(prev => {
          const newTypedWords = [...prev];
          newTypedWords[currentWordIndex] = userInput;
          return newTypedWords;
        });
        // Move to previous word
        const newWordIndex = currentWordIndex - 1;
        setCurrentWordIndex(newWordIndex);
        setCurrentCharIndex(words[newWordIndex]?.length || 0);
        setUserInput(typedWords[newWordIndex] || '');
      } else if (currentCharIndex > 0) {
        // Delete character within current word
        setCurrentCharIndex(prev => prev - 1);
        setUserInput(prev => prev.slice(0, -1));
      }
    } else if (e.key.length === 1) {
      // Regular character input
      const newInput = userInput + e.key;
      setUserInput(newInput);
      setCurrentCharIndex(prev => prev + 1);
      setTotalChars(prev => prev + 1);

      // Check if character is correct
      const currentWord = words[currentWordIndex];
      if (currentWord && currentCharIndex < currentWord.length && e.key === currentWord[currentCharIndex]) {
        setCorrectChars(prev => prev + 1);
      }
    }
  }, [hasStarted, startTest, currentWordIndex, currentCharIndex, userInput, words, generateMoreWords, typedWords]);

  // Handle time limit change
  const handleTimeLimitChange = (value: string) => {
    const newLimit = parseInt(value);
    setTimeLimit(newLimit);
    if (!hasStarted) {
      setTimeRemaining(newLimit);
    }
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

      {/* Mobile Instructions */}
      {!hasStarted && (
        <div className="text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Play size={16} />
            <span className="hidden sm:inline">Start typing to begin the test</span>
            <span className="sm:hidden">Tap above and start typing to begin</span>
          </p>
        </div>
      )}
    </div>
  );
};
