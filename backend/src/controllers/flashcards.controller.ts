import { RequestHandler } from 'express';
import { supabase } from "../utils/supabase";
import { Flashcard } from "../logic/flashcard";
import { ApiResponse, CreateFlashcardRequest, UpdateDifficultyRequest } from "../types/req-res-types";
import { DifficultyLevel } from '../types/enum-types';

/**
 * Fetch all flashcards from the database
 * 
 * @route GET /api/flashcards
 * @returns {Promise<ApiResponse<Flashcard[]>>} Array of flashcard objects with success status
 * @throws {Error} If database connection fails or query execution fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.ensures Returns all flashcards from the database as Flashcard instances
 */
export const getAllFlashcards: RequestHandler = async (req, res) => {
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
export const getFlashcardsByTag: RequestHandler = async (req, res) => {
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
};

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
export const createFlashcard: RequestHandler = async (req, res):Promise<any> => {
  try {
    //Extract flashcard attributes from request body
    const { front, back, hint, tags } = req.body as CreateFlashcardRequest;
    
    //Validate required fields
    if (!back) {
      return res.status(400).json({ success: false, error: 'back of flashcard are required' });
    }

    const newFlashCard: Flashcard = { front, back, hint, tags: tags || [] };
    
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
};

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
export const deleteFlashcard: RequestHandler = async (req, res) => {
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
};

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
export const getFlashcardById: RequestHandler = async (req, res) => {
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
      data: data,
      message: 'Flashcard fetched successfully' 
    });
  } catch (error: any) {
    //Handle and log errors
    console.error('Error fetching flashcard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcard' });
  }
};

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
export const getFlashcardsForPractice: RequestHandler = async (req, res) => {
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
};

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
export const updateFlashcardDifficulty: RequestHandler = async (req, res) => {
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
      .select('*')  // Select all fields to ensure we get any existing point value
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
    
    if (!existingFlashcard) {
      res.status(404).json({
        success: false,
        error: 'Flashcard not found',
        message: 'No flashcard found with the provided ID',
      });
      return;
    }
    
    // Handle points calculation
    let newPoints: number;
    
    if (difficulty_level === 'wrong') {
      newPoints = 0;
    } else {
      // Get current points or default to 0
      const currentPoints = existingFlashcard.point !== undefined ? existingFlashcard.point : 0;
      newPoints = currentPoints + difficultyToPoint[difficulty_level as keyof typeof difficultyToPoint];
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

/**
 * Fetch flashcards with points greater than or equal to 5
 * 
 * @route GET /api/flashcards/mastered
 * @returns {ApiResponse<Flashcard[]>} Array of flashcard objects with points 5 or higher
 * @throws {Error} If database connection fails or query execution fails
 * @spec.requires The server must be running and connected to Supabase with valid environment variables
 * @spec.ensures Returns only flashcards with points greater than or equal to 5
 * @spec.ensures Flashcards without points defined will be excluded from results
 */
export const getMasteredFlashcards: RequestHandler = async (req, res) => {
    try {
      // Define the point threshold
      const pointThreshold = 5;
  
      // Fetch data from Supabase with point filter
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .gte('point', pointThreshold)  // Filter for points greater than or equal to 5
        
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
        message: `Retrieved ${flashcards.length} mastered flashcards with points greater than or equal to 5`
      });
    } catch (error: any) {
      // Catch errors and send a 500 error response
      console.error('Error fetching mastered flashcards:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch mastered flashcards',
        message: error.message || 'An unexpected error occurred'
      });
    }
  };