type FlashcardHeaderProps = {
  currentCardIndex: number;
  totalCards: number;
};

export default function FlashcardHeader({ currentCardIndex, totalCards }: FlashcardHeaderProps) {
  return (
    <div className="mb-6 px-6 py-2 bg-blue-200 rounded-full text-blue-800 font-medium shadow-sm">
      Card {currentCardIndex + 1} of {totalCards}
    </div>
  );
}