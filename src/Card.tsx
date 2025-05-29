interface CardProps {
  id: number;
  emoji: string;
  status: "hidden" | "visible" | "matched";
  onClick: (id: number) => void;
  isClickable: boolean;
}

export function Card({ id, emoji, status, onClick, isClickable }: CardProps) {
  const handleClick = () => {
    if (status === "hidden" && isClickable) {
      onClick(id);
    }
  };

  // Determine card appearance based on status
  const cardStyle = {
    hidden: "bg-gray-300 dark:bg-gray-600",
    visible: "bg-white dark:bg-gray-700",
    matched: "bg-white dark:bg-gray-700 opacity-50"
  }[status];

  // Determine aria-label based on status
  const ariaLabel = {
    hidden: "hidden card",
    visible: `${emoji} emoji card`,
    matched: `matched ${emoji} emoji card`
  }[status];

  return (
    <button 
      className={`w-16 h-16 md:w-20 md:h-20 rounded-md flex items-center justify-center 
        ${isClickable || status !== "hidden" ? "cursor-pointer" : "cursor-not-allowed"} 
        transition-all duration-300 ${cardStyle}`}
      onClick={handleClick}
      aria-label={ariaLabel}
      disabled={!isClickable && status === "hidden"}
    >
      {status !== "hidden" && (
        <span className="text-2xl md:text-3xl">{emoji}</span>
      )}
    </button>
  );
}
