import { GoogleGenerativeAI } from '@google/generative-ai';
import { FLASHCARD_PROMPT, QUIZ_PROMPT } from './prompts';
import { validateFlashcardResponse, validateQuizResponse } from './validation';
import { GenerationError } from './types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();

if (!API_KEY) {
  throw new Error(
    'Missing Gemini API key. Please add VITE_GEMINI_API_KEY to your .env file and ensure it is properly configured.'
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function sanitizeResponse(text: string): Promise<string> {
  if (!text) {
    throw new GenerationError('Empty response received from AI');
  }

  // Remove markdown code blocks and extract JSON
  let cleaned = text
    .replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1')
    .trim();

  // Find the first occurrence of a JSON-like structure
  const jsonMatch = cleaned.match(/({[\s\S]*})/);
  if (!jsonMatch) {
    throw new GenerationError('No valid JSON structure found in response');
  }

  return jsonMatch[1];
}

async function parseResponse<T>(response: string, validator: (data: unknown) => data is T): Promise<T> {
  try {
    const cleanedResponse = await sanitizeResponse(response);
    let parsed: unknown;
    
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('Failed to parse JSON:', cleanedResponse);
      throw new GenerationError('Invalid JSON format in AI response');
    }
    
    if (!validator(parsed)) {
      console.error('Response validation failed:', parsed);
      throw new GenerationError('AI response does not match expected format');
    }
    
    return parsed;
  } catch (error) {
    if (error instanceof GenerationError) {
      throw error;
    }
    throw new GenerationError('Failed to process AI response');
  }
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('All retry attempts failed:', lastError);
  throw lastError;
}

async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new GenerationError('Empty response from AI');
    }
    
    return text;
  } catch (error) {
    console.error('Generation error:', error);
    if (error instanceof Error) {
      throw new GenerationError(`AI generation failed: ${error.message}`);
    }
    throw new GenerationError('AI generation failed');
  }
}

export async function generateFlashcards(topic: string) {
  if (!topic.trim()) {
    throw new Error('Topic cannot be empty');
  }

  const operation = async () => {
    try {
      const text = await generateContent(FLASHCARD_PROMPT(topic));
      const parsed = await parseResponse(text, validateFlashcardResponse);
      
      if (!parsed.flashcards.length) {
        throw new GenerationError('No flashcards generated');
      }
      
      return parsed.flashcards.map((card, index) => ({
        id: `card-${index}`,
        ...card
      }));
    } catch (error) {
      console.error('Flashcard generation error:', error);
      if (error instanceof GenerationError) {
        throw new Error(`Failed to generate flashcards: ${error.message}`);
      }
      throw new Error('Failed to generate flashcards. Please try again.');
    }
  };

  return retryWithBackoff(operation);
}

export async function generateQuiz(topic: string) {
  if (!topic.trim()) {
    throw new Error('Topic cannot be empty');
  }

  const operation = async () => {
    try {
      const text = await generateContent(QUIZ_PROMPT(topic));
      const parsed = await parseResponse(text, validateQuizResponse);
      
      if (!parsed.questions.length) {
        throw new GenerationError('No quiz questions generated');
      }
      
      return {
        id: `quiz-${Date.now()}`,
        title: `Quiz: ${topic}`,
        questions: parsed.questions.map((q, index) => ({
          id: `question-${index}`,
          ...q
        }))
      };
    } catch (error) {
      console.error('Quiz generation error:', error);
      if (error instanceof GenerationError) {
        throw new Error(`Failed to generate quiz: ${error.message}`);
      }
      throw new Error('Failed to generate quiz. Please try again.');
    }
  };

  return retryWithBackoff(operation);
}