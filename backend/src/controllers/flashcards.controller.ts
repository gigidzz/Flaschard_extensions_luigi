import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import { Flashcard } from '../logic/flashcard';
import { ApiResponse } from '../types/req-res-types';

/**
 * Fetch all flashcards from the database
 *
 * @route GET /api/flashcards
 * @returns {Promise<ApiResponse<Flashcard[]>>} Array of flashcard objects with success status
 * @throws {Error} If database connection fails or query execution fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.ensures Returns all flashcards from the database as Flashcard instances
 */
export const getAllFlashcards = async (
  req: Request,
  res: Response<ApiResponse<Flashcard[]>>
) => {
  try {
    const { data, error } = await supabase.from('flashcards').select('*');
    if (error) throw error;

    const flashcards = data.map(card =>
      new Flashcard(card.front, card.back, card.tags || [], card.hint, card.id)
    );

    res.status(200).json({ success: true, data: flashcards });
  } catch (error: any) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcards' });
  }
};

/**
 * Fetch flashcards filtered by tag
 *
 * @route GET /api/flashcards/tag/:tag
 * @param {string} req.params.tag - The tag to filter flashcards by
 * @returns {Promise<ApiResponse<Flashcard[]>>} Array of matching flashcard objects with success status
 * @throws {Error} If database connection fails or query execution fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.ensures Returns all flashcards that contain the specified tag
 */
export const getFlashcardsByTag = async (
  req: Request<{ tag: string }>,
  res: Response<ApiResponse<Flashcard[]>>
) => {
  try {
    const tag = req.params.tag;

    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .contains('tags', [tag]);

    if (error) throw error;

    const flashcards = data.map(card =>
      new Flashcard(card.front, card.back, card.tags || [], card.hint, card.id)
    );

    res.status(200).json({ success: true, data: flashcards });
  } catch (error: any) {
    console.error('Error fetching flashcards by tag:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcards by tag' });
  }
};
