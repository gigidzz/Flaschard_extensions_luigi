import * as dotenv from 'dotenv';
dotenv.config({path: '.env.test'});

import express from "express";
import cors from "cors";
import flashcardRoutes from './routes/flashcard.routes';

/**
 * Express application instance
 * @type {express.Application}
 */
const app = express();
const PORT = process.env.PORT;

/**
 * Configure CORS for the application
 * @spec.requires Environment with proper CORS policies
 * @spec.ensures Only localhost:3001 can access the API with specified methods
 */
app.use(cors({
  origin: process.env.EXCEPTING_URL, // Allow only this origin
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Supported methods
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());

/**
 * Flashcard routes
 * Routes are defined in ./routes/flashcard.routes.ts 
 * Controllers are defined in ./controllers/flashcard.controller.ts
 */
app.use('/api/flashcards', flashcardRoutes);

// For legacy route compatibility
import { deleteFlashcard, getFlashcardById } from './controllers/flashcards.controller';
app.delete('/api/flashcard/:id', deleteFlashcard);
app.get('/api/flashcard/:id', getFlashcardById);

/**
 * Start the Express server if this file is run directly
 * 
 * @spec.requires Valid PORT environment variable must be set
 * @spec.ensures Server listens on the specified port and logs a startup message
 */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
}

export { app };