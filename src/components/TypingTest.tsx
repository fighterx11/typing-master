
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';
import { TypingDisplay } from './TypingDisplay';

// Common words for generating random text
const COMMON_WORDS = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'and', 'runs', 'under', 'bright', 'blue', 'sky', 'birds', 'sing', 'sweet', 'songs', 'echo', 'across', 'field', 'with', 'bloom', 'pretty', 'views', 'every', 'guest', 'visits', 'magic', 'place', 'filled', 'joy', 'happy', 'often', 'relax', 'enjoy', 'watch', 'cloud', 'drift', 'slow', 'quiet', 'breeze', 'light', 'shade', 'above', 'below', 'around', 'betwn', 'during', 'prior', 'after', 'always', 'never', 'somet', 'usual', 'often', 'rarely', 'daily', 'weekly', 'month', 'yearly', 'morn', 'noon', 'eve', 'night', 'today', 'tomo', 'yday', 'wkend', 'holid', 'travel', 'trip', 'trek', 'roam', 'quest', 'learn', 'study', 'read', 'write', 'speak', 'listen', 'think', 'dream', 'image', 'craft', 'build', 'make', 'design', 'plan', 'organ', 'manage', 'lead', 'trail', 'follow', 'help', 'support', 'assist', 'guide', 'teach', 'coach', 'mentor', 'inspi', 'motif', 'cheer', 'share', 'give', 'get', 'offer', 'serve', 'supply', 'deliver', 'present', 'show', 'prove', 'explain', 'detail', 'tell', 'say', 'talk', 'debate', 'discus', 'connect', 'relate', 'grasp', 'real', 'notice', 'watch', 'see', 'look', 'view', 'probe', 'search', 'audit', 'review', 'assess', 'measure', 'count', 'compute', 'guess', 'hope', 'wish', 'want', 'need', 'require', 'demand', 'ask', 'query', 'reply', 'react', 'act', 'perform', 'do', 'complete', 'finish', 'start', 'begin', 'open', 'close', 'shut', 'lock', 'unlok', 'secure', 'guard', 'cover', 'hide', 'reveal', 'expose', 'showy', 'print', 'share', 'spread', 'expand', 'grow', 'improve', 'boost', 'advance', 'carry', 'succeed', 'reach', 'attain', 'gain', 'obtain', 'acquire', 'earn', 'win', 'lose', 'fail', 'strive', 'fight', 'battle', 'compete', 'test', 'rival', 'defeat', 'error', 'issue', 'puzzle', 'riddle', 'secret', 'shock', 'wonder', 'curio', 'focus', 'aim', 'stead', 'power', 'might', 'force', 'stress', 'worry', 'fear', 'brave', 'faith', 'trust', 'belief', 'truth', 'value', 'right', 'wrong', 'legal', 'crime', 'civic', 'voter', 'party', 'taxes', 'budget', 'trade', 'union', 'peace', 'truce', 'patrol', 'watch', 'alarm', 'alert', 'danger', 'safety', 'shield', 'armor', 'sword', 'arrow', 'crown', 'throne', 'castle', 'tower', 'brick', 'steel', 'glass', 'cable', 'wheel', 'motor', 'brake', 'chain', 'lever', 'valve', 'meter', 'laser', 'radio', 'radar', 'phone', 'email', 'video', 'photo', 'pixel', 'image', 'file', 'drive', 'cloud', 'cache', 'input', 'output', 'array', 'queue', 'stack', 'debug', 'patch', 'merge', 'build', 'track', 'issue', 'token', 'nonce', 'cipher', 'hash', 'delta', 'gamma', 'theta', 'alpha', 'beta', 'omega', 'matrix', 'vector', 'tensor', 'scalar', 'angle', 'curve', 'shape', 'solid', 'plane', 'point', 'ratio', 'prime', 'proof', 'solve', 'limit', 'floor', 'round', 'cease', 'until', 'since', 'hence', 'thus', 'maybe', 'never', 'often', 'early', 'later', 'again', 'still', 'just', 'even', 'only', 'quite', 'very', 'truly', 'alone', 'nearby', 'beyond', 'within', 'above', 'below', 'around', 'north', 'south', 'east', 'west', 'left', 'right', 'upper', 'lower', 'front', 'back', 'inner', 'outer', 'near', 'far', 'close', 'distant', 'here', 'there', 'place', 'spot', 'area', 'region', 'zone', 'country', 'nation', 'state', 'city', 'town', 'village', 'locals', 'crowd', 'society', 'custom', 'habit', 'method', 'skill', 'goal', 'target', 'reason', 'cause', 'effect', 'result', 'outcome', 'choice', 'option', 'chance', 'story', 'novel', 'poems', 'music', 'movie', 'drama', 'actor', 'artist', 'painter', 'writer', 'poets', 'singer', 'dancer', 'player', 'coach', 'judge', 'nurse', 'doctor', 'pilot', 'chef', 'baker', 'farmer', 'miner', 'coder', 'maker', 'owner', 'buyer', 'seller', 'guest', 'host', 'child', 'adult', 'woman', 'human', 'group', 'team', 'union', 'pair', 'couple', 'family', 'buddy', 'friend', 'leader', 'member', 'agent', 'tour', 'user', 'admin', 'staff', 'guard', 'queen', 'king', 'prince', 'saint', 'angel', 'robot', 'alien', 'giant', 'dwarf', 'fairy', 'witch', 'ghost', 'zombie', 'beast', 'horse', 'camel', 'tiger', 'zebra', 'koala', 'panda', 'eagle', 'snake', 'shark', 'whale', 'otter', 'bison', 'sheep', 'goose', 'mouse', 'bunny', 'spider', 'insect', 'flora', 'fauna', 'tree', 'plant', 'leaf', 'grass', 'bush', 'moss', 'river', 'ocean', 'shore', 'beach', 'islet', 'desert', 'cabin', 'valley', 'canyon', 'plain', 'field', 'meadow', 'grove', 'swamp', 'cliff', 'caves', 'hills', 'ridge', 'mount', 'range', 'creek', 'glade', 'world', 'solar', 'lunar', 'space', 'orbit', 'stars', 'dawn', 'dusk', 'noisy', 'quiet', 'loud', 'soft', 'harsh', 'rough', 'smooth', 'silky', 'grain', 'sweet', 'salty', 'sour', 'bitter', 'spicy', 'fresh', 'stale', 'crisp', 'juicy', 'tasty', 'flair', 'aroma', 'scent', 'smell', 'taste', 'touch', 'sight', 'sound', 'sense', 'brain', 'heart', 'lungs', 'liver', 'nerve', 'muscle', 'bones', 'skull', 'blood', 'cells', 'logic', 'ethic', 'moral', 'truth', 'false', 'value', 'legal', 'civic', 'voter', 'party', 'taxes', 'budget', 'treat', 'guard', 'watch', 'alert', 'danger', 'safety', 'shield', 'sword', 'arrow', 'crown', 'tower', 'brick', 'steel', 'glass', 'cable', 'wheel', 'motor', 'brake', 'chain', 'lever', 'valve', 'meter', 'laser', 'radio', 'radar', 'phone', 'email', 'video', 'photo', 'pixel', 'image', 'drive', 'cloud', 'cache', 'input', 'output', 'array', 'queue', 'stack', 'debug', 'patch', 'merge', 'track', 'token', 'nonce', 'cipher', 'hash', 'delta', 'gamma', 'theta', 'alpha', 'beta', 'omega', 'angle', 'curve', 'shape', 'solid', 'plane', 'point', 'ratio', 'prime', 'proof', 'solve', 'limit', 'floor', 'round', 'cease', 'since', 'hence', 'thus', 'maybe', 'again', 'still', 'quite', 'truly', 'alone', 'nearby', 'beyond', 'within', 'above', 'below', 'north', 'south', 'east', 'west'
];

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