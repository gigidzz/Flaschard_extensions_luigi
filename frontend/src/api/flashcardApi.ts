import axios from 'axios';
import { ApiResponse, Flashcard } from '../types/flashcard';

export const fetchFlashcards = async (): Promise<Flashcard[]> => {
  const response = await axios.get<ApiResponse<Flashcard[]>>(`${import.meta.env.VITE_API_URL}/api/flashcards`);
  
  console.log(response,' resssss')
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch flashcards');
  }
  
  return response.data.data;
};


export const fetchPracticeFlashcards = async (): Promise<Flashcard[]> => {
  const response = await axios.get<ApiResponse<Flashcard[]>>(`${import.meta.env.VITE_API_URL}/api/flashcards/practice`);
  
  console.log(response,' resssss2')
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to fetch flashcards');
  }
  
  return response.data.data;
};