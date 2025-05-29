interface WinModalProps {
  onPlayAgain: () => void;
}

export function WinModal({ onPlayAgain }: WinModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-6">🎉 You Win! 🎉</h2>
        <p className="mb-6 text-lg">Congratulations! You've matched all the cards!</p>
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          aria-label="Play again"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
