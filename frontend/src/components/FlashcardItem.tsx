import React, { useState } from 'react';
import { Flashcard } from '../types/flashcard';
import RatingConfirmation from './practicePageComponents/RatingConfirmation';

interface FlashcardItemProps {
  flashcard: Flashcard;
  onRateCard?: (rating: 'wrong' | 'hard' | 'easy') => Promise<boolean>;
  isRated?: boolean;
  onFlipChange?: (isFlipped: boolean) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ 
  flashcard, 
  onRateCard, 
  isRated,
  onFlipChange 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [pendingRating, setPendingRating] = useState<'wrong' | 'hard' | 'easy' | null>(null);

  const flipCard = () => {
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);
    setShowHint(false);
    
    if (onFlipChange) {
      onFlipChange(newFlipState);
    }
  };

  const toggleHint = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHint(!showHint);
  };

  const handleRatingSelection = (rating: 'wrong' | 'hard' | 'easy') => (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isFlipped) {
      console.log("Cannot rate card until it's flipped to show the answer");
      return;
    }
    
    setPendingRating(rating);
  };
  
  const confirmRating = async () => {
    if (!pendingRating) return;
    
    setIsRating(true);
    try {
      if (onRateCard) {
        await onRateCard(pendingRating);
      }
    } catch (error) {
      console.error("Error rating card:", error);
    } finally {
      setIsRating(false);
      setPendingRating(null);
    }
  };
  
  const cancelRating = () => {
    setPendingRating(null);
  };

  const ratingButtonStyles = {
    wrong: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",
    hard: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white",
    easy: "bg-green-500 hover:bg-green-600 active:bg-green-700 text-white"
  };

  return (
    <div 
      className="flex justify-center"
      onClick={flipCard}
    >
      <div className="w-full max-w-md h-72 perspective-1000 cursor-pointer">
        <div 
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-xl shadow-lg ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 bg-white rounded-xl border-2 border-blue-100">
            <h3 className="text-xl font-medium text-center text-gray-800">{flashcard.front}</h3>
            
            {flashcard.tags && flashcard.tags.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                {flashcard.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {flashcard.hint && (
              <button 
                onClick={toggleHint}
                className="absolute bottom-3 right-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}
            
            {showHint && flashcard.hint && (
              <div className="absolute bottom-10 right-3 bg-blue-50 p-2 rounded-lg text-sm text-blue-800 max-w-xs shadow-md border border-blue-100">
                {flashcard.hint}
              </div>
            )}
            
            <div className="absolute bottom-3 left-3 text-sm text-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Click to reveal answer
            </div>
          </div>
          
          <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200">
            <p className="text-lg text-gray-800 text-center">{flashcard.back}</p>
            
            {isFlipped && !isRated && !isRating && onRateCard && !pendingRating && (
              <div
                className="absolute bottom-4 w-full flex justify-center space-x-3 px-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleRatingSelection('wrong')}
                  className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 font-medium ${ratingButtonStyles.wrong}`}
                >
                  Wrong
                </button>
                <button
                  onClick={handleRatingSelection('hard')}
                  className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 font-medium ${ratingButtonStyles.hard}`}
                >
                  Hard
                </button>
                <button
                  onClick={handleRatingSelection('easy')}
                  className={`px-4 py-2 rounded-lg shadow-md transition-all duration-200 font-medium ${ratingButtonStyles.easy}`}
                >
                  Easy
                </button>
              </div>
            )}
            
            {pendingRating && !isRating && !isRated && (
              <div onClick={(e) => e.stopPropagation()}>
                <RatingConfirmation 
                  selectedRating={pendingRating}
                  onConfirm={confirmRating}
                  onCancel={cancelRating}
                />
              </div>
            )}
            
            {isRating && (
              <div className="absolute bottom-4 w-full text-center text-blue-600">
                <div className="flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rating card...
                </div>
              </div>
            )}
            
            {isRated && (
              <div className="absolute bottom-4 w-full text-center text-green-600 font-medium">
                <div className="flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Card rated! Click "Next" to continue.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;