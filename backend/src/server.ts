import * as dotenv from 'dotenv';
dotenv.config({path: '.env.test'});

import { RequestHandler } from 'express';
import express, { Request, Response } from "express";
import cors from "cors";
import { supabase } from "./utils/supabase";
import { Flashcard } from "./logic/flashcard";
import { ApiResponse, CreateFlashcardRequest, UpdateDifficultyRequest } from "./types/req-res-types";
import { DifficultyLevel } from './types/enum-types';
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
  origin: 'http://localhost:3001', // Allow only this origin
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Supported methods
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use('/api/flashcards', flashcardRoutes);


// /**
//  * Fetch all flashcards from the database
//  * 
//  * @route GET /api/flashcards
//  * @returns {Promise<ApiResponse<Flashcard[]>>} Array of flashcard objects with success status
//  * @throws {Error} If database connection fails or query execution fails
//  * @spec.requires The server must be running and connected to Supabase with valid environment variables
//  * @spec.ensures Returns all flashcards from the database as Flashcard instances
//  */
// app.get('/api/flashcards', async (req: Request, res: Response<ApiResponse<Flashcard[]>>) => {
//   try {
//     // Fetch data from Supabase
//     const { data, error } = await supabase
//       .from('flashcards')
//       .select('*');
    
//     if (error) throw error;

//     // Map Supabase data to Flashcard class instances
//     const flashcards = data.map(card => 
//       new Flashcard(
//         card.front, 
//         card.back, 
//         card.tags || [],
//         card.hint, 
//         card.id,
//       )
//     );

//     // Send the response with status 200 and the fetched flashcards
//     res.status(200).json({ success: true, data: flashcards });
//   } catch (error: any) {
//     // Catch errors and send a 500 error response
//     console.error('Error fetching flashcards:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch flashcards' });
//   }
// });

// /**
//  * Fetch flashcards filtered by tag
//  * 
//  * @route GET /api/flashcards/tag/:tag
//  * @param {string} req.params.tag - The tag to filter flashcards by
//  * @returns {Promise<ApiResponse<Flashcard[]>>} Array of matching flashcard objects with success status
//  * @throws {Error} If database connection fails or query execution fails
//  * @spec.requires The server must be running and connected to Supabase with valid environment variables
//  * @spec.ensures Returns all flashcards that contain the specified tag
//  */
// app.get('/api/flashcards/tag/:tag', async (
//   req: Request<{ tag: string }>, 
//   res: Response<ApiResponse<Flashcard[]>>
// ) => {
//   try {
//     //Get the tag from URL parameters
//     const tag: string = req.params.tag;
    
//     //Query Supabase for flashcards containing the specified tag
//     const { data, error } = await supabase
//       .from('flashcards')
//       .select('*')
//       .contains('tags', [tag]);
    
//     if (error) throw error;
    
//     //Map database results to Flashcard instances
//     const flashcards = data.map(card => 
//       new Flashcard(
//         card.front, 
//         card.back, 
//         card.tags || [],
//         card.hint,
//         card.id,
//       )
//     );

//     //Send response
//     res.status(200).json({ success: true, data: flashcards });
//   } catch (error: any) {
//     //Handle and log errors
//     console.error('Error fetching flashcards by tag:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch flashcards by tag' });
//   }
// });

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
 * @route DELETE /api/flashcard/:id
 * @param {string} req.params.id - The ID of the flashcard to delete
 * @returns {Promise<ApiResponse<void>>} Success message with no data
 * @throws {Error} If database connection fails or delete operation fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.requires The ID parameter must correspond to an existing flashcard
 * @spec.ensures The specified flashcard is removed from the database if it exists
 */
app.delete('/api/flashcard/:id', async (
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
 * get a flashcard by its ID
 * 
 * @route GET /api/flashcard/:id
 * @param {string} req.params.id - The ID of the flashcard to get
 * @returns {Promise<ApiResponse<void>>} Success message with data of flashcard
 * @throws {Error} If database connection fails or get operation fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.requires The ID parameter must correspond to an existing flashcard
 * @spec.ensures The specified flashcard is fetched from the database if it exists
 */
app.get('/api/flashcard/:id', async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse<void>>
) => {
  try {
    //Extract ID from URL parameters
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    //Send success response
    res.status(200).json({ 
      success: true,
      data:data,
      message: 'Flashcard fetched successfully' 
    });
  } catch (error: any) {
    //Handle and log errors
    console.error('Error fetching flashcard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcard' });
  }
});

