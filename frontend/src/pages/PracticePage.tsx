import { useState, useCallback } from "react";
import { usePracticeFlashcards } from "../hooks/useFlascards";
import FlashcardItem from "../components/FlashcardItem";
import axios from "axios";
import GestureRecognition from "../components/GestureRecognition";

function PracticePage() {
  const [descShown, setDescShown] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isCurrentCardRated, setIsCurrentCardRated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardKey, setCardKey] = useState(0);
  const { data: flashcards = [], isLoading, error, refetch } = usePracticeFlashcards();
  const [gestureEnabled, setGestureEnabled] = useState(true);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

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

  const handleGestureDetected = useCallback((rating: 'wrong' | 'hard' | 'easy') => {
    console.log(`Gesture detected: ${rating}`);
    if (!isCurrentCardRated && !descShown && isCardFlipped && flashcards.length > 0) {
      handleRateCard(rating);
    } else {
      console.log("Gesture ignored - card not flipped or already rated");
    }
  }, [handleRateCard, isCurrentCardRated, descShown, flashcards, isCardFlipped]);

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

  const startPractice = useCallback(() => {
    setDescShown(false);
    setCurrentCardIndex(0);
    setShowNextButton(false);
    setIsCurrentCardRated(false);
    setIsCardFlipped(false);
    setGestureEnabled(true);
    setCardKey(prevKey => prevKey + 1);
  }, []);

  const handleFlipChange = useCallback((flipped: boolean) => {
    console.log("Card flip state changed:", flipped);
    setIsCardFlipped(flipped);
  }, []);

  if (isLoading) return <div className="flex justify-center items-center h-64">Loading flashcards...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading flashcards: {error.message}</div>;

  const lowScoreCards = flashcards.length;

  return (
    <div className="relative flex flex-col items-center p-6">
      {!descShown && flashcards.length > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <GestureRecognition 
            onGestureDetected={handleGestureDetected}
            isEnabled={gestureEnabled && !isCurrentCardRated && isCardFlipped}
          />
        </div>
      )}
      
      <h1 className="text-4xl md:text-5xl mb-6 text-center">Practice Flashcards</h1>
      
      {descShown ? (
        <div className="text-center max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl mb-4 text-blue-600">Ready to Practice?</h2>
          <p className="mb-2">You have <span className="font-bold">{flashcards.length}</span> flashcards to practice</p>
          <p className="mb-6">Including <span className="font-bold text-yellow-600">{lowScoreCards}</span> flashcards with score less than 5</p>
          <button 
            onClick={startPractice}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            disabled={flashcards.length === 0}
          >
            Start Practice
          </button>
          
          {flashcards.length === 0 && (
            <p className="mt-4 text-gray-500 text-sm">No flashcards available for practice.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {flashcards.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600">
                Card {currentCardIndex + 1} of {flashcards.length}
              </div>
              
              <div 
                className="w-full max-w-lg"
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transition: 'opacity 300ms ease-in-out',
                }}
              >
                <FlashcardItem 
                  key={cardKey}
                  flashcard={flashcards[currentCardIndex]} 
                  onRateCard={handleRateCard}
                  isRated={isCurrentCardRated}
                  onFlipChange={handleFlipChange}
                />
              </div>
              
              {showNextButton && (
                <button
                  onClick={handleNextCard}
                  className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition-colors duration-200"
                  disabled={isTransitioning}
                >
                  Next Card
                </button>
              )}

              <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-sm max-w-md">
                <h3 className="text-lg font-medium mb-2 text-gray-800">Gesture Controls:</h3>
                <ul className="space-y-2 pl-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-xl">👍</span> 
                    <span>Thumbs Up = Rate as <span className="font-bold text-green-600">Easy</span></span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-xl">✋</span> 
                    <span>Flat Hand = Rate as <span className="font-bold text-yellow-600">Hard</span></span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-xl">✌️</span> 
                    <span>Victory Sign = Rate as <span className="font-bold text-red-600">Wrong</span></span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-gray-600">
                  Hold the gesture for 3 seconds to confirm your rating, or use the buttons below the camera.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Note:</strong> Ratings can only be submitted after flipping the card to see the answer.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">No flashcards available for practice.</p>
              <button
                onClick={() => setDescShown(true)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PracticePage;