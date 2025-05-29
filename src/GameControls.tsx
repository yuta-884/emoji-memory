import type { Difficulty } from './utils/generateDeck';

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export function GameControls({ 
  difficulty, 
  onDifficultyChange, 
  soundEnabled, 
  onSoundToggle 
}: GameControlsProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-md mb-4 transition-colors">
      <div className="flex items-center">
        <label htmlFor="difficulty" className="mr-2 font-medium transition-colors">
          Difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-colors"
        >
          <option value="easy">Easy (4×4)</option>
          <option value="medium">Medium (6×6)</option>
          <option value="hard">Hard (8×8)</option>
        </select>
      </div>
      
      <button
        onClick={onSoundToggle}
        className="text-2xl focus:outline-none"
        aria-label={soundEnabled ? "Mute sounds" : "Enable sounds"}
      >
        {soundEnabled ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
