import { useState, useEffect, useRef, useCallback } from 'react';
import { TestResults } from '@/components/TypingTest';

const COMMON_WORDS = [
  'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'and', 'runs', 'under', 'bright', 'blue', 'sky', 'birds', 'sing', 'sweet', 'songs', 'echo', 'across', 'field', 'with', 'bloom', 'pretty', 'views', 'every', 'guest', 'visits', 'magic', 'place', 'filled', 'joy', 'happy', 'often', 'relax', 'enjoy', 'watch', 'cloud', 'drift', 'slow', 'quiet', 'breeze', 'light', 'shade', 'above', 'below', 'around', 'betwn', 'during', 'prior', 'after', 'always', 'never', 'somet', 'usual', 'often', 'rarely', 'daily', 'weekly', 'month', 'yearly', 'morn', 'noon', 'eve', 'night', 'today', 'tomo', 'yday', 'wkend', 'holid', 'travel', 'trip', 'trek', 'roam', 'quest', 'learn', 'study', 'read', 'write', 'speak', 'listen', 'think', 'dream', 'image', 'craft', 'build', 'make', 'design', 'plan', 'organ', 'manage', 'lead', 'trail', 'follow', 'help', 'support', 'assist', 'guide', 'teach', 'coach', 'mentor', 'inspi', 'motif', 'cheer', 'share', 'give', 'get', 'offer', 'serve', 'supply', 'deliver', 'present', 'show', 'prove', 'explain', 'detail', 'tell', 'say', 'talk', 'debate', 'discus', 'connect', 'relate', 'grasp', 'real', 'notice', 'watch', 'see', 'look', 'view', 'probe', 'search', 'audit', 'review', 'assess', 'measure', 'count', 'compute', 'guess', 'hope', 'wish', 'want', 'need', 'require', 'demand', 'ask', 'query', 'reply', 'react', 'act', 'perform', 'do', 'complete', 'finish', 'start', 'begin', 'open', 'close', 'shut', 'lock', 'unlok', 'secure', 'guard', 'cover', 'hide', 'reveal', 'expose', 'showy', 'print', 'share', 'spread', 'expand', 'grow', 'improve', 'boost', 'advance', 'carry', 'succeed', 'reach', 'attain', 'gain', 'obtain', 'acquire', 'earn', 'win', 'lose', 'fail', 'strive', 'fight', 'battle', 'compete', 'test', 'rival', 'defeat', 'error', 'issue', 'puzzle', 'riddle', 'secret', 'shock', 'wonder', 'curio', 'focus', 'aim', 'stead', 'power', 'might', 'force', 'stress', 'worry', 'fear', 'brave', 'faith', 'trust', 'belief', 'truth', 'value', 'right', 'wrong', 'legal', 'crime', 'civic', 'voter', 'party', 'taxes', 'budget', 'trade', 'union', 'peace', 'truce', 'patrol', 'watch', 'alarm', 'alert', 'danger', 'safety', 'shield', 'armor', 'sword', 'arrow', 'crown', 'throne', 'castle', 'tower', 'brick', 'steel', 'glass', 'cable', 'wheel', 'motor', 'brake', 'chain', 'lever', 'valve', 'meter', 'laser', 'radio', 'radar', 'phone', 'email', 'video', 'photo', 'pixel', 'image', 'file', 'drive', 'cloud', 'cache', 'input', 'output', 'array', 'queue', 'stack', 'debug', 'patch', 'merge', 'build', 'track', 'issue', 'token', 'nonce', 'cipher', 'hash', 'delta', 'gamma', 'theta', 'alpha', 'beta', 'omega', 'matrix', 'vector', 'tensor', 'scalar', 'angle', 'curve', 'shape', 'solid', 'plane', 'point', 'ratio', 'prime', 'proof', 'solve', 'limit', 'floor', 'round', 'cease', 'until', 'since', 'hence', 'thus', 'maybe', 'never', 'often', 'early', 'later', 'again', 'still', 'just', 'even', 'only', 'quite', 'very', 'truly', 'alone', 'nearby', 'beyond', 'within', 'above', 'below', 'around', 'north', 'south', 'east', 'west', 'left', 'right', 'upper', 'lower', 'front', 'back', 'inner', 'outer', 'near', 'far', 'close', 'distant', 'here', 'there', 'place', 'spot', 'area', 'region', 'zone', 'country', 'nation', 'state', 'city', 'town', 'village', 'locals', 'crowd', 'society', 'custom', 'habit', 'method', 'skill', 'goal', 'target', 'reason', 'cause', 'effect', 'result', 'outcome', 'choice', 'option', 'chance', 'story', 'novel', 'poems', 'music', 'movie', 'drama', 'actor', 'artist', 'painter', 'writer', 'poets', 'singer', 'dancer', 'player', 'coach', 'judge', 'nurse', 'doctor', 'pilot', 'chef', 'baker', 'farmer', 'miner', 'coder', 'maker', 'owner', 'buyer', 'seller', 'guest', 'host', 'child', 'adult', 'woman', 'human', 'group', 'team', 'union', 'pair', 'couple', 'family', 'buddy', 'friend', 'leader', 'member', 'agent', 'tour', 'user', 'admin', 'staff', 'guard', 'queen', 'king', 'prince', 'saint', 'angel', 'robot', 'alien', 'giant', 'dwarf', 'fairy', 'witch', 'ghost', 'zombie', 'beast', 'horse', 'camel', 'tiger', 'zebra', 'koala', 'panda', 'eagle', 'snake', 'shark', 'whale', 'otter', 'bison', 'sheep', 'goose', 'mouse', 'bunny', 'spider', 'insect', 'flora', 'fauna', 'tree', 'plant', 'leaf', 'grass', 'bush', 'moss', 'river', 'ocean', 'shore', 'beach', 'islet', 'desert', 'cabin', 'valley', 'canyon', 'plain', 'field', 'meadow', 'grove', 'swamp', 'cliff', 'caves', 'hills', 'ridge', 'mount', 'range', 'creek', 'glade', 'world', 'solar', 'lunar', 'space', 'orbit', 'stars', 'dawn', 'dusk'
];

