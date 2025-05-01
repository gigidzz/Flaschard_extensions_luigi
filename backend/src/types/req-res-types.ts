import { DifficultyLevel } from "./enum-types";

//to create flashcards i need this attributes
export interface CreateFlashcardRequest {
    front: string;
    back: string;
    hint?: string;
    tags?: string[];
  }
  
//my response from my api routes should be in this 
// format as i have success boolean from which i get if 
// request was successful i have data as at some points i need 
// to send data as a response i have error ro return error and i
//  have message for like a description of the error or something and also i use 
// regex for easy modifications
 export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }

  export interface UpdateDifficultyRequest {
    id: number;
    difficulty_level: DifficultyLevel;
  }
  