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
      <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
        <p>Error loading flashcards</p>
        <button 
          onClick={() => refetch()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a6fa5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>No flashcards found</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Flashcards</h2>
        <button 
          onClick={() => refetch()}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a6fa5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {flashcards.map((flashcard: Flashcard) => (
          <FlashcardItem key={flashcard.id} flashcard={flashcard} />
        ))}
      </div>
    </div>
  );
};

export default FlashcardList;