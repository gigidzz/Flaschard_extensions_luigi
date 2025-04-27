import * as dotenv from 'dotenv';
dotenv.config({path: '.env.test'});

import express, { Request, Response } from "express";
import cors from "cors";
import { supabase } from "./utils/supabase";
import { Flashcard } from "./logic/flashcard";
import { ApiResponse, CreateFlashcardRequest } from "./types/req-res-types";


// Create Express app instance
const app = express();
const PORT = process.env.PORT;

// Enable Cross-Origin Resource Sharing (CORS) for localhost:3001
app.use(cors({
  origin: 'http://localhost:3001', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Supported methods
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());

/**
 * Fetch all flashcards from Supabase
 * @spec.requires The server must be running and connected to Supabase with valid environment variables.
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
 * @spec.requires The server must be running and connected to Supabase with valid environment variables.
 */
app.get('/api/flashcards/tag/:tag', async (
  req: Request<{ tag: string }>, 
  res: Response<ApiResponse<Flashcard[]>>
) => {
  try {
    //თაგს url-ში ვატან და ამიტომ ესე უნდა ამოვიღო
    const tag: string = req.params.tag;
    
    //სუპაბაზიდან დათის ამოღება თაგის მიხედვით და რადგან tags array-ია 
    // ამიტომ ამ ფუნქციით ვნახულობთ შეიცავს თუ არა ამ კონკრეტულ თაგს
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .contains('tags', [tag]);
    
    if (error) throw error;
    
    //დათაბაზიდან მირებული ინფორმაციის flashcard-ებად დამაპვა
    const flashcards = data.map(card => 
      new Flashcard(
        card.front, 
        card.back, 
        card.tags || [],
        card.hint,
        card.id,
      )
    );

    //რესპონსის გაგზავნა
    res.status(200).json({ success: true, data: flashcards });
  } catch (error: any) {
    //if error send შესაბამისი error
    console.error('Error fetching flashcards by tag:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcards by tag' });
  }
});

// Create a new flashcard
app.post('/api/flashcards', async (
  req: Request<{}, {}, CreateFlashcardRequest>, 
  res: Response<ApiResponse<any>>
): Promise<any> => {
  try {
    //get flashcard attributes from request body
    const { front, back, hint, tags }: CreateFlashcardRequest = req.body;
    
    //if there is no back we return error as back is required
    if (!back) {
      return res.status(400).json({ success: false, error: 'back of flashcard are required' });
    }

    const newFlashCard: Flashcard = { front, back, hint, tags:tags || [] }
    
    //insertion in supabase database
    const { data, error } = await supabase
      .from('flashcards')
      .insert([
        newFlashCard
      ])
      .select();
    
    if (error) throw error;
    
    //send response and sent addedflashcard
    res.status(201).json({ 
      success: true, 
      message: 'Flashcard created successfully', 
      data: data[0]
    });
  } catch (error: any) {
    //if error send შესაბამისი error
    console.error('Error creating flashcard:', error);
    res.status(500).json({ success: false, error: 'Failed to create flashcard' });
  }
});


// Delete a flashcard
app.delete('/api/flashcards/:id', async (
  req: Request<{ id: string }>, 
  res: Response<ApiResponse<void>>
) => {
  try {
    //get id from params
    const { id } = req.params;
    
    //run deletion function
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .match({ id });
    
    if (error) throw error;
    
    //send response
    res.status(200).json({ 
      success: true, 
      message: 'Flashcard deleted successfully' 
    });
  } catch (error: any) {
    //if error send შესაბამისი error
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ success: false, error: 'Failed to delete flashcard' });
  }
});


//our app should listen port so we can get requests
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
}

export { app };
