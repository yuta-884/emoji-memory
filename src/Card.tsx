import { useState } from 'react';

interface CardProps {
  emoji: string;
  index: number;
}

export function Card({ emoji, index }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(true);
  };

  return (
    <div 
      className={`w-16 h-16 md:w-20 md:h-20 rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 ${
        isFlipped ? 'bg-white' : 'bg-gray-300'
      }`}
      onClick={handleClick}
      data-index={index}
    >
      {isFlipped ? (
        <span className="text-2xl md:text-3xl">{emoji}</span>
      ) : null}
    </div>
  );
}
