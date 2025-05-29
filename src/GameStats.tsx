interface GameStatsProps {
  moves: number;
  timer: number;
  highScores: { bestTime: number | null; bestMoves: number | null };
  onRestart: () => void;
}

// Format time as mm:ss
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function GameStats({ moves, timer, highScores, onRestart }: GameStatsProps) {
  return (
    <div className="w-full max-w-md mx-auto p-4 mb-4 flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg shadow transition-colors">
      <div className="flex items-center space-x-6">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-300">Time</div>
          <div className="font-mono tabular-nums text-xl">{formatTime(timer)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-300">Moves</div>
          <div className="font-mono tabular-nums text-xl">{moves}</div>
        </div>
      </div>
      <div className="text-center flex-1 px-2">
        {(highScores.bestTime !== null || highScores.bestMoves !== null) && (
          <div className="text-sm text-gray-500">
            Best: {highScores.bestTime !== null ? formatTime(highScores.bestTime) : "--:--"} / {highScores.bestMoves ?? "--"} moves
          </div>
        )}
      </div>
      <button onClick={onRestart} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors" aria-label="Restart game">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
}
