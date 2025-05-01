import React from 'react';
import { useFlashcards, usePracticeFlashcards, useLearnedFlashcards } from '../hooks/useFlascards';
import FlashcardItem from './FlashcardItem';
import { Flashcard } from '../types/flashcard';
import { makeLearnedPractice } from '../api/flashcardApi';

interface FlashcardListProps {
  activeTab?: string;
  onRateCard?: (rating: 'wrong' | 'hard' | 'easy') => Promise<boolean>;
  onFlipChange?: (isFlipped: boolean) => void;
  onDeleteCard?: (id: string) => Promise<void>;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ 
  activeTab = 'all',
  onRateCard,
  onFlipChange
}) => {
  // Query for all flashcards
  const { 
    data: allFlashcards = [], 
    isLoading: isLoadingAll, 
    error: errorAll, 
    refetch: refetchAll 
  } = useFlashcards();
  
  // Query for practice flashcards
  const { 
    data: practiceFlashcards = [], 
    isLoading: isLoadingPractice, 
    error: errorPractice, 
    refetch: refetchPractice 
  } = usePracticeFlashcards();
  
  // Query for learned flashcards
  const { 
    data: learnedFlashcards = [], 
    isLoading: isLoadingLearned, 
    error: errorLearned, 
    refetch: refetchLearned 
  } = useLearnedFlashcards();
  
  // Determine which data to show based on active tab
  const getActiveData = () => {
    switch (activeTab) {
      case 'learned':
        return {
          flashcards: learnedFlashcards,
          isLoading: isLoadingLearned,
          error: errorLearned,
          refetch: refetchLearned
        };
      case 'practice':
        return {
          flashcards: practiceFlashcards,
          isLoading: isLoadingPractice,
          error: errorPractice,
          refetch: refetchPractice
        };
      case 'all':
      default:
        return {
          flashcards: allFlashcards,
          isLoading: isLoadingAll,
          error: errorAll,
          refetch: refetchAll
        };
    }
  };
  
  const { flashcards, isLoading, error, refetch } = getActiveData();

  // Handle deletion and refetch the appropriate data
  const handleDelete = async (id: string) => {
    
    try {
      await makeLearnedPractice(id);
      // After successful deletion, refetch the current list
      refetch();
    } catch (error) {
      console.error("Error in FlashcardList while deleting:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-3 text-gray-600">Loading flashcards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error loading flashcards</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">No flashcards found</p>
        {activeTab === 'learned' && (
          <p className="text-sm text-gray-400 mt-2">
            Cards with points above 5 will appear here once you've practiced
          </p>
        )}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'>
      {flashcards.map((flashcard: Flashcard) => (
        <FlashcardItem 
          key={flashcard.id} 
          flashcard={flashcard}
          onRateCard={onRateCard} // Pass through rating prop if it exists
          onFlipChange={onFlipChange} // Pass through flip change prop
          onDelete={handleDelete} // Only pass delete handler if the prop exists
        />
      ))}
    </div>
  );
};

export default FlashcardList;