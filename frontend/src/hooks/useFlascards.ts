import { useQuery } from '@tanstack/react-query';
import { fetchFlashcards, fetchPracticeFlashcards } from '../api/flashcardApi';
import { Flashcard } from '../types/flashcard';

export function useFlashcards() {
  return useQuery<Flashcard[]>({
    queryKey: ['flashcards'],
    queryFn: fetchFlashcards,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes (formerly cacheTime)
  });
}

export function usePracticeFlashcards() {
  return useQuery<Flashcard[]>({
    queryKey: ['practiceFlashcards'],
    queryFn: fetchPracticeFlashcards,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes (formerly cacheTime)
  });
}

