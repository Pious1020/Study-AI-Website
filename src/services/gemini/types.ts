export interface FlashcardResponse {
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

export interface QuizResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export interface GenerationError extends Error {
  code?: string;
  details?: unknown;
}