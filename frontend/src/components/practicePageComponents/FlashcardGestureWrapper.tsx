import GestureRecognition from "../GestureRecognition";

type FlashcardGestureWrapperProps = {
  onGestureDetected: (rating: 'wrong' | 'hard' | 'easy') => void;
  isEnabled: boolean;
};

export default function FlashcardGestureWrapper({ 
  onGestureDetected, 
  isEnabled 
}: FlashcardGestureWrapperProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <GestureRecognition 
        onGestureDetected={onGestureDetected}
        isEnabled={isEnabled}
      />
    </div>
  );
}