export interface UseTypingTestReturn {
  timeLimit: number;
  timeRemaining: number;
  isActive: boolean;
  hasStarted: boolean;
  currentWordIndex: number;
  currentCharIndex: number;
  userInput: string;
  words: string[];
  typedWords: string[];
  setTimeLimit: (limit: number) => void;
  startTest: () => void;
  resetTest: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const useTypingTest = (onComplete: (results: TestResults) => void): UseTypingTestReturn => {
  const [timeLimit, setTimeLimitState] = useState<number>(30);
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [words, setWords] = useState<string[]>([]);
  const [totalChars, setTotalChars] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
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

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (hasStarted && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            setIsActive(false);

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
    setTotalChars(0);
    setCorrectChars(0);
    setTypedWords([]);
    const newWords = generateWords();
    setWords(newWords);
    inputRef.current?.focus();
  }, [timeLimit, generateWords]);

  const setTimeLimit = useCallback((newLimit: number) => {
    setTimeLimitState(newLimit);
    if (!hasStarted) {
      setTimeRemaining(newLimit);
    }
  }, [hasStarted]);

  // Handle input change for mobile
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.innerWidth > 768) return;

    const value = e.target.value;
    if (!value) return;

    const lastChar = value[value.length - 1];
    if (!lastChar) return;

    if (!hasStarted) {
      startTest();
    }

    const now = Date.now();
    if (lastKeystrokeRef.current > 0) {
      lastKeystrokeRef.current = now;
    }

    if (currentWordIndex >= words.length - 100) {
      generateMoreWords();
    }

    if (lastChar !== ' ') {
      const newInput = userInput + lastChar;
      setUserInput(newInput);
      setCurrentCharIndex(prev => prev + 1);
      setTotalChars(prev => prev + 1);

      const currentWord = words[currentWordIndex];
      if (currentWord && currentCharIndex < currentWord.length && lastChar === currentWord[currentCharIndex]) {
        setCorrectChars(prev => prev + 1);
      }
    } else {
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
      lastKeystrokeRef.current = now;
    }

    if (currentWordIndex >= words.length - 100) {
      generateMoreWords();
    }

    if (e.key === ' ') {
      e.preventDefault();
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
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentCharIndex === 0 && currentWordIndex > 0) {
        setTypedWords(prev => {
          const newTypedWords = [...prev];
          newTypedWords[currentWordIndex] = userInput;
          return newTypedWords;
        });
        const newWordIndex = currentWordIndex - 1;
        setCurrentWordIndex(newWordIndex);
        setCurrentCharIndex(words[newWordIndex]?.length || 0);
        setUserInput(typedWords[newWordIndex] || '');
      } else if (currentCharIndex > 0) {
        setCurrentCharIndex(prev => prev - 1);
        setUserInput(prev => prev.slice(0, -1));
      }
    } else if (e.key.length === 1) {
      const newInput = userInput + e.key;
      setUserInput(newInput);
      setCurrentCharIndex(prev => prev + 1);
      setTotalChars(prev => prev + 1);

      const currentWord = words[currentWordIndex];
      if (currentWord && currentCharIndex < currentWord.length && e.key === currentWord[currentCharIndex]) {
        setCorrectChars(prev => prev + 1);
      }
    }
  }, [hasStarted, startTest, currentWordIndex, currentCharIndex, userInput, words, generateMoreWords, typedWords]);

  return {
    timeLimit,
    timeRemaining,
    isActive,
    hasStarted,
    currentWordIndex,
    currentCharIndex,
    userInput,
    words,
    typedWords,
    setTimeLimit,
    startTest,
    resetTest,
    handleKeyPress,
    handleInputChange,
    inputRef,
  };
};