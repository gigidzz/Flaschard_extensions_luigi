import express from 'express';
import { getAllFlashcards, getFlashcardsByTag } from '../controllers/flashcards.controller';

const router = express.Router();

router.get('/', getAllFlashcards);
router.get('/tag/:tag', getFlashcardsByTag);

export default router;