/**
 * Fetch flashcards with points less than 5
 * 
 * @route GET /api/flashcards/practice
 * @returns {ApiResponse<Flashcard[]>} Array of flashcard objects with points below 5
 * @throws {Error} If database connection fails or query execution fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.ensures Returns only flashcards with points less than 5
 * @spec.ensures Flashcards without points defined will be excluded from results
 */
app.get('/api/flashcards/practice', async (req: Request, res: Response<ApiResponse<Flashcard[]>>) => {
  try {
    // Define the point threshold
    const pointThreshold = 5;

    // Fetch data from Supabase with point filter
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .lt('point', pointThreshold)  // Filter for points less than 5
      
    if (error) throw error;
    
    // Map Supabase data to Flashcard class instances
    const flashcards = data.map(card =>
      new Flashcard(
        card.front,
        card.back,
        card.tags || [],
        card.hint,
        card.id,
        card.point
      )
    );
    
    // Send the response with status 200 and the fetched flashcards
    res.status(200).json({ 
      success: true, 
      data: flashcards,
      message: `Retrieved ${flashcards.length} flashcards with points less than 5`
    });
  } catch (error: any) {
    // Catch errors and send a 500 error response
    console.error('Error fetching low-point flashcards:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch low-point flashcards',
      message: error.message || 'An unexpected error occurred'
    });
  }
});



/**
 * Update the difficulty level and points of a flashcard.
 *
 * @route PATCH /api/flashcards/update-difficulty
 * @param {number} id - The ID of the flashcard to update (from request body)
 * @param {'easy' | 'hard' | 'wrong'} difficulty_level - The new difficulty level
 * @returns {ApiResponse<Flashcard>} - The updated flashcard object
 *
 * @spec.requires Request body must contain valid `id` and a `difficulty_level` string
 * @spec.requires Supabase must be running and properly configured with env variables
 * @spec.ensures If difficulty_level is 'easy', adds 2 points; 'hard' adds 1 point; 'wrong' resets to 0
 * @spec.ensures Flashcard's `difficulty_level` and `point` fields are updated accordingly
 * @spec.ensures Returns updated flashcard on success, with HTTP 200
 * @spec.raises 400 if request is invalid; 500 if database query fails or flashcard not found
 */

const updateFlashcardDifficulty: RequestHandler = async (req, res, next) => {
  try {
    const { id, difficulty_level } = req.body as UpdateDifficultyRequest;
    
    const difficultyToPoint = {
      easy: 2,
      hard: 1,
      wrong: 0,
    };
    
    if (!id || !(difficulty_level in difficultyToPoint)) {
      res.status(400).json({
        success: false,
        message: 'Invalid request: id and difficulty_level are required',
      });
      return; 
    }
    
    const { data: existingFlashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('point')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      res.status(500).json({
        success: false,
        error: fetchError.message,
        message: 'Failed to fetch flashcard in updating',
      });
      return;
    }
    
    // Handle points calculation
    let newPoints: number;
    
    if (difficulty_level === 'wrong') {
      newPoints = 0;
    } else {
      // Get current points or default to 0
      const currentPoints = existingFlashcard?.point || 0;
      newPoints = currentPoints + difficultyToPoint[difficulty_level];
    }
        
    const { data, error } = await supabase
      .from('flashcards')
      .update({ point: newPoints, difficulty_level })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      res.status(500).json({
        success: false,
        error: error?.message || 'Flashcard not found',
        message: 'Failed to update flashcard',
      });
      return;
    }
     
    res.status(200).json({
      success: true,
      data: data,
      message: 'Flashcard updated successfully',
    });
  } catch (err) {
    console.error('Error updating flashcard:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err),
      message: 'Internal server error',
    });
  }
};

app.patch('/api/flashcards/update-difficulty', updateFlashcardDifficulty);

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