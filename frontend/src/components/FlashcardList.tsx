import React from 'react';
import { useFlashcards } from '../hooks/useFlascards';
import FlashcardItem from './FlashcardItem';
import { Flashcard } from '../types/flashcard';

const FlashcardList: React.FC = () => {
  const { data: flashcards = [], isLoading, error, refetch } = useFlashcards();

  function goToPractice(e: any) {
    e.preventDefault();
    console.log('go to practice')
  }

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
    <div>
      <div className='flex justify-between'>
        <h2 className='text-4xl'>Flashcards</h2>
        <button 
          onClick={(e) => goToPractice(e)}
          className='bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded'
        >
          go to practice
        </button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {flashcards.map((flashcard: Flashcard) => (
          <FlashcardItem key={flashcard.id} flashcard={flashcard} />
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;