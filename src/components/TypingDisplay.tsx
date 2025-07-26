
import React, { useMemo, useState, useEffect } from 'react';

interface TypingDisplayProps {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  userInput: string;
  typedWords?: string[]; // Track what user actually typed for each completed word
}

export const TypingDisplay: React.FC<TypingDisplayProps> = ({
  words,
  currentWordIndex,
  currentCharIndex,
  userInput,
  typedWords = []
}) => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const getCharLimit = () => {
    switch (screenSize) {
      case 'mobile': return 25;
      case 'tablet': return 45;
      case 'desktop': return 60;
      default: return 60;
    }
  };

  // Split words into lines based on character count
  const lines = useMemo(() => {
    const charLimit = getCharLimit();
    const result: string[][] = [];
    let currentLine: string[] = [];
    let currentLineLength = 0;

    for (const word of words) {
      const wordWithSpace = currentLine.length === 0 ? word : ` ${word}`;
      const wordLength = wordWithSpace.length;

      // If adding this word would exceed the limit, start a new line
      if (currentLineLength + wordLength > charLimit && currentLine.length > 0) {
        result.push([...currentLine]);
        currentLine = [word];
        currentLineLength = word.length;
      } else {
        currentLine.push(word);
        currentLineLength += wordLength;
      }
    }

    // Add the last line if it has words
    if (currentLine.length > 0) {
      result.push(currentLine);
    }

    return result;
  }, [words, screenSize]);

  // Calculate current line and position within line
  const currentLineIndex = useMemo(() => {
    let totalWords = 0;
    for (let i = 0; i < lines.length; i++) {
      if (totalWords + lines[i].length > currentWordIndex) {
        return i;
      }
      totalWords += lines[i].length;
    }
    return lines.length - 1;
  }, [lines, currentWordIndex]);

  const currentWordInLine = useMemo(() => {
    let totalWords = 0;
    for (let i = 0; i < currentLineIndex; i++) {
      totalWords += lines[i].length;
    }
    return currentWordIndex - totalWords;
  }, [lines, currentLineIndex, currentWordIndex]);

  // Calculate vertical offset to keep current line in middle section
  const offsetLines = Math.max(0, currentLineIndex - 1);

  const renderWord = (word: string, globalWordIndex: number, isInCurrentLine: boolean, wordIndexInLine: number) => {
    const isCurrentWord = globalWordIndex === currentWordIndex;
    
    if (isCurrentWord) {
      // Current word being typed - highlight background in middle section
      const hasCorrectChars = userInput.length > 0 && userInput.split('').some((char, i) => char === word[i]);
      const hasIncorrectChars = userInput.length > 0 && userInput.split('').some((char, i) => char !== word[i]);
      
      return (
        <span 
          key={globalWordIndex} 
          className={`relative px-1 ${isInCurrentLine ? 'bg-primary/10 rounded' : ''} ${
            hasCorrectChars && !hasIncorrectChars ? 'font-bold' : 
            hasIncorrectChars ? 'font-bold' : ''
          }`}
        >
          {word.split('').map((char, charIndex) => {
            let className = 'text-muted-foreground/60';
            
            if (charIndex < userInput.length) {
              className = userInput[charIndex] === char 
                ? 'text-foreground' 
                : 'text-red-500';
            } else if (charIndex === currentCharIndex) {
              className = 'text-muted-foreground/60 border-b border-primary';
            }
            
            return (
              <span key={charIndex} className={className}>
                {char}
              </span>
            );
          })}
        </span>
      );
    } else if (globalWordIndex < currentWordIndex) {
      // Completed words - preserve character-level error information
      const typedWord = typedWords[globalWordIndex] || '';
      return (
        <span key={globalWordIndex} className="font-bold">
          {word.split('').map((char, charIndex) => {
            const typedChar = typedWord[charIndex];
            const className = typedChar === char 
              ? 'text-muted-foreground/80' 
              : 'text-red-500';
            
            return (
              <span key={charIndex} className={className}>
                {char}
              </span>
            );
          })}
        </span>
      );
    } else {
      // Upcoming words
      return (
        <span key={globalWordIndex} className="text-muted-foreground/40">
          {word}
        </span>
      );
    }
  };

  const renderLine = (line: string[], lineIndex: number) => {
    const isCurrentLine = lineIndex === currentLineIndex;
    let startWordIndex = 0;
    
    // Calculate the starting word index for this line
    for (let i = 0; i < lineIndex; i++) {
      startWordIndex += lines[i].length;
    }
    
    return (
      <div 
        key={lineIndex} 
        className={`flex gap-3 min-h-[2rem] items-center transition-all duration-300 ${
          isCurrentLine ? 'opacity-100' : 'opacity-70'
        }`}
      >
        {line.map((word, wordIndexInLine) => {
          const globalWordIndex = startWordIndex + wordIndexInLine;
          return renderWord(word, globalWordIndex, isCurrentLine, wordIndexInLine);
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className="relative bg-background border border-border rounded-lg overflow-hidden"
        style={{ height: '40vh', minHeight: '300px' }}
      >
        {/* Three sections container */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top section (0-33%) - completed lines */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-hidden">
            <div className="h-full flex items-center">
              <div className="text-lg md:text-xl lg:text-2xl font-mono leading-relaxed w-full overflow-hidden">
                {currentLineIndex > 0 && lines[currentLineIndex - 1] && 
                  renderLine(lines[currentLineIndex - 1], currentLineIndex - 1)
                }
              </div>
            </div>
          </div>

          {/* Middle section (33-66%) - current line */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 bg-accent/5 border-y border-accent/20">
            <div className="h-full flex items-center">
              <div className="text-lg md:text-xl lg:text-2xl font-mono leading-relaxed w-full overflow-hidden">
                {lines[currentLineIndex] && renderLine(lines[currentLineIndex], currentLineIndex)}
              </div>
            </div>
          </div>

          {/* Bottom section (66-99%) - upcoming lines */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-hidden">
            <div className="h-full flex items-center">
              <div className="text-lg md:text-xl lg:text-2xl font-mono leading-relaxed w-full overflow-hidden">
                {lines[currentLineIndex + 1] && 
                  renderLine(lines[currentLineIndex + 1], currentLineIndex + 1)
                }
              </div>
            </div>
          </div>
        </div>

        {/* Visual indicators for sections */}
        <div className="absolute left-0 top-1/3 right-0 h-px bg-accent/20 pointer-events-none" />
        <div className="absolute left-0 top-2/3 right-0 h-px bg-accent/20 pointer-events-none" />
      </div>
    </div>
  );
};
