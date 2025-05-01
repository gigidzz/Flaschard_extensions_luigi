import { Router } from 'express';
import {
  getAllFlashcards,
  getFlashcardsByTag,
  createFlashcard,
  deleteFlashcard,
  getFlashcardById,
  getFlashcardsForPractice,
  updateFlashcardDifficulty,
  getMasteredFlashcards
} from '../controllers/flashcards.controller';

const router = Router();

/**
 * @route GET /api/flashcards
 * @description Get all flashcards
 */
router.get('/', getAllFlashcards);

/**
 * @route GET /api/flashcards/tag/:tag
 * @description Get flashcards by tag
 */
router.get('/tag/:tag', getFlashcardsByTag);

/**
 * @route GET /api/flashcards/practice
 * @description Get flashcards with points less than 5 for practice
 */
router.get('/practice', getFlashcardsForPractice);

/**
 * @route POST /api/flashcards
 * @description Create a new flashcard
 */
router.post('/', createFlashcard);

/**
 * @route DELETE /api/flashcard/:id
 * @description Delete a flashcard by ID
 */
router.delete('/:id', deleteFlashcard);

/**
 * For legacy route compatibility
 * @route DELETE /api/flashcard/:id
 */
router.all('/api/flashcard/:id', (req, res, next) => {
  if (req.method === 'DELETE') {
    return deleteFlashcard(req, res, next);
  }
  next();
});

/**
 * @route GET /api/flashcards/mastered
 * @description Get flashcards with points greater than or equal to 5 (mastered cards)
 */
router.get('/mastered', getMasteredFlashcards);

/**
 * @route GET /api/flashcards/:id
 * @description Get a flashcard by ID
 */
router.get('/:id', getFlashcardById);

/**
 * @route PATCH /api/flashcards/update-difficulty
 * @description Update difficulty level and points of a flashcard
 */
router.patch('/update-difficulty', updateFlashcardDifficulty);





export default router;