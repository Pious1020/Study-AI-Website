import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Loader2, GraduationCap, Book, Brain, Sparkles, FileText } from 'lucide-react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { generateFlashcards, generateQuiz } from '../services/gemini';
import ErrorMessage from './ErrorMessage';
import { StudySet, Flashcard, QuizQuestion } from '../types/index';

interface FormData {
  topic: string;
  subject: string;
  difficulty: string;
  description?: string;
  additionalInfo?: string;
  numberOfQuestions: number;
}

export default function CreateStudySet() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState<FormData>({
    topic: '',
    subject: '',
    difficulty: 'intermediate',
    description: '',
    additionalInfo: '',
    numberOfQuestions: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      setError('You must be logged in to create a study set');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      console.log('Starting study set creation...');
      console.log('User:', user);
      console.log('Form data:', formData);

      // Generate flashcards and quiz using AI
      console.log('Generating flashcards and quiz...');
      let flashcards: Flashcard[] = [];
      let quizQuestions: QuizQuestion[] = [];
      
      try {
        const [generatedFlashcards, generatedQuizQuestions] = await Promise.all([
          generateFlashcards(formData),
          generateQuiz(formData)
        ]);
        console.log('Generated flashcards (raw):', flashcards);
        console.log('Generated quiz (raw):', quizQuestions);
      } catch (genError) {
        console.error('Error generating content:', genError);
        throw new Error('Failed to generate study content');
      }

      if (!Array.isArray(flashcards) || !Array.isArray(quizQuestions)) {
        console.error('Invalid data structure:', { flashcards, quizQuestions });
        throw new Error('Generated content has invalid structure');
      }

      // Create the study deck document in Firestore
      console.log('Creating Firestore document...');
      const userId = user.sub;
      if (!userId) {
        throw new Error('User ID not found');
      }
      console.log('Using userId:', userId);

      const now = Timestamp.now();
      
      // First create the base study data
      const studyContent = {
        userId,
        title: formData.topic || 'Untitled Study Set',
        description: formData.description || `A study set about ${formData.topic} in ${formData.subject}`,
        subject: formData.subject || 'General',
        difficulty: formData.difficulty || 'intermediate',
        flashcards,
        quiz: {
          questions: quizQuestions
        }
      };

      // Then create the final Firestore document data with timestamps
      const studyDeckData: Omit<StudySet, 'id'> = {
        ...studyContent,
        createdAt: now,
        updatedAt: now
      };

      // Add the document to Firestore (it will generate the id automatically)
      const studyDeckRef = await addDoc(collection(db, 'studyDecks'), studyDeckData);
      console.log('Study deck created with ID:', studyDeckRef.id);
      
      // Navigate to the library after successful creation
      navigate('/library');
    } catch (err) {
      console.error('Error creating study set:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
      }
      setError(err instanceof Error ? err.message : 'An error occurred while creating the study set');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-apple-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="apple-card space-y-8">
          {/* Header */}
          <div className="text-center">
            <GraduationCap className="h-12 w-12 text-apple-blue mx-auto mb-4" />
            <h1 className="apple-heading text-3xl mb-2">Create Study Set</h1>
            <p className="apple-subheading">
              Let AI craft the perfect study materials for you
            </p>
          </div>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <label htmlFor="topic" className="block text-sm font-medium text-apple-gray-500">
                What would you like to learn about?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="apple-input pl-10"
                  placeholder="e.g., Photosynthesis"
                  required
                />
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-apple-gray-500">
                Subject
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="apple-input pl-10"
                  placeholder="e.g., Biology"
                  required
                />
                <Brain className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-apple-gray-500">
                Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="apple-input pl-10 min-h-[100px]"
                  placeholder="Add a description for your study set..."
                />
                <FileText className="absolute left-3 top-4 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-2">
              <label htmlFor="difficulty" className="block text-sm font-medium text-apple-gray-500">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="apple-input"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Number of Questions Input */}
            <div className="space-y-2">
              <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-apple-gray-500">
                Number of Questions
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleInputChange}
                  className="apple-input pl-10"
                  min="5"
                  max="100"
                  required
                />
                <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apple-gray-300" />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-2">
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-apple-gray-500">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="apple-input"
                placeholder="Add any specific topics or areas you'd like to focus on..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full apple-button flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Generating Study Set...
                </>
              ) : (
                'Create Study Set'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}