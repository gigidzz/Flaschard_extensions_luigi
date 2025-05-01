import React, { useState } from 'react';
import { Flashcard } from '../types/flashcard';
import RatingConfirmation from './practicePageComponents/RatingConfirmation';

interface FlashcardItemProps {
  flashcard: Flashcard;
  onRateCard?: (rating: 'wrong' | 'hard' | 'easy') => Promise<boolean>;
  isRated?: boolean;
  onFlipChange?: (isFlipped: boolean) => void;
  onDelete?: (id: string) => Promise<void>; // Add delete function prop
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ 
  flashcard, 
  onRateCard, 
  isRated,
  onFlipChange,
  onDelete 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [pendingRating, setPendingRating] = useState<'wrong' | 'hard' | 'easy' | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Determine if card is learned (point > 5)
  const isLearned = flashcard.point > 4;
  
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

  // Handle the delete button click
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(flashcard.id);
    } catch (error) {
      console.error("Error deleting card:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Cancel delete confirmation
  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
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
            
            {/* Learning Status Badge */}
            {isLearned && (
              <div className="absolute top-3 right-3">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Learned
                </span>
              </div>
            )}
            
            {/* Tags moved to top-left */}
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
            
            {/* Points Indicator */}
            <div className="absolute bottom-3 right-3 flex items-center">
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {flashcard.point} {flashcard.point === 1 ? 'point' : 'points'}
              </span>
            </div>
            
            {/* Delete Button - Moved to bottom-left corner, but only if no hint button */}
            {onDelete && !showDeleteConfirm && !flashcard.hint && (
              <button 
                onClick={handleDeleteClick}
                className="absolute bottom-3 left-3 text-red-600 hover:text-red-800 z-10"
                aria-label="Delete flashcard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            
            {/* Delete Button - If hint exists, position slightly differently */}
            {onDelete && !showDeleteConfirm && flashcard.hint && (
              <button 
                onClick={handleDeleteClick}
                className="absolute top-16 right-3 text-red-600 hover:text-red-800 z-10"
                aria-label="Delete flashcard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            
            {/* Delete Confirmation Dialog - Centered in card for better visibility */}
            {showDeleteConfirm && (
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 z-20 bg-white rounded-lg shadow-md border border-red-200"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm text-gray-700 mb-2">Delete this card?</p>
                <div className="flex gap-2">
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                  >
                    {isDeleting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </span>
                    ) : 'Delete'}
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {flashcard.hint && (
              <button 
                onClick={toggleHint}
                className="absolute bottom-3 left-3 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
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
            
            {!flashcard.hint && !onDelete && (
              <div className="absolute bottom-3 left-3 text-sm text-blue-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Click to reveal answer
              </div>
            )}
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