import { GoogleGenerativeAI } from '@google/generative-ai';
import { Flashcard, QuizQuestion } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file.');
}

export const genAI = new GoogleGenerativeAI(API_KEY);

interface FormData {
  topic: string;
  subject: string;
  difficulty: string;
  additionalInfo?: string;
  description?: string;
  numberOfQuestions: number;
}

interface FlashcardResponse {
  flashcards: Array<{
    question: string;
    answer: string;
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
  // Remove code block markers
  let cleaned = text.replace(/```(json|JSON)?\n?|\n?```/g, '').trim();
  
  // Remove any special characters that might break JSON parsing
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  // Normalize line breaks and indentation
  cleaned = cleaned.replace(/\n\s+/g, ' ');
  
  // Fix common formatting issues
  cleaned = cleaned.replace(/\*\*/g, ''); // Remove markdown bold
  cleaned = cleaned.replace(/- /g, ''); // Remove bullet points
  
  return cleaned;
}

export async function generateTitle(subject: string, topic: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Create a creative and engaging title for a study set about ${topic} in ${subject}.
    The title should be:
    - Concise (max 5-6 words)
    - Memorable
    - Professional
    - Not include emojis or special characters
    
    Return only the title text, without quotes or any formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating title:', error);
    throw new Error('Failed to generate title. Please try again.');
  }
}

export async function generateFlashcards(formData: FormData): Promise<Flashcard[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Generate ${formData.numberOfQuestions} comprehensive flashcards for studying ${formData.topic} in ${formData.subject} at a ${formData.difficulty} level.
    ${formData.additionalInfo ? `Additional context: ${formData.additionalInfo}` : ''}
    ${formData.description ? `Description: ${formData.description}` : ''}
    
    Return a JSON object with ONLY plain text (no markdown, no formatting, no bullet points) in this exact format:
    {
      "flashcards": [
        { 
          "question": "Write the question here without any special formatting",
          "answer": "Write the answer here without any special formatting, bullet points, or markdown"
        }
      ]
    }
    
    Important:
    - Use only plain text
    - No markdown formatting
    - No bullet points
    - No special characters
    - Keep answers concise and in a single paragraph`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = cleanJsonResponse(text);
    
    try {
      const parsed = JSON.parse(cleanJson) as FlashcardResponse;
      return parsed.flashcards.map(card => ({
        question: String(card.question || '').trim(),
        answer: String(card.answer || '').trim()
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

export async function generateQuizOptions(question: string, correctAnswer: string): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `For this question: "${question}"
    The correct answer is: "${correctAnswer}"
    
    Generate 3 additional plausible but incorrect multiple choice options that:
    - Are clearly different from the correct answer
    - Are realistic and related to the topic
    - Have similar length and complexity to the correct answer
    - Don't include "all of the above" or "none of the above"
    
    Return ONLY a JSON array of the 3 incorrect options, no other text.
    Example: ["incorrect option 1", "incorrect option 2", "incorrect option 3"]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean up the response and parse it
    const cleanText = text.replace(/```(json)?\n?|\n?```/g, '').trim();
    const options = JSON.parse(cleanText) as string[];
    
    // Ensure we have exactly 3 options
    if (!Array.isArray(options) || options.length !== 3) {
      throw new Error('Invalid options generated');
    }

    // Randomly insert the correct answer
    const position = Math.floor(Math.random() * 4);
    const allOptions = [...options];
    allOptions.splice(position, 0, correctAnswer);
    
    return allOptions;
  } catch (error) {
    console.error('Error generating quiz options:', error);
    // Return a default set of options with the correct answer
    return [
      correctAnswer,
      'Option not available',
      'Option not available',
      'Option not available'
    ];
  }
}

export async function generateQuiz(formData: FormData): Promise<QuizQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Create a challenging quiz about ${formData.topic} in ${formData.subject} at a ${formData.difficulty} level.
    ${formData.additionalInfo ? `Additional context: ${formData.additionalInfo}` : ''}
    ${formData.description ? `Description: ${formData.description}` : ''}
    
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
        question: String(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        correctAnswer: Number(q.correctAnswer) || 0,
        explanation: String(q.explanation || '')
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