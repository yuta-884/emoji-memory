import type { Difficulty } from './utils/generateDeck';

interface WinModalProps {
  onPlayAgain: () => void;
  time: number;
  moves: number;
  isNewBestTime: boolean;
  isNewBestMoves: boolean;
  difficulty?: Difficulty;
}

// Format time as mm:ss
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export function WinModal({ onPlayAgain, time, moves, isNewBestTime, isNewBestMoves, difficulty = 'easy' }: WinModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full transition-colors">
        <h2 className="text-3xl font-bold mb-4 dark:text-white">🎉 You Win! 🎉</h2>
        <p className="mb-6 text-lg dark:text-gray-200">Congratulations! You've matched all the cards on {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty!</p>
        
        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded transition-colors">
            <span>Time:</span>
            <span className="font-mono tabular-nums font-bold">
              {formatTime(time)} {isNewBestTime && <span className="text-yellow-500 ml-2">🏆 New Best!</span>}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded transition-colors">
            <span>Moves:</span>
            <span className="font-mono tabular-nums font-bold">
              {moves} {isNewBestMoves && <span className="text-yellow-500 ml-2">🏆 New Best!</span>}
            </span>
          </div>
        </div>
        <button onClick={onPlayAgain} className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors" aria-label="Play again">
          Play Again
        </button>
      </div>
    </div>
  );
}
