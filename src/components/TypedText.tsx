
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TypedTextProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
  delay?: number;
}

const TypedText: React.FC<TypedTextProps> = ({
  text,
  className,
  speed = 30,
  onComplete,
  delay = 0
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (delay > 0) {
      const delayTimeout = setTimeout(() => {
        setIsTyping(true);
      }, delay);
      
      return () => clearTimeout(delayTimeout);
    } else {
      setIsTyping(true);
    }
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;
    
    let currentIndex = 0;
    
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = window.setTimeout(typeNextChar, speed);
      } else {
        if (onComplete) onComplete();
      }
    };
    
    timeoutRef.current = window.setTimeout(typeNextChar, speed);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed, onComplete, isTyping]);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {displayedText}
      {isTyping && displayedText.length < text.length && <span className="animate-pulse">▋</span>}
    </span>
  );
};

export default TypedText;
