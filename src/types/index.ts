export interface FlashCard {
  id: string;
  front: string;
  back: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface StudySet {
  id: string;
  title: string;
  description: string;
  flashcards: FlashCard[];
  quiz: Quiz;
}