import { Timestamp, DocumentData } from 'firebase/firestore';

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// The base study set without timestamps
export interface StudySetContent {
  userId: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  flashcards: Flashcard[];
  quiz: {
    questions: QuizQuestion[];
  };
}

// The complete study set with timestamps for Firestore
export interface StudySet extends StudySetContent, DocumentData {
  id?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}