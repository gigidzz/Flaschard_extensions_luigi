import { useState, useCallback } from "react";
import { usePracticeFlashcards } from "../hooks/useFlascards";
import axios from "axios";
import PracticePageSkeleton from "../skeletons/practicePageSkeleton";
import PracticePageError from "../errorPages/practicePageError";
import DescShown from "../components/practicePageComponents/DescShown";
import PracticePageLayout from "../components/practicePageComponents/PracticePageLayout";
import FlashcardContent from "../components/practicePageComponents/FlashcardContent";
import FlashcardGestureWrapper from "../components/practicePageComponents/FlashcardGestureWrapper";

function PracticePage() {
  const [descShown, setDescShown] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isCurrentCardRated, setIsCurrentCardRated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [pendingGestureRating, setPendingGestureRating] = useState<'wrong' | 'hard' | 'easy' | null>(null);
  
  // Data fetching
  const { 
    data: flashcards = [], 
    isLoading, 
    error, 
    refetch 
  } = usePracticeFlashcards();

  // Handle rating a flashcard
  const handleRateCard = useCallback(async (rating: 'wrong' | 'hard' | 'easy'): Promise<boolean> => {
    if (flashcards.length > 0 && !isCurrentCardRated && isCardFlipped) {
      const currentCard = flashcards[currentCardIndex];
      console.log(`Rating card ${currentCard.id} as ${rating}`);
      
      try {
        const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/flashcards/update-difficulty`, {
          id: currentCard.id,
          difficulty_level: rating
        });
        
        if (response.status === 200) {
          setIsCurrentCardRated(true);
          setShowNextButton(true);
          setGestureEnabled(false);
          return true;
        } else {
          console.error("Server returned non-200 status:", response.status);
          alert("Failed to rate flashcard. Please try again.");
          return false;
        }
      } catch (error) {
        console.error("Error rating flashcard:", error);
        alert("Failed to rate flashcard. Please try again.");
        return false;
      }
    }
    return false;
  }, [flashcards, currentCardIndex, isCurrentCardRated, isCardFlipped]);

  // Handle gesture detection
  const handleGestureDetected = useCallback((rating: 'wrong' | 'hard' | 'easy') => {
    console.log(`Gesture detected: ${rating}`);
    if (!isCurrentCardRated && !descShown && isCardFlipped && flashcards.length > 0) {
      // Instead of immediately rating, set pending gesture rating
      setPendingGestureRating(rating);
    } else {
      console.log("Gesture ignored - card not flipped or already rated");
    }
  }, [isCurrentCardRated, descShown, flashcards, isCardFlipped]);

  // Confirm gesture rating
  const confirmGestureRating = useCallback(async () => {
    if (pendingGestureRating) {
      await handleRateCard(pendingGestureRating);
      setPendingGestureRating(null);
    }
  }, [pendingGestureRating, handleRateCard]);

  // Cancel gesture rating
  const cancelGestureRating = useCallback(() => {
    setPendingGestureRating(null);
  }, []);

  // Handle advancing to the next card
  const handleNextCard = useCallback(() => {
    if (currentCardIndex < flashcards.length - 1) {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentCardIndex(prevIndex => prevIndex + 1);
        setShowNextButton(false);
        setIsCurrentCardRated(false);
        setIsCardFlipped(false);
        setCardKey(prevKey => prevKey + 1);
        setGestureEnabled(true);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    } else {
      alert("You've completed all flashcards!");
      setDescShown(true);
      setCurrentCardIndex(0);
      setIsCurrentCardRated(false);
      setIsCardFlipped(false);
      setGestureEnabled(true);
      refetch();
    }
  }, [currentCardIndex, flashcards.length, refetch]);

  // Start practice session
  const startPractice = useCallback(() => {
    setDescShown(false);
    setCurrentCardIndex(0);
    setShowNextButton(false);
    setIsCurrentCardRated(false);
    setIsCardFlipped(false);
    setGestureEnabled(true);
    setCardKey(prevKey => prevKey + 1);
  }, []);

  // Track card flip state
  const handleFlipChange = useCallback((flipped: boolean) => {
    console.log("Card flip state changed:", flipped);
    setIsCardFlipped(flipped);
    // Clear any pending gesture rating when card is flipped
    if (!flipped) {
      setPendingGestureRating(null);
    }
  }, []);

  // Loading and error states
  if (isLoading) return <PracticePageSkeleton />;
  if (error) return <PracticePageError error={error} />;

  return (
    <PracticePageLayout>
      {!descShown && flashcards.length > 0 && (
        <FlashcardGestureWrapper
          onGestureDetected={handleGestureDetected}
          isEnabled={gestureEnabled && !isCurrentCardRated && isCardFlipped && !pendingGestureRating}
        />
      )}
      
      {descShown ? (
        <DescShown 
          flashcards={flashcards} 
          startPractice={startPractice}
        />
      ) : (
        <div className="flex flex-col items-center">
          <FlashcardContent
            flashcards={flashcards}
            currentCardIndex={currentCardIndex}
            isTransitioning={isTransitioning}
            cardKey={cardKey}
            handleRateCard={handleRateCard}
            isCurrentCardRated={isCurrentCardRated}
            handleFlipChange={handleFlipChange}
            showNextButton={showNextButton}
            handleNextCard={handleNextCard}
            setDescShown={setDescShown}
          />
          
          {pendingGestureRating && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-medium mb-3 text-gray-800">Confirm Rating</h3>
                <p className="mb-4 text-gray-600">
                  You used a gesture to rate this card as:
                  <span className={`font-bold ml-2 ${
                    pendingGestureRating === 'wrong' ? 'text-red-600' :
                    pendingGestureRating === 'hard' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {pendingGestureRating.charAt(0).toUpperCase() + pendingGestureRating.slice(1)}
                  </span>
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={cancelGestureRating}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmGestureRating}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PracticePageLayout>
  );
}

export default PracticePage;