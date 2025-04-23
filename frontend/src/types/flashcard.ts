export interface Flashcard {
    id: string;
    front: string;
    back: string;
    tags: string[];
    hint?: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }