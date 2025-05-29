import { useEffect, useState, useCallback } from 'react'
import { Card } from './Card'
import { WinModal } from './WinModal'
import { GameStats } from './GameStats'
import { GameControls } from './GameControls'
import { ThemeToggle } from './components/ThemeToggle'
import { ThemeProvider } from './providers/ThemeProvider'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { OfflineNotification } from './components/OfflineNotification'
import { generateDeck, DIFFICULTY_CONFIG, getHighScoreKey } from './utils/generateDeck'
import type { Difficulty } from './utils/generateDeck'
import { initSounds, playSound, getSoundEnabledSetting, saveSoundEnabledSetting } from './utils/sound'

// Define type for high scores with difficulty
type HighScores = Record<Difficulty, { bestTime: number | null; bestMoves: number | null }>;

function App() {
  // Game state
  const [cards, setCards] = useState(generateDeck('easy'))
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  
  // Settings
  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const saved = localStorage.getItem('difficulty') as Difficulty;
    return saved || 'easy';
  })
  const [soundEnabled, setSoundEnabled] = useState(() => getSoundEnabledSetting())
  
  // High scores for each difficulty level
  const [highScores, setHighScores] = useState<HighScores>({
    easy: { bestTime: null, bestMoves: null },
    medium: { bestTime: null, bestMoves: null },
    hard: { bestTime: null, bestMoves: null }
  })

  // Initialize sounds
  useEffect(() => {
    // 開発環境では baseUrl は空文字列、本番環境では '/emoji-memory/' になる
    const baseUrl = window.location.pathname.includes('/emoji-memory') ? '/emoji-memory/' : '/';
    console.log('App initializing sounds with baseUrl:', baseUrl);
    initSounds(baseUrl);
    
    // ユーザーインタラクションが必要なブラウザ向けに、クリックイベントでサウンドを有効化
    const enableAudio = () => {
      if (soundEnabled) {
        console.log('User interaction detected, enabling audio...');
        // 無音を再生して音声再生を有効化
        const silentAudio = new Audio();
        silentAudio.play().catch(e => console.log('Silent audio play:', e));
      }
      document.removeEventListener('click', enableAudio);
    };
    
    document.addEventListener('click', enableAudio);
    
    return () => {
      document.removeEventListener('click', enableAudio);
    };
  }, [soundEnabled]);

  // Load high scores from localStorage on component mount
  useEffect(() => {
    const loadedHighScores: HighScores = {
      easy: { bestTime: null, bestMoves: null },
      medium: { bestTime: null, bestMoves: null },
      hard: { bestTime: null, bestMoves: null }
    };
    
    // Load high scores for each difficulty
    Object.keys(loadedHighScores).forEach(diff => {
      const diffKey = diff as Difficulty;
      const timeKey = getHighScoreKey('time', diffKey);
      const movesKey = getHighScoreKey('moves', diffKey);
      
      const savedTime = localStorage.getItem(timeKey);
      const savedMoves = localStorage.getItem(movesKey);
      
      if (savedTime) loadedHighScores[diffKey].bestTime = parseInt(savedTime);
      if (savedMoves) loadedHighScores[diffKey].bestMoves = parseInt(savedMoves);
    });
    
    setHighScores(loadedHighScores);
  }, []);

  // Check if current scores are new high scores
  const isNewBestTime = useCallback(() => (
    gameTime > 0 && (highScores[difficulty].bestTime === null || gameTime < highScores[difficulty].bestTime!)
  ), [gameTime, highScores, difficulty]);

  const isNewBestMoves = useCallback(() => (
    moveCount > 0 && (highScores[difficulty].bestMoves === null || moveCount < highScores[difficulty].bestMoves!)
  ), [moveCount, highScores, difficulty]);

  // Initialize or reset the game
  const initializeGame = useCallback(() => {
    const newCards = generateDeck(difficulty);
    
    setCards(newCards);
    setVisibleCards([]);
    setIsProcessing(false);
    setHasWon(false);
    setGameStarted(false);
    setMoveCount(0);
    setGameTime(0);
  }, [difficulty]);

  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    localStorage.setItem('difficulty', newDifficulty);
  };

  // Handle sound toggle
  const handleSoundToggle = () => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      saveSoundEnabledSetting(newValue);
      return newValue;
    });
  };

  // Initialize cards when difficulty changes
  useEffect(() => {
    initializeGame();
  }, [difficulty, initializeGame]);

  // Check win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.status === "matched")) {
      setHasWon(true);
      playSound('win', soundEnabled);
    }
  }, [cards, soundEnabled]);
  
  // Handle timer
  useEffect(() => {
    let interval: number | undefined;
    if (gameStarted && !hasWon) {
      interval = window.setInterval(() => setGameTime(prev => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [gameStarted, hasWon]);

  // Update high scores
  useEffect(() => {
    if (hasWon && gameTime > 0) {
      let updated = false;
      const newHighScores = { ...highScores };

      if (isNewBestTime()) { 
        newHighScores[difficulty].bestTime = gameTime; 
        updated = true; 
        localStorage.setItem(getHighScoreKey('time', difficulty), gameTime.toString());
      }
      
      if (isNewBestMoves()) { 
        newHighScores[difficulty].bestMoves = moveCount; 
        updated = true; 
        localStorage.setItem(getHighScoreKey('moves', difficulty), moveCount.toString());
      }

      if (updated) {
        setHighScores(newHighScores);
      }
    }
  }, [hasWon, gameTime, moveCount, highScores, isNewBestTime, isNewBestMoves, difficulty]);

  // Handle card click
  const handleCardClick = (id: number) => {
    if (isProcessing || visibleCards.includes(id)) return;
    
    // Play flip sound
    playSound('flip', soundEnabled);
    
    if (!gameStarted) setGameStarted(true);

    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, status: "visible" as const } : card
    );
    setCards(updatedCards);
    
    const newVisibleCards = [...visibleCards, id];
    setVisibleCards(newVisibleCards);
    
    if (newVisibleCards.length === 2) {
      const [firstId, secondId] = newVisibleCards;
      const firstCard = updatedCards.find(card => card.id === firstId);
      const secondCard = updatedCards.find(card => card.id === secondId);
      
      setIsProcessing(true);
      setMoveCount(prev => prev + 1);
      
      const isMatch = firstCard && secondCard && firstCard.emoji === secondCard.emoji;
      const newStatus = isMatch ? "matched" : "hidden";
      const delay = isMatch ? 300 : 800;
      
      // Play match sound if cards match
      if (isMatch) {
        setTimeout(() => playSound('match', soundEnabled), 100);
      }
      
      setTimeout(() => {
        setCards(prev => prev.map(card => 
          (card.id === firstId || card.id === secondId) 
            ? { ...card, status: newStatus as "matched" | "hidden" } 
            : card
        ));
        setVisibleCards([]);
        setIsProcessing(false);
      }, delay);
    }
  }

  // Get grid columns based on difficulty
  const gridColumns = DIFFICULTY_CONFIG[difficulty].columns;

  return (
    <ThemeProvider>
      <OfflineNotification />
      <PWAInstallPrompt />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 transition-colors">
        <div className="w-full max-w-md mx-auto flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-center">Emoji Memory Game</h1>
          <ThemeToggle />
        </div>
        
        <GameControls 
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          soundEnabled={soundEnabled}
          onSoundToggle={handleSoundToggle}
        />
        
        <GameStats 
          moves={moveCount} 
          timer={gameTime} 
          highScores={highScores[difficulty]} 
          onRestart={initializeGame} 
        />
        
        <div 
          className={`grid gap-2 sm:gap-3 mx-auto mt-4 ${
            difficulty === 'easy' 
              ? 'grid-cols-4 max-w-xs sm:max-w-md' 
              : difficulty === 'medium'
                ? 'grid-cols-6 max-w-sm sm:max-w-lg' 
                : 'grid-cols-8 max-w-md sm:max-w-xl'
          }`}
          style={{ 
            gridTemplateColumns: `repeat(${gridColumns}, minmax(32px, 1fr))` 
          }}
        >
          {cards.map(card => (
            <Card 
              key={card.id} 
              id={card.id} 
              emoji={card.emoji} 
              status={card.status}
              onClick={handleCardClick} 
              isClickable={!isProcessing && visibleCards.length < 2} 
            />
          ))}
        </div>
        
        {hasWon && (
          <WinModal 
            onPlayAgain={initializeGame} 
            time={gameTime} 
            moves={moveCount}
            isNewBestTime={isNewBestTime()} 
            isNewBestMoves={isNewBestMoves()} 
            difficulty={difficulty}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
