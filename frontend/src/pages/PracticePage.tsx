import { useState } from "react";
import { usePracticeFlashcards } from "../hooks/useFlascards";
import FlashcardItem from "../components/FlashcardItem";
import axios from "axios";

function PracticePage() {
  const [descShown, setDescShown] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isCurrentCardRated, setIsCurrentCardRated] = useState(false);
  const { data: flashcards = [], isLoading, error, refetch } = usePracticeFlashcards();

  const handleRateCard = async (rating: 'wrong' | 'hard' | 'easy'): Promise<boolean> => {
    if (flashcards.length > 0) {
      const currentCard = flashcards[currentCardIndex];
      
      try {
        // Send rating to backend
        const response = await axios.post('/api/flashcards/rate', {
          flashcardId: currentCard.id,
          rating: rating
        });
        
        // Only mark as rated and show next button if API call was successful
        if (response.status === 200) {
          setIsCurrentCardRated(true);
          setShowNextButton(true);
          return true;
        } else {
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
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowNextButton(false);
      setIsCurrentCardRated(false);
    } else {
      // Practice session completed
      alert("You've completed all flashcards!");
      setDescShown(true);
      setCurrentCardIndex(0);
      setIsCurrentCardRated(false);
      refetch(); // Refresh flashcards data
    }
  };

  const startPractice = () => {
    setDescShown(false);
    setCurrentCardIndex(0);
    setShowNextButton(false);
    setIsCurrentCardRated(false);
  };

  if (isLoading) return <div>Loading flashcards...</div>;
  if (error) return <div>Error loading flashcards: {error.message}</div>;

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-5xl mb-6">Practice Page</h1>
      
      {descShown ? (
        <div className="text-center max-w-md">
          <h2 className="text-2xl mb-4">Flashcard Practice</h2>
          <p className="mb-2">You have {flashcards.length} flashcards to practice</p>
          <p className="mb-4">You have {flashcards.filter(card => card.point < 5).length} flashcards which score is less than 5</p>
          <button 
            onClick={startPractice}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Journey
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {flashcards.length > 0 ? (
            <>
              <div className="mb-4 text-gray-600">
                Card {currentCardIndex + 1} of {flashcards.length}
              </div>
              
              <FlashcardItem 
                flashcard={flashcards[currentCardIndex]} 
                onRateCard={handleRateCard}
                isRated={isCurrentCardRated}
              />
              
              {showNextButton && (
                <button
                  onClick={handleNextCard}
                  className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                >
                  Next
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <p>No flashcards available for practice.</p>
              <button
                onClick={() => setDescShown(true)}
                className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
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