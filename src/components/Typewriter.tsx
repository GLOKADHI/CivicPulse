import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
}

/**
 * A typewriter effect component that displays text character by character.
 * @param text - The string to animate.
 */
const Typewriter = ({ text }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span className="inline-block border-r-2 border-gold pr-1 animate-pulse min-h-[1.2em]">
      {displayText}
    </span>
  );
};

export default Typewriter;
