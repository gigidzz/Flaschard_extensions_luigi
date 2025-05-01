import React from 'react';
import { useFlashcards } from '../hooks/useFlascards';
import FlashcardItem from './FlashcardItem';
import { Flashcard } from '../types/flashcard';

const FlashcardList: React.FC = () => {
  const { data: flashcards = [], isLoading, error, refetch } = useFlashcards();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Loading flashcards...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>Error loading flashcards</p>
        <button 
          onClick={() => refetch()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div>
        <p>No flashcards found</p>
      </div>
    );
  }

  return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12'>
        {flashcards.map((flashcard: Flashcard) => (
          <FlashcardItem key={flashcard.id} flashcard={flashcard} />
        ))}
      </div>
  );
};

export default FlashcardList;