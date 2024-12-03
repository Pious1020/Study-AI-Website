export const FLASHCARD_PROMPT = (topic: string) => `
You are a helpful AI tutor. Create 5 educational flashcards about ${topic}.
Return ONLY a valid JSON object matching this exact structure, with NO additional text or formatting:
{
  "flashcards": [
    {
      "front": "question or term",
      "back": "answer or definition"
    }
  ]
}

Requirements:
- Response must be ONLY valid JSON
- No markdown, no code blocks, no extra text
- Each card must have clear, concise content
- Content must be factually accurate
- Front should be a clear question or term
- Back should be a complete, accurate answer or definition`.trim();

export const QUIZ_PROMPT = (topic: string) => `
You are a helpful AI tutor. Create a 5-question multiple choice quiz about ${topic}.
Return ONLY a valid JSON object matching this exact structure, with NO additional text or formatting:
{
  "questions": [
    {
      "question": "clear question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0
    }
  ]
}

Requirements:
- Response must be ONLY valid JSON
- No markdown, no code blocks, no extra text
- Questions must be clear and unambiguous
- All options must be plausible
- Content must be factually accurate
- correctAnswer must be a valid index (0-3)`.trim();