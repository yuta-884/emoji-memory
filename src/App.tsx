import { useEffect, useState } from 'react'
import { Card } from './Card'
import { WinModal } from './WinModal'
import { shuffle } from './utils/shuffle'

// Define the emoji set (8 emojis, each will appear twice)
const EMOJIS = ["🍕", "🍔", "🍣", "🍩", "🌮", "🍿", "🍦", "🍫"]

// Define the Card type
type CardType = {
  id: number;
  emoji: string;
  status: "hidden" | "visible" | "matched";
};

function App() {
  const [cards, setCards] = useState<CardType[]>([])
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasWon, setHasWon] = useState(false)

  // Initialize or reset the game
  const initializeGame = () => {
    // Create a deck with each emoji appearing twice
    const emojiDeck = [...EMOJIS, ...EMOJIS]
    // Shuffle the deck
    const shuffledDeck = shuffle(emojiDeck)
    
    // Create card objects with IDs and initial status
    const newCards = shuffledDeck.map((emoji, index) => ({
      id: index,
      emoji,
      status: "hidden" as const
    }))
    
    setCards(newCards)
    setVisibleCards([])
    setIsProcessing(false)
    setHasWon(false)
  }

  // Initialize the cards on component mount
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for win condition whenever cards change
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.status === "matched")) {
      setHasWon(true)
    }
  }, [cards])

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore clicks if we're processing a match/mismatch or if the card is already visible
    if (isProcessing || visibleCards.includes(id)) {
      return
    }

    // Update the clicked card's status to visible
    const updatedCards = cards.map(card => 
      card.id === id ? { ...card, status: "visible" as const } : card
    )
    setCards(updatedCards)
    
    // Add the card to visible cards
    const newVisibleCards = [...visibleCards, id]
    setVisibleCards(newVisibleCards)
    
    // If this is the second card, check for a match
    if (newVisibleCards.length === 2) {
      const [firstId, secondId] = newVisibleCards
      const firstCard = updatedCards.find(card => card.id === firstId)
      const secondCard = updatedCards.find(card => card.id === secondId)
      
      setIsProcessing(true)
      
      // Check if the emojis match
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found - update both cards to matched status
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, status: "matched" as const } 
                : card
            )
          )
          setVisibleCards([])
          setIsProcessing(false)
        }, 300) // Short delay to show the match
      } else {
        // No match - flip cards back after a delay
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              card.id === firstId || card.id === secondId 
                ? { ...card, status: "hidden" as const } 
                : card
            )
          )
          setVisibleCards([])
          setIsProcessing(false)
        }, 800) // Longer delay so player can see the cards
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Emoji Memory Game</h1>
      
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
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
      
      {hasWon && <WinModal onPlayAgain={initializeGame} />}
    </div>
  )
}

export default App
