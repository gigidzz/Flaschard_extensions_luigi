import React from 'react';

interface RatingConfirmationProps {
  selectedRating: 'wrong' | 'hard' | 'easy' | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const RatingConfirmation: React.FC<RatingConfirmationProps> = ({
  selectedRating,
  onConfirm,
  onCancel
}) => {
  const ratingColors = {
    wrong: 'text-red-600',
    hard: 'text-yellow-600',
    easy: 'text-green-600'
  };

  return (
    <div className="absolute bottom-4 w-full flex flex-col items-center space-y-3 px-4">
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 w-full max-w-xs">
        <p className="text-center text-gray-700 mb-2">
          Confirm rating as: 
          <span className={`font-medium ml-1 ${selectedRating ? ratingColors[selectedRating] : ''}`}>
            {selectedRating && selectedRating?.charAt(0).toUpperCase() + selectedRating?.slice(1)}
          </span>
        </p>
        
        <div className="flex justify-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingConfirmation;