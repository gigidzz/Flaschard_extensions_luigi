export type GestureName = 'thumbs_up' | 'flat_hand' | 'victory';

export interface ImageMap {
  [key: string]: string;
}

export interface GestureRecognitionProps {
  onGestureDetected: (gesture: 'wrong' | 'hard' | 'easy') => void;
  isEnabled: boolean;
}