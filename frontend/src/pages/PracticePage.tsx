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

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-blue-800 font-medium">Loading flashcards...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-red-100">
        <div className="text-red-500 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Error Loading Flashcards</h2>
          <p className="text-gray-700">{error.message}</p>
          <button 
            onClick={() => refetch()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 font-medium shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  const lowScoreCards = flashcards.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto relative">
        {!descShown && flashcards.length > 0 && (
          <div className="fixed top-4 right-4 z-50">
            <GestureRecognition 
              onGestureDetected={handleGestureDetected}
              isEnabled={gestureEnabled && !isCurrentCardRated && isCardFlipped}
            />
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl mb-8 text-center font-bold text-blue-800 tracking-tight">Practice Flashcards</h1>
        
        {descShown ? (
          <div className="text-center max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl border border-blue-200">
            <h2 className="text-3xl mb-6 text-blue-700 font-semibold">Ready to Practice?</h2>
            <div className="mb-8 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="font-medium">You have <span className="font-bold text-blue-600">{flashcards.length}</span> flashcards to practice</p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="font-medium">Including <span className="font-bold text-yellow-600">{lowScoreCards}</span> cards with score less than 5</p>
              </div>
            </div>
            <button 
              onClick={startPractice}
              className={`${
                flashcards.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
              } text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg w-full`}
              disabled={flashcards.length === 0}
            >
              Start Practice
            </button>
            
            {flashcards.length === 0 && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-600">No flashcards available for practice.</p>
                <p className="text-sm text-gray-500 mt-2">Create some flashcards first to begin practicing.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {flashcards.length > 0 ? (
              <>
                <div className="mb-6 px-6 py-2 bg-blue-200 rounded-full text-blue-800 font-medium shadow-sm">
                  Card {currentCardIndex + 1} of {flashcards.length}
                </div>
                
                <div 
                  className="w-full max-w-lg transition-opacity duration-300 ease-in-out"
                  style={{ opacity: isTransitioning ? 0 : 1 }}
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
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:transform active:scale-95 flex items-center gap-2"
                    disabled={isTransitioning}
                  >
                    <span>Next Card</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}

                <div className="mt-10 p-6 bg-white rounded-xl shadow-md max-w-md w-full border border-blue-100">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Gesture Controls:
                  </h3>
                  <ul className="space-y-3 pl-2">
                    <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
                      <span className="mr-3 text-2xl">👍</span> 
                      <span>Thumbs Up = Rate as <span className="font-bold text-green-600">Easy</span></span>
                    </li>
                    <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
                      <span className="mr-3 text-2xl">✋</span> 
                      <span>Flat Hand = Rate as <span className="font-bold text-yellow-600">Hard</span></span>
                    </li>
                    <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
                      <span className="mr-3 text-2xl">✌️</span> 
                      <span>Victory Sign = Rate as <span className="font-bold text-red-600">Wrong</span></span>
                    </li>
                  </ul>
                  <div className="mt-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800">
                      Hold the gesture for 3 seconds to confirm your rating, or use the buttons below the card.
                    </p>
                    <p className="mt-2 text-sm text-blue-800 font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ratings can only be submitted after flipping the card.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg mb-6 text-gray-600">No flashcards available for practice.</p>
                <button
                  onClick={() => setDescShown(true)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center mx-auto gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PracticePage;