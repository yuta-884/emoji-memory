import { useEffect, useState } from 'react'
import { Card } from './Card'
import { shuffle } from './utils/shuffle'

// Define the emoji set (8 emojis, each will appear twice)
const EMOJIS = ["🍕", "🍔", "🍣", "🍩", "🌮", "🍿", "🍦", "🍫"]

function App() {
  const [cards, setCards] = useState<string[]>([])

  // Initialize the cards on component mount
  useEffect(() => {
    // Create a deck with each emoji appearing twice
    const emojiDeck = [...EMOJIS, ...EMOJIS]
    // Shuffle the deck
    const shuffledDeck = shuffle(emojiDeck)
    setCards(shuffledDeck)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Emoji Memory Game</h1>
      
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((emoji, index) => (
          <Card key={index} emoji={emoji} index={index} />
        ))}
      </div>
    </div>
  )
}

export default App
