import { GoogleGenerativeAI } from '@google/generative-ai';
import { Flashcard, QuizQuestion } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface FormData {
  topic: string;
  subject: string;
  difficulty: string;
  additionalInfo: string;
  numberOfQuestions: number;
}

interface FlashcardResponse {
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

interface QuizResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

function cleanJsonResponse(text: string): string {
  return text.replace(/```(json|JSON)?\n?|\n?```/g, '').trim();
}

export async function generateFlashcards(formData: FormData): Promise<Flashcard[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate ${formData.numberOfQuestions} comprehensive flashcards for studying ${formData.topic} in ${formData.subject} at a ${formData.difficulty} level.
    ${formData.additionalInfo ? `Additional context: ${formData.additionalInfo}` : ''}
    
    Return ONLY a JSON object in this exact format without any markdown:
    {
      "flashcards": [
        { "front": "question/term", "back": "detailed answer/definition" }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = cleanJsonResponse(text);
    
    try {
      const parsed = JSON.parse(cleanJson) as FlashcardResponse;
      return parsed.flashcards.map(card => ({
        question: card.front,
        answer: card.back
      }));
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned JSON string:', cleanJson);
      throw new Error('Failed to parse the AI response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards. Please try again.');
  }
}

export async function generateQuiz(formData: FormData): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Create a challenging quiz about ${formData.topic} in ${formData.subject} at a ${formData.difficulty} level.
    ${formData.additionalInfo ? `Additional context: ${formData.additionalInfo}` : ''}
    
    Create ${formData.numberOfQuestions} multiple choice questions that test deep understanding. The questions should be related to the flashcards and cover similar concepts.
    Return ONLY a JSON object in this exact format without any markdown:
    {
      "questions": [
        {
          "question": "detailed question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": 0,
          "explanation": "detailed explanation of why this is the correct answer"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = cleanJsonResponse(text);
    
    try {
      const parsed = JSON.parse(cleanJson) as QuizResponse;
      return parsed.questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer] // Convert index to actual answer
      }));
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Cleaned JSON string:', cleanJson);
      throw new Error('Failed to parse the AI response. Please try again.');
    }
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz. Please try again.');
  }
}