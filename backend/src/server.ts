import express, { Request, Response } from "express";
import cors from "cors";
import { supabase } from "./utils/supabase";
import { Flashcard } from "./logic/flashcard";
import { ApiResponse, CreateFlashcardRequest } from "./types/req-res-types";

//express აპის შექმნა 
const app = express();
const PORT = process.env.PORT || 3001;

//მხოლოდ localhost:3000-დან რომ მიიღოს რექუესთები
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// ყველა flashcard ის დაfetchვა
app.get('/api/flashcards', async (req: Request, res: Response<ApiResponse<Flashcard[]>>) => {
  try {
    //სუპაბაზიდან დათის ამოღება
    const { data, error } = await supabase
      .from('flashcards')
      .select('*');
    
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

    //რესფონსის გაგზავნა
    res.status(200).json({ success: true, data: flashcards });
  } catch (error: any) {
    //if error send შესაბამისი error
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch flashcards' });
  }
});

//თაგის მიხედვით flashcard-ების მიღება
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

//ახალი flashcard-ის შექმნა
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
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});