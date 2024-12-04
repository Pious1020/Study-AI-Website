export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}
