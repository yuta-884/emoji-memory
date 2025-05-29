import { shuffle } from './shuffle';

// Extended emoji set for different difficulty levels
const ALL_EMOJIS = [
  // Original set (8)
  "🍕", "🍔", "🍣", "🍩", "🌮", "🍿", "🍦", "🍫",
  // Additional emojis for medium (10 more)
  "🍇", "🍉", "🍌", "🍎", "🍓", "🥑", "🥝", "🍒", "🍋", "🍊",
  // Additional emojis for hard (14 more)
  "🥭", "🍍", "🥥", "🥕", "🌽", "🥔", "🧀", "🥞", "🥐", "🥨", "🍪", "🧁", "🍰", "🍭"
];

export type Difficulty = "easy" | "medium" | "hard";

export interface Card {
  id: number;
  emoji: string;
  status: "hidden" | "visible" | "matched";
}

export interface DifficultyConfig {
  gridSize: number;
  columns: number;
  emojiCount: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    gridSize: 16,    // 4x4
    columns: 4,
    emojiCount: 8
  },
  medium: {
    gridSize: 36,    // 6x6
    columns: 6,
    emojiCount: 18
  },
  hard: {
    gridSize: 64,    // 8x8
    columns: 8,
    emojiCount: 32
  }
};

/**
 * Generates a shuffled deck of cards based on the selected difficulty
 */
export function generateDeck(difficulty: Difficulty): Card[] {
  const config = DIFFICULTY_CONFIG[difficulty];
  
  // Get the required number of emojis for this difficulty
  const emojisForLevel = ALL_EMOJIS.slice(0, config.emojiCount);
  
  // Create pairs of emojis
  const emojiPairs = [...emojisForLevel, ...emojisForLevel];
  
  // Shuffle the deck
  const shuffledEmojis = shuffle(emojiPairs);
  
  // Create card objects
  return shuffledEmojis.map((emoji, index) => ({
    id: index,
    emoji,
    status: "hidden" as const
  }));
}

/**
 * Get the localStorage key for high scores based on difficulty
 */
export function getHighScoreKey(type: "time" | "moves", difficulty: Difficulty): string {
  return `best${type.charAt(0).toUpperCase() + type.slice(1)}_${difficulty}`;
}
