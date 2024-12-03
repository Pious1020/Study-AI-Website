import { FlashcardResponse, QuizResponse } from './types';

export function validateFlashcardResponse(data: unknown): data is FlashcardResponse {
  if (!data || typeof data !== 'object') {
    console.error('Invalid response: not an object');
    return false;
  }

  if (!('flashcards' in data)) {
    console.error('Invalid response: missing flashcards array');
    return false;
  }

  const response = data as FlashcardResponse;
  
  if (!Array.isArray(response.flashcards)) {
    console.error('Invalid response: flashcards is not an array');
    return false;
  }

  if (response.flashcards.length === 0) {
    console.error('Invalid response: empty flashcards array');
    return false;
  }

  return response.flashcards.every((card, index) => {
    if (!card || typeof card !== 'object') {
      console.error(`Invalid flashcard at index ${index}: not an object`);
      return false;
    }

    if (!('front' in card) || !('back' in card)) {
      console.error(`Invalid flashcard at index ${index}: missing front or back`);
      return false;
    }

    if (typeof card.front !== 'string' || typeof card.back !== 'string') {
      console.error(`Invalid flashcard at index ${index}: front or back is not a string`);
      return false;
    }

    if (!card.front.trim() || !card.back.trim()) {
      console.error(`Invalid flashcard at index ${index}: empty front or back`);
      return false;
    }

    return true;
  });
}

export function validateQuizResponse(data: unknown): data is QuizResponse {
  if (!data || typeof data !== 'object') {
    console.error('Invalid response: not an object');
    return false;
  }

  if (!('questions' in data)) {
    console.error('Invalid response: missing questions array');
    return false;
  }

  const response = data as QuizResponse;

  if (!Array.isArray(response.questions)) {
    console.error('Invalid response: questions is not an array');
    return false;
  }

  if (response.questions.length === 0) {
    console.error('Invalid response: empty questions array');
    return false;
  }

  return response.questions.every((question, index) => {
    if (!question || typeof question !== 'object') {
      console.error(`Invalid question at index ${index}: not an object`);
      return false;
    }

    if (!('question' in question) || !('options' in question) || !('correctAnswer' in question)) {
      console.error(`Invalid question at index ${index}: missing required fields`);
      return false;
    }

    if (typeof question.question !== 'string' || !question.question.trim()) {
      console.error(`Invalid question at index ${index}: invalid question text`);
      return false;
    }

    if (!Array.isArray(question.options)) {
      console.error(`Invalid question at index ${index}: options is not an array`);
      return false;
    }

    if (question.options.length < 2) {
      console.error(`Invalid question at index ${index}: insufficient options`);
      return false;
    }

    if (!question.options.every(opt => typeof opt === 'string' && opt.trim())) {
      console.error(`Invalid question at index ${index}: invalid option format`);
      return false;
    }

    if (
      typeof question.correctAnswer !== 'number' ||
      question.correctAnswer < 0 ||
      question.correctAnswer >= question.options.length
    ) {
      console.error(`Invalid question at index ${index}: invalid correctAnswer`);
      return false;
    }

    return true;
  });
}