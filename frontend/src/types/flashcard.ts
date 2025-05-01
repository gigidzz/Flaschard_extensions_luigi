export interface Flashcard {
  id: string;
  front: string;
  back: string;
  tags: string[];
  hint?: string;
  point: number;
  createdAt?: string;
  updatedAt?: string;
}
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }