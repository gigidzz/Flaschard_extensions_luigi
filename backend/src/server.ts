import * as dotenv from 'dotenv';
dotenv.config({path: '.env.test'});

import express, { Request, Response } from "express";
import cors from "cors";
import { supabase } from "./utils/supabase";
import { Flashcard } from "./logic/flashcard";
import { ApiResponse, CreateFlashcardRequest } from "./types/req-res-types";


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
  origin: 'http://localhost:3001', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Supported methods
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());

/**
 * Fetch all flashcards from the database
 * 
 * @route GET /api/flashcards
 * @returns {Promise<ApiResponse<Flashcard[]>>} Array of flashcard objects with success status
 * @throws {Error} If database connection fails or query execution fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.ensures Returns all flashcards from the database as Flashcard instances
 */
app.get('/api/flashcards', async (req: Request, res: Response<ApiResponse<Flashcard[]>>) => {
  try {
    // Fetch data from Supabase
    const { data, error } = await supabase
      .from('flashcards')
      .select('*');
    
    if (error) throw error;

    // Map Supabase data to Flashcard class instances
    const flashcards = data.map(card => 
      new Flashcard(
        card.front, 
        card.back, 
        card.tags || [],
        card.hint, 
        card.id,
      )
    );

    // Send the response with status 200 and the fetched flashcards
    res.status(200).json({ success: true, data: flashcards });
  } catch (error: any) {
    // Catch errors and send a 500 error response
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcards' });
  }
});

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
app.get('/api/flashcards/tag/:tag', async (
  req: Request<{ tag: string }>, 
  res: Response<ApiResponse<Flashcard[]>>
) => {
  try {
    //Get the tag from URL parameters
    const tag: string = req.params.tag;
    
    //Query Supabase for flashcards containing the specified tag
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .contains('tags', [tag]);
    
    if (error) throw error;
    
    //Map database results to Flashcard instances
    const flashcards = data.map(card => 
      new Flashcard(
        card.front, 
        card.back, 
        card.tags || [],
        card.hint,
        card.id,
      )
    );

    //Send response
    res.status(200).json({ success: true, data: flashcards });
  } catch (error: any) {
    //Handle and log errors
    console.error('Error fetching flashcards by tag:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcards by tag' });
  }
});

/**
 * Create a new flashcard in the database
 * 
 * @route POST /api/flashcards
 * @param {CreateFlashcardRequest} req.body - The flashcard data to create
 * @param {string} req.body.front - The front text of the flashcard
 * @param {string} req.body.back - The back text of the flashcard (required)
 * @param {string} [req.body.hint] - Optional hint for the flashcard
 * @param {string[]} [req.body.tags] - Optional array of tags for categorizing the flashcard
 * @returns {Promise<ApiResponse<Flashcard>>} Created flashcard with success status
 * @throws {Error} If validation fails or database operations fail
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.requires The request body must contain at least the 'back' field
 * @spec.ensures A new flashcard is created in the database with the provided data
 */
app.post('/api/flashcards', async (
  req: Request<{}, {}, CreateFlashcardRequest>, 
  res: Response<ApiResponse<any>>
): Promise<any> => {
  try {
    //Extract flashcard attributes from request body
    const { front, back, hint, tags }: CreateFlashcardRequest = req.body;
    
    //Validate required fields
    if (!back) {
      return res.status(400).json({ success: false, error: 'back of flashcard are required' });
    }

    const newFlashCard: Flashcard = { front, back, hint, tags: tags || [] }
    
    //Insert into Supabase database
    const { data, error } = await supabase
      .from('flashcards')
      .insert([
        newFlashCard
      ])
      .select();
    
    if (error) throw error;
    
    //Send success response with the created flashcard
    res.status(201).json({ 
      success: true, 
      message: 'Flashcard created successfully', 
      data: data[0]
    });
  } catch (error: any) {
    //Handle and log errors
    console.error('Error creating flashcard:', error);
    res.status(500).json({ success: false, error: 'Failed to create flashcard' });
  }
});

/**
 * Delete a flashcard by its ID
 * 
 * @route DELETE /api/flashcards/:id
 * @param {string} req.params.id - The ID of the flashcard to delete
 * @returns {Promise<ApiResponse<void>>} Success message with no data
 * @throws {Error} If database connection fails or delete operation fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.requires The ID parameter must correspond to an existing flashcard
 * @spec.ensures The specified flashcard is removed from the database if it exists
 */
app.delete('/api/flashcards/:id', async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse<void>>
) => {
  try {
    //Extract ID from URL parameters
    const { id } = req.params;
    
    //Execute deletion in database
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .match({ id });
    
    if (error) throw error;
    
    //Send success response
    res.status(200).json({ 
      success: true, 
      message: 'Flashcard deleted successfully' 
    });
  } catch (error: any) {
    //Handle and log errors
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ success: false, error: 'Failed to delete flashcard' });
  }
});

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