import { useEffect, useState, useCallback } from 'react'
import { Card } from './Card'
import { WinModal } from './WinModal'
import { GameStats } from './GameStats'
import { shuffle } from './utils/shuffle'

// Define the emoji set (8 emojis, each will appear twice)
const EMOJIS = ["🍕", "🍔", "🍣", "🍩", "🌮", "🍿", "🍦", "🍫"]
type CardType = { id: number; emoji: string; status: "hidden" | "visible" | "matched" };
type HighScores = { bestTime: number | null; bestMoves: number | null };

function App() {
  const [cards, setCards] = useState<CardType[]>([])
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasWon, setHasWon] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [highScores, setHighScores] = useState<HighScores>({ bestTime: null, bestMoves: null })

  // Load high scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('emojiMemoryHighScores');
    if (savedScores) setHighScores(JSON.parse(savedScores));
  }, []);

  // Check if current scores are new high scores
  const isNewBestTime = useCallback(() => (
    gameTime > 0 && (highScores.bestTime === null || gameTime < highScores.bestTime)
  ), [gameTime, highScores.bestTime]);

  const isNewBestMoves = useCallback(() => (
    moveCount > 0 && (highScores.bestMoves === null || moveCount < highScores.bestMoves)
  ), [moveCount, highScores.bestMoves]);

  // Initialize or reset the game
  const initializeGame = () => {
    const emojiDeck = [...EMOJIS, ...EMOJIS];
    const newCards = shuffle(emojiDeck).map((emoji, index) => ({ 
      id: index, emoji, status: "hidden" as const 
    }));
    
    setCards(newCards);
    setVisibleCards([]);
    setIsProcessing(false);
    setHasWon(false);
    setGameStarted(false);
    setMoveCount(0);
    setGameTime(0);
  }

  // Initialize cards, check win condition, handle timer, update high scores
  useEffect(() => { initializeGame(); }, []);
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.status === "matched")) setHasWon(true);
  }, [cards]);
  
  useEffect(() => {
    let interval: number | undefined;
    if (gameStarted && !hasWon) {
      interval = window.setInterval(() => setGameTime(prev => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [gameStarted, hasWon]);

  useEffect(() => {
    if (hasWon && gameTime > 0) {
      let updated = false;
      const newHighScores = { ...highScores };

      if (isNewBestTime()) { newHighScores.bestTime = gameTime; updated = true; }
      if (isNewBestMoves()) { newHighScores.bestMoves = moveCount; updated = true; }

      if (updated) {
        setHighScores(newHighScores);
        localStorage.setItem('emojiMemoryHighScores', JSON.stringify(newHighScores));
      }
    }
  }, [hasWon, gameTime, moveCount, highScores, isNewBestTime, isNewBestMoves]);

  // Handle card click
  const handleCardClick = (id: number) => {
    if (isProcessing || visibleCards.includes(id)) return;
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Emoji Memory Game</h1>
      <GameStats moves={moveCount} timer={gameTime} highScores={highScores} onRestart={initializeGame} />
      
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mt-4">
        {cards.map(card => (
          <Card key={card.id} id={card.id} emoji={card.emoji} status={card.status}
                onClick={handleCardClick} isClickable={!isProcessing && visibleCards.length < 2} />
        ))}
      </div>
      
      {hasWon && (
        <WinModal onPlayAgain={initializeGame} time={gameTime} moves={moveCount}
                 isNewBestTime={isNewBestTime()} isNewBestMoves={isNewBestMoves()} />
      )}
    </div>
  )
}

export default App
