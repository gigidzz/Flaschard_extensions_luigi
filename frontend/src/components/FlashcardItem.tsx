import React, { useState } from 'react';
import { Flashcard } from '../types/flashcard';

interface FlashcardItemProps {
  flashcard: Flashcard;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setShowHint(false);
  };

  const toggleHint = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHint(!showHint);
  };

  return (
    <div 
      className="flashcard" 
      onClick={flipCard}
      style={{
        width: '300px',
        height: '200px',
        perspective: '1000px',
        margin: '15px',
        cursor: 'pointer',
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          borderRadius: '10px',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '10px',
          }}
        >
          <h3>{flashcard.front}</h3>
          {flashcard.hint && (
            <button 
              onClick={toggleHint}
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                color: '#4a6fa5',
                cursor: 'pointer',
              }}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
          {showHint && flashcard.hint && (
            <div 
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '10px',
                backgroundColor: '#f9f9f9',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '0.8rem',
              }}
            >
              {flashcard.hint}
            </div>
          )}
          {flashcard.tags.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
              }}
            >
              {flashcard.tags.map((tag, index) => (
                <span 
                  key={index}
                  style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#e0e0e0',
                    padding: '2px 8px',
                    borderRadius: '10px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '10px',
          }}
        >
          <p>{flashcard.back}</p>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;