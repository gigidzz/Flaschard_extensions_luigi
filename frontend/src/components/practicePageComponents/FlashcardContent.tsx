import React from 'react';
import { Flashcard } from '../../types/flashcard';
import FlashcardItem from '../FlashcardItem';

interface FlashcardContentProps {
  flashcards: Flashcard[];
  currentCardIndex: number;
  isTransitioning: boolean;
  cardKey: number;
  handleRateCard: (rating: 'wrong' | 'hard' | 'easy') => Promise<boolean>;
  isCurrentCardRated: boolean;
  handleFlipChange: (isFlipped: boolean) => void;
  showNextButton: boolean;
  handleNextCard: () => void;
  setDescShown: (shown: boolean) => void;
}

const FlashcardContent: React.FC<FlashcardContentProps> = ({
  flashcards,
  currentCardIndex,
  isTransitioning,
  cardKey,
  handleRateCard,
  isCurrentCardRated,
  handleFlipChange,
  showNextButton,
  handleNextCard,
  setDescShown
}) => {
  if (flashcards.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-medium text-gray-800">No flashcards available</h3>
        <p className="text-gray-600 mt-2">Please create some flashcards first.</p>
        <button
          onClick={() => setDescShown(true)}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          Back to Description
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div className="mb-6 text-center text-gray-500">
        Card {currentCardIndex + 1} of {flashcards.length}
      </div>
      
      <div className="mb-6">
        <FlashcardItem
          key={cardKey}
          flashcard={flashcards[currentCardIndex]}
          onRateCard={handleRateCard}
          isRated={isCurrentCardRated}
          onFlipChange={handleFlipChange}
        />
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => setDescShown(true)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
        >
          Back to Description
        </button>
        
        {showNextButton && (
          <button
            onClick={handleNextCard}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default FlashcardContent;